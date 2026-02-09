import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const Visualizer = ({ isPlaying }) => (
  <div className="flex items-end gap-0.5 h-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          height: isPlaying ? [4, Math.random() * 12 + 4, 4] : 2,
          backgroundColor: isPlaying ? '#ef4444' : '#555'
        }}
        transition={{ 
          duration: 0.4, 
          repeat: isPlaying ? Infinity : 0, 
          delay: i * 0.1 
        }}
        className="w-1 rounded-full"
      />
    ))}
  </div>
);

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);
  
  const SONG_URL = "/your-song.mp3"; 
  const SONG_TITLE = "Our Beautiful Love Story - Your Favorite Song     "; 

  const togglePlay = (e) => {
    e.stopPropagation(); 
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    // Fixed: Better responsive positioning (centered on mobile, right-aligned on desktop)
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 flex items-center justify-center w-auto max-w-[90vw]">
      <audio ref={audioRef} src={SONG_URL} loop />

      <motion.div 
        initial={{ width: "120px", opacity: 0, y: 50 }}
        animate={{ 
          width: isExpanded ? "210px" : "120px", 
          opacity: 1, 
          y: 0 
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="h-14 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center pr-4 shadow-2xl cursor-pointer overflow-hidden group hover:border-white/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => !window.matchMedia('(max-width: 768px)').matches && setIsExpanded(true)}
        onMouseLeave={() => !window.matchMedia('(max-width: 768px)').matches && setIsExpanded(false)}
      >
        
        {/* Left: Vinyl Disc */}
        <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center"
          >
             <div className="w-3 h-3 bg-red-500 rounded-full" />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-black transition-all text-white"
            >
              {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5"/>}
            </button>
          </div>
        </div>

        {/* Right: Info Area */}
        <div className="flex flex-col justify-center gap-0.5 overflow-hidden flex-1 pl-1">
          <div className="flex items-center justify-between w-full pr-2">
             <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40">
               {isPlaying ? 'Playing' : 'Paused'}
             </span>
             <Visualizer isPlaying={isPlaying} />
          </div>

          <AnimatePresence mode='wait'>
            {isExpanded ? (
               <motion.div 
                 key="marquee"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full overflow-hidden relative h-5 flex items-center"
               >
                 <motion.div
                   animate={{ x: ["0%", "-50%"] }}
                   transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                   className="flex gap-4 whitespace-nowrap"
                 >
                   <span className="text-red-500 text-sm italic font-serif">{SONG_TITLE}</span>
                   <span className="text-red-500 text-sm italic font-serif">{SONG_TITLE}</span>
                 </motion.div>
               </motion.div>
            ) : (
               <motion.div 
                 key="visualizer-bottom"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex items-center h-4 opacity-40"
               >
                 <Visualizer isPlaying={isPlaying} />
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;