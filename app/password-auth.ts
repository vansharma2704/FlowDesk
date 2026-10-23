import "server-only";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { authSessions, authUsers } from "@/db/schema";

export const SESSION_COOKIE="flowdesk_session";
const SESSION_DAYS=30,ITERATIONS=210_000;

export function normalizeEmail(value:string){return value.trim().toLowerCase().slice(0,254)}
export function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
export function safeReturnTo(value:string|null,fallback="/app"){if(!value||!value.startsWith("/")||value.startsWith("//"))return fallback;try{const url=new URL(value,"https://flowdesk.local");return url.origin==="https://flowdesk.local"?`${url.pathname}${url.search}${url.hash}`:fallback}catch{return fallback}}

export async function hashPassword(password:string,salt?:string){const actualSalt=salt??randomHex(16),key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]),bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:hexBytes(actualSalt),iterations:ITERATIONS},key,256);return {salt:actualSalt,hash:bytesHex(new Uint8Array(bits))}}
export async function verifyPassword(password:string,salt:string,expected:string){const {hash}=await hashPassword(password,salt);return timingSafeEqual(hash,expected)}
export async function hashToken(token:string){const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return bytesHex(new Uint8Array(digest))}

export async function createSession(userId:string){const token=randomHex(32),now=new Date(),expiresAt=new Date(now.getTime()+SESSION_DAYS*86400000);await getDb().insert(authSessions).values({id:crypto.randomUUID(),userId,tokenHash:await hashToken(token),createdAt:now,expiresAt});const jar=await cookies();jar.set(SESSION_COOKIE,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",expires:expiresAt});}
export async function getSessionUser(){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(!token)return null;const rows=await getDb().select({id:authUsers.id,email:authUsers.email,name:authUsers.name}).from(authSessions).innerJoin(authUsers,eq(authSessions.userId,authUsers.id)).where(and(eq(authSessions.tokenHash,await hashToken(token)),gt(authSessions.expiresAt,new Date()))).limit(1);return rows[0]??null}
export async function destroySession(){const jar=await cookies(),token=jar.get(SESSION_COOKIE)?.value;if(token)await getDb().delete(authSessions).where(eq(authSessions.tokenHash,await hashToken(token)));jar.delete(SESSION_COOKIE)}

function randomHex(length:number){const bytes=new Uint8Array(length);crypto.getRandomValues(bytes);return bytesHex(bytes)}
function bytesHex(bytes:Uint8Array){return Array.from(bytes,byte=>byte.toString(16).padStart(2,"0")).join("")}
function hexBytes(hex:string){return Uint8Array.from(hex.match(/.{1,2}/g)?.map(byte=>parseInt(byte,16))??[])}
function timingSafeEqual(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
