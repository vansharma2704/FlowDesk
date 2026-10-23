import { requireChatGPTUser } from "../chatgpt-auth";
import { workspaceData } from "@/lib/data";
import { HomeDashboard } from "@/components/home-dashboard";
import { EmptyHomeDashboard } from "@/components/empty-home-dashboard";
export const dynamic="force-dynamic";
export default async function Overview(){const user=await requireChatGPTUser("/app"),data=await workspaceData(user.userId);if(!data)return null;if(!data.tasks.length)return <EmptyHomeDashboard name={user.displayName} projects={data.projects} memberCount={data.members.length}/>;const now=new Date(),today=now.toISOString().slice(0,10),hour=Number(new Intl.DateTimeFormat("en-US",{hour:"numeric",hour12:false,timeZone:"Asia/Kolkata"}).format(now));const greeting=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";return <HomeDashboard name={user.displayName} userId={user.userId} today={today} now={now.toISOString()} greetingLabel={greeting} tasks={data.tasks.map(t=>({...t,updatedAt:t.updatedAt.toISOString()}))} projects={data.projects.map(p=>({...p,updatedAt:p.updatedAt.toISOString()}))}/>}
