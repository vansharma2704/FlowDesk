import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Flag, LayoutList, MessageSquare, MoreHorizontal } from "lucide-react";
import { requireChatGPTUser } from "../../../chatgpt-auth";
import { projectData } from "@/lib/data";
import { TaskForm } from "@/components/task-form";
import { ProjectMemberList, ProjectMembers } from "@/components/project-members";
import { ProjectWorkspace } from "@/components/project-workspace";

export const dynamic="force-dynamic";
export default async function Project({params}:{params:Promise<{projectId:string}>}){
 const {projectId}=await params,user=await requireChatGPTUser(`/app/projects/${projectId}`),data=await projectData(user.userId,projectId);if(!data)notFound();
 const done=data.projectTasks.filter(t=>t.status==="done").length,inProgress=data.projectTasks.filter(t=>t.status==="in_progress").length,pc=data.projectTasks.length?Math.round(done/data.projectTasks.length*100):0,canManage=data.member.role==="owner";
 return <div className="project-detail">
  <a className="back-link" href="/app/projects"><ArrowLeft/> All projects</a>
  <section className="project-hero"><div className="project-symbol">{data.project.name.slice(0,1).toUpperCase()}</div><div className="project-identity"><div><span>ACTIVE PROJECT</span><button aria-label="Project options"><MoreHorizontal/></button></div><h1>{data.project.name}</h1><p>{data.project.description||"A focused workspace for the outcome, the people, and every next step."}</p><ProjectMembers projectId={projectId} members={data.members} assigned={data.projectMembers} canManage={canManage}/></div><div className="progress-orbit"><div style={{"--progress":`${pc*3.6}deg`} as React.CSSProperties}><span><b>{pc}%</b><small>complete</small></span></div><p>{done} of {data.projectTasks.length} tasks done</p></div></section>
  <div className="project-tabs"><a className="active" href="#tasks"><LayoutList/> Tasks <b>{data.projectTasks.length}</b></a><a href="#members">Members <b>{data.projectMembers.length}</b></a><a href="#activity">Activity</a></div>
  <div className="project-dashboard"><main><div id="tasks"><ProjectWorkspace projectId={projectId} tasks={data.projectTasks} members={data.members} comments={data.comments}/></div><section className="create-panel" id="new-task"><header><div><span>CREATE</span><h2>Add the next step</h2></div><p>Keep it clear, assignable, and easy to finish.</p></header><TaskForm projectId={projectId} members={data.members}/></section></main>
   <aside><section className="side-card"><span>PROJECT HEALTH</span><h3>On track</h3><div className="health-row"><i/><div><b>{inProgress} tasks moving</b><small>{done} completed so far</small></div></div><div className="health-row"><Clock3/><div><b>{data.project.dueDate||"No deadline"}</b><small>{data.project.dueDate?"Target completion":"Set a date when ready"}</small></div></div><div className="health-row"><Flag/><div><b>{data.projectTasks.filter(t=>t.priority==="high"&&t.status!=="done").length} high priority</b><small>Still open</small></div></div></section><section className="side-card" id="members"><div className="side-title"><div><span>PROJECT TEAM</span><h3>{data.projectMembers.length} members</h3></div></div>{data.projectMembers.length?<ProjectMemberList projectId={projectId} assigned={data.projectMembers} canManage={canManage}/>:<p className="side-empty">Add workspace members so ownership stays visible.</p>}</section><section className="side-card activity-card" id="activity"><span>RECENT ACTIVITY</span><div><MessageSquare/><p><b>Project workspace created</b><small>Ready for the first update</small></p></div></section></aside>
  </div>
 </div>
}
