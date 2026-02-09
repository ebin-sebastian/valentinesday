import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Calendar, Clock, Heart } from 'lucide-react';

// Helper to calculate time difference immediately
const calculateTimeLeft = (startDate) => {
  const now = new Date();
  const difference = now - startDate;
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountUp = ({ value, className }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  
  // Adjusted physics for a snappier finish
  const springValue = useSpring(motionValue, { 
    damping: 50,    // Slightly lowered damping for faster settle
    stiffness: 100, 
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        // FIX: Changed Math.floor to Math.round
        // This prevents it from getting stuck at 811 (811.9) waiting for the last 0.1
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return <span className={className} ref={ref} />;
};

const TimerSection = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-12 relative"
    >
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-red-800/30 blur-[140px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-rose-700/20 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <p className="text-red-400/80 font-mono text-xs tracking-[0.2em] uppercase pl-1">
          The Timeline
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-white/90 leading-tight">
          I have been the <br />
          <span 
            className="text-red-500 text-6xl md:text-8xl mr-6" 
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            luckiest man alive
          </span> 
          for...
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
        
        {/* Days Card (Big Hero Card) */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="md:col-span-8 relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-xl shadow-2xl hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-default"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex flex-col justify-between h-full gap-8">
            <div className="flex items-center gap-3 text-white/40">
              <Calendar size={18} />
              <span className="font-mono text-xs uppercase tracking-widest">Total Days</span>
            </div>
            
            <div className="flex items-baseline gap-4 md:gap-6">
              
              {/* --- GHOST LAYOUT TECHNIQUE --- */}
              <div className="relative">
                {/* 1. THE GHOST (Reserves Space) */}
                <span className="text-8xl md:text-[10rem] font-bold leading-none tracking-tighter text-transparent opacity-0 tabular-nums">
                  {timeLeft.days}
                </span>

                {/* 2. THE ANIMATOR (Visible) */}
                <div className="absolute inset-0 top-0 left-0">
                  <CountUp 
                    value={timeLeft.days} 
                    className="text-8xl md:text-[10rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tabular-nums"
                  />
                </div>
              </div>

              <span className="text-xl md:text-3xl text-red-400/80 font-serif italic whitespace-nowrap">
                days of pure joy
              </span>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Cards */}
        <div className="md:col-span-4 flex flex-col gap-4">
          
          {/* Precision Timer Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex-1 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-center gap-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-default"
          >
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Clock size={14} />
              <span className="font-mono text-xs uppercase">Precision Timer</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
              <div>
                <CountUp value={timeLeft.hours} className="text-xl font-bold block tabular-nums" />
                <div className="text-[10px] text-gray-500">Hrs</div>
              </div>
              <div>
                <CountUp value={timeLeft.minutes} className="text-xl font-bold block tabular-nums" />
                <div className="text-[10px] text-gray-500">Mins</div>
              </div>
              <div>
                <CountUp value={timeLeft.seconds} className="text-xl font-bold text-red-400 tabular-nums block" />
                <div className="text-[10px] text-gray-500">Sec</div>
              </div>
            </div>
          </motion.div>
          
          {/* Since Date Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-3xl bg-white/5 border border-white/10 p-6 flex items-center justify-between backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] cursor-default"
          >
            <div>
              <div className="text-white/40 text-xs font-mono mb-1">Since</div>
              <div className="text-lg text-white font-serif italic">
                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
               <Heart size={20} className="text-red-500 fill-red-500 animate-pulse" />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default TimerSection;