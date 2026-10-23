"use client";
import { useEffect,useState } from "react";
import { Brand } from "./brand";
export function WelcomeReveal(){const[done,setDone]=useState(false);useEffect(()=>{const id=setTimeout(()=>setDone(true),1750);return()=>clearTimeout(id)},[]);return <div className={`welcome-reveal ${done?"done":""}`} aria-hidden="true"><div><Brand light/><span>Where work finds its flow</span><i/></div></div>}
