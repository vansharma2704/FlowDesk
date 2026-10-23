"use client";
import { useEffect } from "react";
import { WelcomeReveal } from "./welcome-reveal";

const revealSelectors=[
 ".shared-system>header>*",".map-center",".map-node",
 ".views-intro>*",".view-showcase",".fake-tabs",".fake-task",".view-caption",
 ".coordination-copy>*",".people-visual",".people-project",".person-card",".comment-bubble",
 ".language-demo",".prompt-card",".structured-card",".language-copy>*",
 ".team-use>header>*",".team-use article",
 ".new-final>*",".footer-top>div",".footer-bottom>*"
].join(",");

export function VisualEffects(){
 useEffect(()=>{
  const sections=[...document.querySelectorAll<HTMLElement>(".marketing main > section, .marketing > footer")];
  const reveals=[...document.querySelectorAll<HTMLElement>(revealSelectors)];
  sections.forEach((section,index)=>section.classList.add("motion-section",`scene-${index}`));
  reveals.forEach((el,index)=>{el.classList.add("motion-item");el.style.setProperty("--item-delay",`${(index%5)*65}ms`);if(index%3===1)el.classList.add("from-left");if(index%3===2)el.classList.add("from-right")});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{const target=entry.target as HTMLElement;target.classList.toggle("in-view",entry.isIntersecting);if(target.classList.contains("motion-section")){target.querySelectorAll(".motion-item").forEach(node=>node.classList.toggle("in-view",entry.isIntersecting))}}),{threshold:.1,rootMargin:"-4% 0px -8%"});
  sections.forEach(el=>observer.observe(el));
  const hero=document.querySelector<HTMLElement>(".new-hero");
  const heroMove=(e:PointerEvent)=>{if(!hero)return;const r=hero.getBoundingClientRect();hero.style.setProperty("--mx",`${(e.clientX-r.left)/r.width*100}%`);hero.style.setProperty("--my",`${(e.clientY-r.top)/r.height*100}%`)};
  hero?.addEventListener("pointermove",heroMove);
  const tilts=[...document.querySelectorAll<HTMLElement>(".new-hero-stage,.system-map,.view-showcase,.people-visual,.language-demo")];
  const tiltCleanups=tilts.map(el=>{const tilt=(e:PointerEvent)=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty("--rx",`${-y*4}deg`);el.style.setProperty("--ry",`${x*5}deg`)};const reset=()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")};el.addEventListener("pointermove",tilt);el.addEventListener("pointerleave",reset);return()=>{el.removeEventListener("pointermove",tilt);el.removeEventListener("pointerleave",reset)}});
  let frame=0;
  const updateScroll=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight,progress=max>0?scrollY/max:0;document.documentElement.style.setProperty("--page-progress",`${progress*100}%`);sections.forEach(section=>{const r=section.getBoundingClientRect(),center=(r.top+r.height/2-innerHeight/2)/innerHeight;section.style.setProperty("--section-shift",`${Math.max(-1,Math.min(1,center))*-22}px`)});};
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(updateScroll)};updateScroll();addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll,{passive:true});
  return()=>{observer.disconnect();hero?.removeEventListener("pointermove",heroMove);tiltCleanups.forEach(fn=>fn());removeEventListener("scroll",onScroll);removeEventListener("resize",onScroll);if(frame)cancelAnimationFrame(frame)};
 },[]);
 return <><WelcomeReveal/><div className="scroll-progress" aria-hidden="true"/><div className="ambient-cursor" aria-hidden="true"/></>;
}
