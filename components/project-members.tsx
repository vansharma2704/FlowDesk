"use client";
import { useState } from "react";
import { Check, ChevronDown, Plus, UserPlus, X } from "lucide-react";
import { addProjectMember, removeProjectMember } from "@/app/actions";

type Member={id:string;name:string;email:string;role:string};
type Assigned={memberId:string;name:string;email:string;role:string};

export function ProjectMembers({projectId,members,assigned,canManage}:{projectId:string;members:Member[];assigned:Assigned[];canManage:boolean}){
 const[open,setOpen]=useState(false);const available=members.filter(m=>!assigned.some(a=>a.memberId===m.id));
 return <div className="project-people"><div className="people-stack">{assigned.slice(0,4).map((m,i)=><span key={m.memberId} style={{zIndex:10-i}} title={`${m.name} · ${m.email}`}>{initials(m.name)}</span>)}{assigned.length>4&&<span className="more">+{assigned.length-4}</span>}{!assigned.length&&<small>No members yet</small>}</div>{canManage&&<div className="member-picker"><button type="button" className="member-trigger" onClick={()=>setOpen(!open)}><UserPlus/> Add members <ChevronDown/></button>{open&&<div className="member-popover"><header><div><b>Add project members</b><span>Give workspace members access to this project.</span></div><button onClick={()=>setOpen(false)} aria-label="Close"><X/></button></header><div className="member-options">{available.length?available.map(m=><form action={addProjectMember} key={m.id}><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="memberId" value={m.id}/><div className="person-avatar">{initials(m.name)}</div><div><b>{m.name}</b><span>{m.email}</span></div><button aria-label={`Add ${m.name}`}><Plus/></button></form>):<div className="picker-empty"><Check/> Everyone in the workspace is already here.</div>}</div></div>}</div>}</div>
}
export function ProjectMemberList({projectId,assigned,canManage}:{projectId:string;assigned:Assigned[];canManage:boolean}){return <div className="project-member-list">{assigned.map(m=><article key={m.memberId}><span>{initials(m.name)}</span><div><b>{m.name}</b><small>{m.email}</small></div><em>{m.role}</em>{canManage&&<form action={removeProjectMember}><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="memberId" value={m.memberId}/><button aria-label={`Remove ${m.name}`}><X/></button></form>}</article>)}</div>}
function initials(name:string){return name.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
