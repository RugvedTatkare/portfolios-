import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';

export default function App(){
 const [progress,setProgress]=useState(0); const lenisRef=useRef<Lenis|null>(null);
 useEffect(()=>{const lenis=new Lenis({duration:1.25,smoothWheel:true,syncTouch:true});lenisRef.current=lenis;const onScroll=({scroll,limit}:{scroll:number;limit:number})=>setProgress(limit?Math.min(1,Math.max(0,scroll/limit)):0);lenis.on('scroll',onScroll);let raf=0;const frame=(t:number)=>{lenis.raf(t);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)lenis.stop();return()=>{cancelAnimationFrame(raf);lenis.destroy()}},[]);
 return <main className="site" id="top"><div className="scene-wrap" aria-hidden="true"><Canvas dpr={[1,1.5]} shadows camera={{position:[0,2.3,11],fov:48,near:.1,far:220}} gl={{antialias:true,powerPreference:'high-performance'}}><Scene progress={progress}/></Canvas></div><Overlay progress={progress}/><div className="scroll-track"><section className="scroll-space scroll-space--intro"/><section className="scroll-space"/><section className="scroll-space"/><section className="scroll-space"/><section className="scroll-space"/><section className="scroll-space scroll-space--final"/></div></main>
}