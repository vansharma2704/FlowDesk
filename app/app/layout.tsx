import { AppNav } from "@/components/app-shell";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { ensureWorkspace, workspaceData } from "@/lib/data";
import { AppTopbar } from "@/components/app-topbar";
export const dynamic="force-dynamic";
export default async function AppLayout({children}:{children:React.ReactNode}){const user=await requireChatGPTUser("/app");const membership=await ensureWorkspace(user),data=await workspaceData(user.userId);const items=[...(data?.projects.map(p=>({id:p.id,label:p.name,href:`/app/projects/${p.id}`,type:"Project" as const}))??[]),...(data?.tasks.map(t=>({id:t.id,label:t.title,href:t.projectId?`/app/projects/${t.projectId}`:"/app/my-tasks",type:"Task" as const}))??[])];return <div className="app-frame"><AppNav workspace={membership.workspace.name} user={user.displayName} signOut={chatGPTSignOutPath("/")}/><div className="app-content"><AppTopbar name={user.displayName} items={items}/><main className="app-main">{children}</main></div></div>}
