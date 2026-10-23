"use server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { authUsers } from "@/db/schema";
import { createSession,hashPassword,normalizeEmail,safeReturnTo,validEmail,verifyPassword } from "./password-auth";

function value(form:FormData,key:string,max:number){return String(form.get(key)??"").trim().slice(0,max)}
function fail(path:string,message:string,returnTo:string){redirect(`${path}?error=${encodeURIComponent(message)}&returnTo=${encodeURIComponent(returnTo)}`)}

export async function signInWithPassword(form:FormData){
  const email=normalizeEmail(value(form,"email",254)),password=value(form,"password",256),returnTo=safeReturnTo(value(form,"returnTo",500));
  if(!validEmail(email)||!password)fail("/sign-in","Enter a valid email and password.",returnTo);
  const user=(await getDb().select().from(authUsers).where(eq(authUsers.email,email)).limit(1))[0];
  if(!user||!(await verifyPassword(password,user.passwordSalt,user.passwordHash)))fail("/sign-in","Email or password is incorrect.",returnTo);
  await createSession(user.id);redirect(returnTo);
}

export async function signUpWithPassword(form:FormData){
  const name=value(form,"name",100),email=normalizeEmail(value(form,"email",254)),password=value(form,"password",256),returnTo=safeReturnTo(value(form,"returnTo",500),"/onboarding");
  if(name.length<2)fail("/sign-up","Enter your full name.",returnTo);
  if(!validEmail(email))fail("/sign-up","Enter a valid email address.",returnTo);
  if(password.length<8)fail("/sign-up","Password must be at least 8 characters.",returnTo);
  if((await getDb().select({id:authUsers.id}).from(authUsers).where(eq(authUsers.email,email)).limit(1))[0])fail("/sign-up","An account with this email already exists.",returnTo);
  const id=crypto.randomUUID(),passwordData=await hashPassword(password);
  await getDb().insert(authUsers).values({id,email,name,passwordHash:passwordData.hash,passwordSalt:passwordData.salt,createdAt:new Date()});
  await createSession(id);redirect(returnTo);
}
