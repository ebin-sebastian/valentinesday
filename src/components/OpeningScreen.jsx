import React, { useState, useRef, useEffect } from "react";
import { Heart } from "lucide-react";

const OpeningScreen = ({ onUnlock }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  // State for the floating mini-hearts
  const [floatingHearts, setFloatingHearts] = useState([]);
  
  const timerRef = useRef(null);
  const animationFrameRef = useRef();

  const HOLD_DURATION = 3000; 

  // --- Main Hold Logic ---
  const startHolding = () => {
    setIsHolding(true);
    const startTime = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(timerRef.current);
        // Added a small delay so the user sees the completed ring before it switches
        setTimeout(() => {
          if (onUnlock) onUnlock();
        }, 50);
      }
    }, 20);
  };

  const stopHolding = () => {
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };


  // --- Particle System Logic ---

  // 1. Generate new hearts while holding
  useEffect(() => {
    let generationInterval;
    if (isHolding) {
      generationInterval = setInterval(() => {
        const newHeart = {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 40, 
          y: 0,
          speed: 1.5 + Math.random() * 2, 
          scale: 0.3 + Math.random() * 0.5, 
          rotation: Math.random() * 360,
          wobbleSpeed: Math.random() * 0.05 + 0.02, 
          opacity: 1,
        };
        setFloatingHearts((prev) => [...prev, newHeart]);
      }, 80); 
    }
    return () => clearInterval(generationInterval);
  }, [isHolding]);

  // 2. Animate existing floating hearts loop
  const animateParticles = () => {
    setFloatingHearts((prevHearts) => {
      if (prevHearts.length === 0) return prevHearts;
      
      const updatedHearts = prevHearts
        .map((h) => ({
          ...h,
          y: h.y - h.speed, 
          x: h.x + Math.sin(h.y * h.wobbleSpeed) * 0.5, 
          opacity: h.opacity - 0.005, 
          rotation: h.rotation + 1, 
        }))
        .filter((h) => h.opacity > 0 && h.y > -350);

      return updatedHearts;
    });

    animationFrameRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    if (isHolding || floatingHearts.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHolding, floatingHearts.length]); 


  return (
    <div className="min-h-screen w-full bg-[#0a0505] flex flex-col items-center justify-center overflow-hidden selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3d0f0f_0%,_#0a0505_60%)] opacity-80 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center select-none">
        {/* Typography */}
        <h1 
          className="text-7xl md:text-[9rem] text-gray-100 leading-none mb-4 drop-shadow-xl"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Our Love Story
        </h1>

        <p className="text-red-300/70 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-24 font-light">
          Hold to unlock our memories
        </p>

        {/* Interaction Area */}
        <div 
          className="relative flex items-center justify-center group"
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
        >

          {/* Floating Particle Hearts */}
          <div className="absolute top-1/2 left-1/2 pointer-events-none z-0">
            {floatingHearts.map((h) => (
              <Heart
                key={h.id}
                fill="#ef4444"
                style={{
                  position: 'absolute',
                  left: `${h.x}px`,
                  top: `${h.y}px`,
                  opacity: h.opacity,
                  transform: `translate(-50%, -50%) scale(${h.scale}) rotate(${h.rotation}deg)`,
                }}
                className="text-red-500 w-6 h-6"
              />
            ))}
          </div>

          {/* Progress Ring */}
          <svg className="absolute w-[150px] h-[150px] -rotate-90 pointer-events-none z-20">
            <circle
              cx="75" cy="75" r="70"
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="transparent"
            />
            <circle
              cx="75" cy="75" r="70"
              stroke="#ef4444" strokeWidth="3" fill="transparent"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              className="transition-all duration-100 ease-linear drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              style={{ opacity: isHolding || progress > 0 ? 1 : 0 }}
            />
          </svg>

          {/* Outer Circle */}
          <div className={`
            absolute w-36 h-36 rounded-full border border-white/10 transition-transform duration-700 ease-out z-10
            ${isHolding ? 'scale-125 border-red-500/20' : 'scale-100'}
          `} />

          {/* Inner Circle (The Heart Button) */}
          <div className={`
            relative w-24 h-24 rounded-full border flex items-center justify-center
            backdrop-blur-sm transition-all duration-300 ease-out z-30
            cursor-pointer overflow-hidden
            ${isHolding 
               ? 'border-red-500/40 bg-red-900/20 scale-95 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
               : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 scale-100'
             }
          `}>
            <Heart 
              className={`w-8 h-8 text-red-500 fill-red-500 transition-all duration-300
                ${isHolding ? 'scale-110' : 'animate-pulse scale-100'}
              `} 
            />
             <div className={`absolute inset-0 bg-red-500/20 blur-xl transition-opacity duration-500 ${isHolding ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>

        <div className="mt-32 opacity-50">
          <p className="text-[9px] text-red-200 uppercase tracking-[0.6em]">
            Press and Hold
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpeningScreen;