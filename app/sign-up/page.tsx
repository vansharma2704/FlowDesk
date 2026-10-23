import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { getChatGPTUser } from "../chatgpt-auth";
import { safeReturnTo } from "../password-auth";
export const dynamic="force-dynamic";
export default async function SignUp({searchParams}:{searchParams:Promise<{error?:string;returnTo?:string}>}){if(await getChatGPTUser())redirect("/app");const params=await searchParams;return <AuthPage mode="up" error={params.error} returnTo={safeReturnTo(params.returnTo??null,"/onboarding")}/>}
