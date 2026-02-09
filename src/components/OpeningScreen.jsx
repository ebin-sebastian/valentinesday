import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const OpeningScreen = ({ onUnlock }) => {
  const [progress, setProgress] = useState(0);
  const [hearts, setHearts] = useState([]);
  const intervalRef = useRef(null);

  // Configuration
  const FILL_TIME = 2000; 
  const UPDATE_INTERVAL = 10; 

  const startHolding = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (FILL_TIME / UPDATE_INTERVAL);
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return newProgress;
      });

      // --- Particle Physics ---
      if (Math.random() < 0.4) { 
        const newHeart = {
          id: Date.now() + Math.random(),
          targetX: (Math.random() - 0.5) * 100, 
          scale: Math.random() * 0.6 + 0.3, 
          rotation: (Math.random() - 0.5) * 40,
        };
        
        setHearts((prev) => [...prev, newHeart]);

        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 3000); 
      }
    }, UPDATE_INTERVAL);
  };

  const stopHolding = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 2; 
      });
    }, 5);
  };

  useEffect(() => {
    if (progress >= 100) onUnlock();
  }, [progress, onUnlock]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden font-serif select-none">
      
      {/* --- Styles --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        @keyframes wave1 {
          0% { top: -40%; left: -30%; transform: scale(1) rotate(0deg); }
          33% { top: -10%; left: -10%; transform: scale(1.1) rotate(60deg); }
          66% { top: -35%; left: 10%; transform: scale(0.9) rotate(120deg); }
          100% { top: -40%; left: -30%; transform: scale(1) rotate(0deg); }
        }
        @keyframes wave2 {
          0% { bottom: -40%; right: -30%; transform: scale(1) rotate(0deg); }
          33% { bottom: -10%; right: -10%; transform: scale(1.1) rotate(-60deg); }
          66% { bottom: -35%; right: 10%; transform: scale(0.9) rotate(-120deg); }
          100% { bottom: -40%; right: -30%; transform: scale(1) rotate(-360deg); }
        }
        
        @keyframes smoothPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239,68,68,0)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(239,68,68,0.6)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239,68,68,0)); }
        }

        .ambient-glow {
          position: absolute;
          width: 130vmax; 
          height: 130vmax;
          background: radial-gradient(circle at center, rgba(220, 38, 38, 0.45) 0%, rgba(153, 27, 27, 0.2) 35%, rgba(0,0,0,0) 70%);
          animation: wave1 22s infinite ease-in-out;
          filter: blur(140px); 
          opacity: 0.7;
          z-index: 0;
          pointer-events: none;
        }
        .ambient-glow-2 {
          position: absolute;
          width:  100vmax;
          height: 100vmax;
          background: radial-gradient(circle at center, rgba(244, 63, 94, 0.4) 0%, rgba(136, 19, 55, 0.2) 35%, rgba(0,0,0,0) 70%);
          animation: wave2 28s infinite ease-in-out reverse;
          filter: blur(160px);
          opacity: 0.6;
          z-index: 0;
          pointer-events: none;
        }

        .animate-smooth-pulse {
          animation: smoothPulse 2s infinite ease-in-out;
        }
      `}</style>
      
      {/* Background Layers */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center gap-12 relative">
        <div className="text-center space-y-4 relative z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl text-white tracking-wide drop-shadow-2xl mix-blend-overlay"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Our Love Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-red-100/90 uppercase tracking-[0.3em] text-xs md:text-sm font-light"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hold to unlock our memories
          </motion.p>
        </div>

        {/* Interactive Button */}
        <div className="relative group w-40 h-40 flex items-center justify-center">
          <button
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            className={`
              absolute inset-0 flex items-center justify-center outline-none tap-highlight-transparent cursor-pointer 
              transition-transform duration-500 ease-out
              active:scale-95 hover:scale-105
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* 1. LAYER ONE: Glass Background Circle (Bottom) */}
            <div 
              className={`
                w-20 h-20 rounded-full transition-all duration-500 ease-out backdrop-blur-md border border-white/5 absolute z-10
                ${progress > 0 
                  ? 'bg-white/10 shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
                  : 'bg-transparent group-hover:bg-white/5 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'}
              `}
            />

            {/* 2. LAYER TWO: Floating Hearts (Middle - On top of glass, behind main heart) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-20">
               <AnimatePresence>
                {hearts.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0.8, 0], 
                      y: -400,                 
                      x: h.targetX,            
                      scale: h.scale,
                      rotate: h.rotation
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 2.5,           
                      ease: "easeOut" 
                    }}
                    className="absolute"
                    style={{ transformOrigin: "center center" }}
                  >
                    <Heart fill="#ef4444" className="text-red-500/90 drop-shadow-md" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 3. LAYER THREE: SVG Ring (Middle-Top) */}
            <svg className="w-40 h-40 transform -rotate-90 pointer-events-none absolute z-30">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="transparent"
                className="transition-all duration-300 group-hover:stroke-white/30"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#ef4444"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]"
              />
            </svg>

            {/* 4. LAYER FOUR: Main Heart Icon (Top) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
              <Heart 
                size={32}
                fill="#ef4444" 
                className={`
                  text-red-500 transition-all duration-500
                  ${progress > 0 
                     ? 'scale-100 animate-none' 
                     : 'animate-smooth-pulse group-hover:animate-none group-hover:scale-110'} 
                `}
              />
            </div>
          </button>
        </div>
      </div>

      <motion.div 
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 text-white/30 text-[10px] uppercase tracking-widest z-10"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Press and hold
      </motion.div>
    </div>
  );
};

export default OpeningScreen;