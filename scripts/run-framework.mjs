import { spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { readExecutionProfile } from "./execution-profile.mjs";

const [command, ...args] = process.argv.slice(2);
if (!["dev", "build"].includes(command)) throw new Error("Expected dev or build.");
const managedLinux = readExecutionProfile() === "managed-linux";

function hasExplicitPort(values) {
  return values.some((value, index) =>
    value.startsWith("--port=") || value === "--port" && values[index + 1],
  );
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ host: "127.0.0.1", port }, () =>
      server.close(() => resolve(true)),
    );
  });
}

async function findDevelopmentPort(start = 5173, attempts = 20) {
  for (let port = start; port < start + attempts; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(
    `No available development port found between ${start} and ${start + attempts - 1}.`,
  );
}

if (managedLinux && command === "build") {
  const result = spawnSync("bash", [
    fileURLToPath(new URL("./build-verified.sh", import.meta.url)), ...args,
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

// Import in this process so the preview owner retains its PID and signals.
const cli = new URL(managedLinux
  ? "../node_modules/vite/bin/vite.js"
  : "../node_modules/vinext/dist/cli.js", import.meta.url);
const automaticPort = !managedLinux && command === "dev" && !hasExplicitPort(args)
  ? await findDevelopmentPort()
  : null;

if (automaticPort && automaticPort !== 5173) {
  console.log(`Port 5173 is in use; starting FlowDesk on port ${automaticPort} instead.`);
}

process.argv = [process.execPath, fileURLToPath(cli), command,
  ...(automaticPort ? ["--port", String(automaticPort)] : []), ...args];
await import(cli.href);
