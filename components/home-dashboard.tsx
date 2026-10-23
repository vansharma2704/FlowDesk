"use client";
import { updateTaskStatus } from "@/app/actions";
import { Activity,ArrowRight,Check,FolderKanban,ListChecks,Plus,Users } from "lucide-react";

type Task={id:string;title:string;description:string;status:string;priority:string;dueDate:string|null;projectId:string|null;assigneeId:string|null;createdBy:string;updatedAt:string};
type Project={id:string;name:string;description:string;dueDate:string|null;updatedAt:string};

export function HomeDashboard({name,userId,tasks,projects,today,now,greetingLabel}:{name:string;userId:string;tasks:Task[];projects:Project[];today:string;now:string;greetingLabel:string}){
  const mine=tasks.filter(task=>task.assigneeId===userId),open=mine.filter(task=>task.status!=="done"),dueToday=open.filter(task=>task.dueDate===today),done=tasks.filter(task=>task.status==="done").length,completion=tasks.length?Math.round(done/tasks.length*100):0;
  return <div className="home-dashboard simple-home">
    <section className="simple-hero"><div><span>{greetingLabel.toUpperCase()}</span><h1>Welcome back, {name.split(" ")[0]}</h1><p>Here is the work that needs your attention.</p></div><div className="home-actions"><a className="secondary" href="/app/team"><Users/> Add member</a><a href="/app/projects?new=1"><Plus/> New project</a></div></section>

    <section className="simple-summary">
      <a href="/app/my-tasks"><i><ListChecks/></i><div><span>MY OPEN TASKS</span><b>{open.length}</b><small>{dueToday.length?`${dueToday.length} due today`:"Nothing due today"}</small></div><ArrowRight/></a>
      <a href="/app/projects"><i><FolderKanban/></i><div><span>ACTIVE PROJECTS</span><b>{projects.length}</b><small>Open project workspace</small></div><ArrowRight/></a>
      <div className="summary-progress"><i><Check/></i><div><span>WORK COMPLETED</span><b>{completion}%</b><small>{done} of {tasks.length} tasks done</small></div><div className="summary-ring" style={{background:`conic-gradient(#ef5963 ${completion}%,#eee9e6 0)`}}><em/></div></div>
    </section>

    <div className="simple-overview-grid">
      <section className="simple-panel task-panel"><header><div><ListChecks/><span><b>My tasks</b><small>Work assigned to you</small></span></div><a href="/app/my-tasks">See all <ArrowRight/></a></header><div className="simple-task-list">{open.length?open.slice(0,6).map(task=><article key={task.id}><form action={updateTaskStatus}><input type="hidden" name="taskId" value={task.id}/><input type="hidden" name="status" value="done"/><button aria-label={`Complete ${task.title}`}><Check/></button></form><a href={task.projectId?`/app/projects/${task.projectId}`:"/app/my-tasks"}><b>{task.title}</b><span>{projectName(task.projectId,projects)}</span></a><em className={task.dueDate&&task.dueDate<today?"late":""}>{formatDue(task.dueDate,today)}</em></article>):<div className="simple-empty"><Check/><b>You’re all caught up</b><p>No open tasks are assigned to you.</p></div>}</div></section>

      <aside>
        <section className="simple-panel"><header><div><FolderKanban/><span><b>Projects</b><small>Your active work</small></span></div><a href="/app/projects">See all <ArrowRight/></a></header><div className="simple-project-list">{projects.slice(0,4).map((project,index)=>{const projectTasks=tasks.filter(task=>task.projectId===project.id),projectDone=projectTasks.filter(task=>task.status==="done").length,percent=projectTasks.length?Math.round(projectDone/projectTasks.length*100):0;return <a href={`/app/projects/${project.id}`} key={project.id}><i className={`project-color c${index%4}`}>{project.name.slice(0,1)}</i><div><b>{project.name}</b><span>{projectTasks.length} tasks · {percent}% complete</span><em><i style={{width:`${percent}%`}}/></em></div><ArrowRight/></a>})}</div></section>
        <section className="simple-panel updates-panel"><header><div><Activity/><span><b>Recent updates</b><small>Latest workspace activity</small></span></div></header><div>{tasks.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,3).map(task=><a href={task.projectId?`/app/projects/${task.projectId}`:"/app/my-tasks"} key={task.id}><i>{task.status==="done"?<Check/>:<Activity/>}</i><span><b>{task.title}</b><small>{task.status==="done"?"Completed":"Updated"} · {relativeDate(task.updatedAt,now)}</small></span></a>)}</div></section>
      </aside>
    </div>
    <section className="next-actions"><header><span>QUICK START</span><h2>Move work forward</h2></header><div><a href={projects[0]?`/app/projects/${projects[0].id}#new-task`:"/app/projects?new=1"}><i><Plus/></i><span><b>Create a task</b><small>Add an owner, priority, and deadline.</small></span><ArrowRight/></a><a href="/app/team"><i><Users/></i><span><b>Invite your team</b><small>Bring people into the workspace.</small></span><ArrowRight/></a><a href={projects[0]?`/app/projects/${projects[0].id}`:"/app/projects?new=1"}><i><FolderKanban/></i><span><b>Open project board</b><small>Switch between list and board views.</small></span><ArrowRight/></a></div></section>
  </div>
}

function projectName(id:string|null,projects:Project[]){return projects.find(project=>project.id===id)?.name||"Personal task"}
function formatDue(date:string|null,today:string){if(!date)return "No due date";if(date===today)return "Due today";return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`))}
function relativeDate(value:string,now:string){const days=Math.floor((new Date(now).getTime()-new Date(value).getTime())/86400000);return days<=0?"Today":days===1?"Yesterday":`${days} days ago`}
