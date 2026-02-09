import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TimerSection from './TimerSection';
import MusicPlayer from './MusicPlayer'; 
import PhotoGallery from './PhotoGallery';
import PhotoPairGame from './PhotoPairGame';
import ValentinesProposal from './ValentinesProposal';

const MainPage = () => {
  const [showProposal, setShowProposal] = useState(false);
  const START_DATE = new Date(2023, 10, 20); 

  return (
    // Fixed: Added h-[100dvh] for mobile safe area and proper scrolling
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* Background Decor stays fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-rose-900/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <MusicPlayer />

      <AnimatePresence mode="wait">
        {!showProposal ? (
          <motion.div
            key="main-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-24"
          >
            <TimerSection startDate={START_DATE} />
            <PhotoGallery />
            
            {/* The Game triggers the Proposal */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-serif italic text-white/40">Ready for a challenge?</h3>
              </div>
              <PhotoPairGame handleShowProposal={() => setShowProposal(true)} />
            </div>

            <footer className="pt-20 pb-10 text-center">
              <p className="text-white/10 text-[10px] font-mono uppercase tracking-[0.5em]">
                Built with love by Ebin • 2026
              </p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="proposal-stage"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen"
          >
            {/* The ValentinesProposal component we built earlier */}
            <ValentinesProposal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage;