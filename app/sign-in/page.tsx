import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { getChatGPTUser } from "../chatgpt-auth";
import { safeReturnTo } from "../password-auth";
export const dynamic="force-dynamic";
export default async function SignIn({searchParams}:{searchParams:Promise<{error?:string;returnTo?:string}>}){if(await getChatGPTUser())redirect("/app");const params=await searchParams;return <AuthPage mode="in" error={params.error} returnTo={safeReturnTo(params.returnTo??null)}/>}
