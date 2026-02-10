import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TimerSection from './TimerSection';
import MusicPlayer from './MusicPlayer'; 
import PhotoGallery from './PhotoGallery';
import PhotoPairGame from './PhotoPairGame';

const MainPage = () => {
  const [showProposal, setShowProposal] = useState(false);
  const [isReady, setIsReady] = useState(false); // New state to prevent mounting lag
  const START_DATE = new Date(2023, 10, 20); 

  // Use a tiny effect delay to let the OpeningScreen unmount before we start heavy lifting
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const pageEntryVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, // Reduced from 100 for better responsiveness
      filter: "blur(12px)", // Reduced from 20px (heavy for GPU)
      scale: 0.99 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1.0, // Snappier feel
        ease: [0.22, 1, 0.36, 1], // Custom Quintic ease
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* Fixed Background - Stays static to prevent repaints */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-rose-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <MusicPlayer />

      <motion.div
        variants={pageEntryVariants}
        initial="hidden"
        animate={isReady ? "visible" : "hidden"}
        style={{ 
          willChange: "transform, opacity, filter", // Pre-warm the GPU
          backfaceVisibility: "hidden" 
        }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {!showProposal ? (
            <motion.div
              key="main-content"
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-24"
            >
              {/* Content only renders when the animation starts, reducing initial mount lag */}
              {isReady && (
                <>
                  <TimerSection startDate={START_DATE} />
                  
                  <PhotoGallery />
                  
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-serif italic text-white/40">Ready for a challenge?</h3>
                    </div>
                    <PhotoPairGame handleShowProposal={() => setShowProposal(true)} />
                  </div>
                </>
              )}

              <footer className="pt-20 pb-10 text-center opacity-30">
                <p className="text-[10px] font-mono uppercase tracking-[0.5em]">
                  Built with love by Ebin • 2026
                </p>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="proposal-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center">
                <h2 className="text-5xl font-serif">Will you stay forever?</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MainPage;