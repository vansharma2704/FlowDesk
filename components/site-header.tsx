"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
export function SiteHeader() { const [open, setOpen] = useState(false); return <header className="site-header"><div className="nav-wrap"><a href="/" aria-label="FlowDesk home"><Brand /></a><button className="menu-button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button><nav className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation"><a href="/features">Product</a><a href="/how-it-works">How it works</a><a href="/#for-teams">For teams</a><span className="nav-spacer"/><a href="/sign-in">Sign in</a><a className="button button-sm" href="/sign-up">Get started</a></nav></div></header>; }
