"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

export function InteractiveMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse position values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Calculate mouse position relative to the center of the container
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  // Smooth springs for physics-based movement
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // 3D Tilt transforms
  const rotateX = useTransform(smoothY, [-300, 300], [8, -8])
  const rotateY = useTransform(smoothX, [-500, 500], [-8, 8])

  // Parallax translation layers (different depths)
  const parallaxX_bg = useTransform(smoothX, [-500, 500], [-10, 10])
  const parallaxY_bg = useTransform(smoothY, [-300, 300], [-10, 10])

  const parallaxX_layer1 = useTransform(smoothX, [-500, 500], [20, -20])
  const parallaxY_layer1 = useTransform(smoothY, [-300, 300], [20, -20])

  const parallaxX_layer2 = useTransform(smoothX, [-500, 500], [40, -40])
  const parallaxY_layer2 = useTransform(smoothY, [-300, 300], [40, -40])
  
  const parallaxX_layer3 = useTransform(smoothX, [-500, 500], [60, -60])
  const parallaxY_layer3 = useTransform(smoothY, [-300, 300], [60, -60])

  // Dynamic glare effect based on mouse
  const glareX = useTransform(smoothX, [-500, 500], ["0%", "100%"])
  const glareY = useTransform(smoothY, [-300, 300], ["0%", "100%"])
  const glareOpacity = useTransform(smoothX, [-500, 500], [0.1, 0.4])

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto mt-10 mb-24 flex h-[350px] w-full max-w-5xl items-center justify-center sm:h-[450px]"
      style={{ perspective: "1200px" }}
    >
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 1; transform: scale(1.1) translate(-45%, -50%); }
        }
        @keyframes pulse-slow-right {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1) translate(-10px, 10px); }
        }
        /* CSS float fallback when not hovered */
        @keyframes float-idle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-idle-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        
        .animate-float-idle { animation: float-idle 8s ease-in-out infinite; }
        .animate-float-idle-delayed { animation: float-idle 9s ease-in-out 1s infinite; }
        .animate-float-idle-reverse { animation: float-idle-reverse 7s ease-in-out 2s infinite; }
      `}</style>

      {/* Interactive Background Orbs (Depth 0) */}
      <motion.div 
        style={{ x: parallaxX_bg, y: parallaxY_bg }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* Massive overlapping pastel orbs to create a full screen mesh gradient, exactly like the concept image */}
        <div className="absolute top-[0%] left-[10%] -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-sky-200/60 blur-[150px] dark:bg-sky-400/30" style={{ animation: 'pulse-slow 8s ease-in-out infinite' }} />
        <div className="absolute top-[10%] right-[-10%] -z-10 h-[700px] w-[700px] rounded-[100%] bg-amber-100/60 blur-[150px] dark:bg-amber-400/20" style={{ animation: 'pulse-slow-right 10s ease-in-out 1s infinite' }} />
        <div className="absolute bottom-[-20%] left-[20%] -z-10 h-[900px] w-[900px] rounded-[100%] bg-pink-200/60 blur-[150px] dark:bg-pink-500/20" style={{ animation: 'pulse-slow-right 9s ease-in-out 2s infinite' }} />
      </motion.div>

      {/* 3D Tilt Container for all cards */}
      <motion.div
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: "preserve-3d" 
        }}
        className="relative flex h-full w-full items-center justify-center"
      >
        
        {/* CENTER DASHBOARD (Depth 1) */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          style={{ 
            x: parallaxX_layer1, 
            y: parallaxY_layer1,
            translateZ: 20 // 3D pop
          }}
          className={`absolute z-10 ${!isHovered ? 'animate-float-idle' : ''}`}
        >
          <div className="group relative flex h-[280px] w-[420px] flex-col overflow-hidden rounded-3xl border-2 border-white/80 bg-white/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-300 sm:h-[340px] sm:w-[600px]">
            
            {/* Dynamic Interactive Glare */}
            <motion.div 
              className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
              style={{
                background: useTransform(
                  [glareX, glareY], 
                  ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`
                ),
                opacity: isHovered ? glareOpacity : 0,
                transition: "opacity 0.3s"
              }}
            />

            {/* Top Header */}
            <div className="flex h-12 w-full items-center gap-3 border-b border-white/40 bg-white/40 px-4">
               <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 text-[10px] font-bold text-white shadow-inner">ui</div>
               <div className="text-xs font-bold text-slate-800">ui.artbloom</div>
               <div className="ml-auto hidden gap-4 sm:flex">
                 <div className="h-2 w-12 rounded bg-slate-400/30" />
                 <div className="h-2 w-12 rounded bg-slate-400/30" />
                 <div className="h-2 w-12 rounded bg-slate-400/30" />
               </div>
               <div className="ml-4 flex gap-1.5 sm:ml-0">
                 <div className="size-2.5 rounded-full bg-slate-300" />
                 <div className="size-2.5 rounded-full bg-slate-300" />
               </div>
            </div>
            
            <div className="flex flex-1 p-4">
              {/* Sidebar */}
              <div className="hidden w-[35%] flex-col gap-3 pr-4 sm:flex">
                <div className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-blue-400 text-[11px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.39)] transition-transform hover:scale-105 active:scale-95">Button</div>
                <div className="flex gap-2">
                   <div className="flex h-8 flex-1 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-[10px] text-sky-600 transition-colors hover:bg-sky-100">Input name</div>
                   <div className="flex h-8 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-[10px] text-slate-500 transition-colors hover:bg-slate-50">Password</div>
                </div>
                <div className="h-8 w-full rounded-full bg-white/80 shadow-sm border border-white" />
                <div className="mt-4 flex items-center gap-3">
                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"><motion.div animate={{ width: ["20%", "80%", "40%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="h-full rounded-full bg-blue-400" /></div>
                   <div className="size-4 rounded-full bg-blue-400 shadow-sm" />
                </div>
                <div className="mt-auto flex justify-between px-2">
                  <motion.div whileHover={{ scale: 1.5 }} className="size-4 cursor-pointer rounded-full bg-cyan-300 shadow-sm" />
                  <motion.div whileHover={{ scale: 1.5 }} className="size-4 cursor-pointer rounded-full bg-amber-400 shadow-sm" />
                  <motion.div whileHover={{ scale: 1.5 }} className="size-4 cursor-pointer rounded-full bg-red-400 shadow-sm" />
                </div>
              </div>
              {/* Main Content Area */}
              <div className="flex flex-1 flex-col gap-4 sm:border-l sm:border-white/40 sm:pl-4">
                <div className="flex gap-4">
                   <motion.div whileHover={{ y: -5 }} className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-blue-100 text-blue-500 shadow-sm transition-colors hover:bg-blue-200"><svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></motion.div>
                   <motion.div whileHover={{ y: -5 }} className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-green-100 text-green-500 shadow-sm transition-colors hover:bg-green-200"><svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></motion.div>
                   <motion.div whileHover={{ y: -5 }} className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-orange-100 text-orange-500 shadow-sm transition-colors hover:bg-orange-200"><svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></motion.div>
                </div>
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl bg-white/80 p-4 shadow-sm border border-white">
                   <div className="text-[10px] font-bold text-slate-700">Analytics Graph</div>
                   <motion.svg 
                     initial={{ opacity: 0, pathLength: 0 }}
                     animate={{ opacity: 1, pathLength: 1 }}
                     transition={{ duration: 2, ease: "easeInOut" }}
                     className="absolute bottom-2 left-0 right-0 h-16 w-full" preserveAspectRatio="none" viewBox="0 0 100 100"
                   >
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        d="M0,100 C20,80 30,90 50,40 C70,-10 80,60 100,20" fill="none" stroke="url(#gradient)" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" 
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                   </motion.svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* LEFT CARD (Depth 2 - More pronounced parallax) */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotate: -15 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
          style={{ 
            x: parallaxX_layer2, 
            y: parallaxY_layer2,
            translateZ: 60 // Closer to camera
          }}
          className={`absolute left-0 top-6 z-20 sm:left-4 sm:top-10 ${!isHovered ? 'animate-float-idle-delayed' : ''}`}
        >
          <div className="group relative flex h-[220px] w-[200px] flex-col justify-center gap-5 overflow-hidden rounded-3xl border-2 border-white/90 bg-white/70 p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:h-[280px] sm:w-[240px]">
             
             {/* Left card Glare */}
             <motion.div 
              className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
              style={{
                background: useTransform(
                  [glareX, glareY], 
                  ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)`
                ),
                opacity: isHovered ? glareOpacity : 0,
                transition: "opacity 0.3s"
              }}
            />

             {/* Item 1 */}
             <motion.div whileHover={{ x: 5 }} className="flex cursor-pointer items-center gap-3 transition-transform">
               <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 shadow-inner sm:size-12">
                  <div className="size-4 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               </div>
               <div className="flex-1 space-y-2">
                 <div className="text-[11px] font-bold text-slate-700">Button</div>
                 <div className="h-1.5 w-full rounded-full bg-slate-300/60" />
                 <div className="h-1.5 w-4/5 rounded-full bg-slate-300/60" />
               </div>
             </motion.div>
             {/* Item 2 */}
             <motion.div whileHover={{ x: 5 }} className="flex cursor-pointer items-center gap-3 transition-transform">
               <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 shadow-inner sm:size-12">
                  <div className="size-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
               </div>
               <div className="flex-1 space-y-2">
                 <div className="text-[11px] font-bold text-slate-700">Cards</div>
                 <div className="h-1.5 w-5/6 rounded-full bg-slate-300/60" />
                 <div className="h-1.5 w-full rounded-full bg-slate-300/60" />
               </div>
             </motion.div>
             {/* Item 3 */}
             <motion.div whileHover={{ x: 5 }} className="flex cursor-pointer items-center gap-3 transition-transform">
               <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 shadow-inner sm:size-12">
                  <div className="h-4 w-4 rounded-sm bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
               </div>
               <div className="flex-1 space-y-2">
                 <div className="text-[11px] font-bold text-slate-700">Forms</div>
                 <div className="h-1.5 w-3/4 rounded-full bg-slate-300/60" />
                 <div className="h-1.5 w-5/6 rounded-full bg-slate-300/60" />
               </div>
             </motion.div>
          </div>
        </motion.div>

        {/* TOP RIGHT CODE CARD (Depth 3 - Extreme Parallax) */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotate: 15 }}
          animate={{ opacity: 1, x: 0, rotate: 6 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          style={{ 
            x: parallaxX_layer3, 
            y: parallaxY_layer3,
            translateZ: 100 // Closest to camera
          }}
          className={`absolute right-0 top-0 z-30 sm:right-10 sm:top-4 ${!isHovered ? 'animate-float-idle-reverse' : ''}`}
        >
          <div className="h-[140px] w-[200px] rounded-2xl border border-slate-600 bg-slate-900/95 p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl sm:h-[160px] sm:w-[240px]">
            <div className="mb-4 flex gap-1.5">
              <motion.div whileHover={{ scale: 1.5 }} className="size-2.5 cursor-pointer rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
              <motion.div whileHover={{ scale: 1.5 }} className="size-2.5 cursor-pointer rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <motion.div whileHover={{ scale: 1.5 }} className="size-2.5 cursor-pointer rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <div className="font-mono text-[10px] leading-relaxed text-slate-300">
               <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                 <span className="text-pink-400">import</span> {"{ "}Button{" }"} <span className="text-pink-400">from</span> <span className="text-amber-300">'@ui'</span>
               </motion.span>
               <br />
               <br />
               <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                 <span className="text-pink-400">export</span> <span className="text-blue-400">default</span> <span className="text-emerald-400">App</span>() {"{"}
               </motion.span>
               <br />
               <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                 &nbsp;&nbsp;<span className="text-pink-400">return</span> &lt;<span className="text-blue-300">Button</span> /&gt;
               </motion.span>
               <br />
               <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                 {"}"}
               </motion.span>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM RIGHT ICONS CARD (Depth 1.5) */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          style={{ 
            x: parallaxX_layer2, 
            y: parallaxY_layer1,
            translateZ: 40 // Middle depth
          }}
          className={`absolute right-8 bottom-0 z-20 sm:right-24 sm:bottom-4 ${!isHovered ? 'animate-float-idle' : ''}`}
        >
          <div className="group relative overflow-hidden h-[90px] w-[180px] rounded-2xl border-2 border-white/90 bg-white/70 p-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:h-[110px] sm:w-[220px]">
             
             <motion.div 
              className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
              style={{
                background: useTransform(
                  [glareX, glareY], 
                  ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)`
                ),
                opacity: isHovered ? glareOpacity : 0,
                transition: "opacity 0.3s"
              }}
            />

             <div className="mb-2 text-[10px] font-bold text-slate-600">Icons:</div>
             <div className="flex justify-between px-2">
                <motion.div whileHover={{ y: -5, scale: 1.1 }} className="flex cursor-pointer flex-col items-center gap-1.5 transition-transform">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500 shadow-sm sm:h-10 sm:w-10"><svg className="size-4 sm:size-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
                   <span className="text-[9px] font-semibold text-slate-500">Star</span>
                </motion.div>
                <motion.div whileHover={{ y: -5, scale: 1.1 }} className="flex cursor-pointer flex-col items-center gap-1.5 transition-transform">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 shadow-sm sm:h-10 sm:w-10"><svg className="size-4 sm:size-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                   <span className="text-[9px] font-semibold text-slate-500">User</span>
                </motion.div>
                <motion.div whileHover={{ y: -5, scale: 1.1 }} className="flex cursor-pointer flex-col items-center gap-1.5 transition-transform">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 shadow-sm sm:h-10 sm:w-10"><svg className="size-4 sm:size-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg></div>
                   <span className="text-[9px] font-semibold text-slate-500">Bell</span>
                </motion.div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
