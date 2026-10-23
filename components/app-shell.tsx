"use client";
import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban, ListTodo, Menu, Settings, Users, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
const links=[[/app$/,"/app","Overview",BarChart3],[/projects/,"/app/projects","Projects",FolderKanban],[/my-tasks/,"/app/my-tasks","My Tasks",ListTodo],[/team/,"/app/team","Team",Users],[/settings/,"/app/settings","Settings",Settings]] as const;
export function AppNav({workspace,user,signOut}:{workspace:string;user:string;signOut:string}){const path=usePathname(),[open,setOpen]=useState(false);return <><button className="mobile-app-menu" onClick={()=>setOpen(!open)} aria-label="Toggle app navigation">{open?<X/>:<Menu/>}</button><aside className={`app-sidebar ${open?"open":""}`}><a href="/"><Brand light/></a><div className="workspace-switch"><span>{workspace.slice(0,1).toUpperCase()}</span><div><b>{workspace}</b><small>Workspace</small></div></div><nav>{links.map(([match,href,label,Icon])=><a key={href} href={href} className={match.test(path)?"active":""}><Icon/>{label}</a>)}</nav><div className="sidebar-user"><span>{user.slice(0,2).toUpperCase()}</span><div><b>{user}</b><a href={signOut}>Sign out</a></div></div></aside></>}
