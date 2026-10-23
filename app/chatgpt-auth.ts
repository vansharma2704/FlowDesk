import { redirect } from "next/navigation";
import { getSessionUser, safeReturnTo } from "./password-auth";

export type ChatGPTUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const user=await getSessionUser();
  return user?{userId:user.id,displayName:user.name,email:user.email,fullName:user.name}:null;
}

export async function requireChatGPTUser(
  returnTo: string,
): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;

  redirect(chatGPTSignInPath(returnTo));
}

export function chatGPTSignInPath(returnTo: string): string {
  return `/sign-in?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

export function chatGPTSignOutPath(returnTo = "/"): string {
  return `/auth/sign-out?returnTo=${encodeURIComponent(safeReturnTo(returnTo,"/"))}`;
}
