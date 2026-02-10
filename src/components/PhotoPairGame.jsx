import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trophy, RefreshCcw } from "lucide-react";

// --- CONFIGURATION ---
const images = Array.from({ length: 18 }, (_, i) => `/game-photos/${i + 1}.avif`);

const MOBILE_HEART = [
  [null, 0, 1, null, 2, 3, null],
  [4, 5, 6, 7, 8, 9, 10],
  [null, 11, 12, 13, 14, 15, null],
  [null, null, 16, 17, 18, null, null],
  [null, null, null, 19, null, null, null],
];

const DESKTOP_HEART = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function PhotoPairGame({ handleShowProposal }) {
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { gameImages, currentLayout, totalPairs } = useMemo(() => {
    const layout = isMobile ? MOBILE_HEART : DESKTOP_HEART;
    const flatLayout = layout.flat().filter(idx => idx !== null);
    const pairsCount = flatLayout.length / 2;
    const selectedImages = images.slice(0, pairsCount);
    const shuffled = shuffleArray([...selectedImages, ...selectedImages]);
    
    return { gameImages: shuffled, currentLayout: layout, totalPairs: pairsCount };
  }, [isMobile, gameKey]);

  const handleClick = async (index) => {
    if (selected.length === 2 || matched.includes(index) || selected.includes(index)) return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (gameImages[firstIndex] === gameImages[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIncorrect([firstIndex, index]);
        setTimeout(() => {
          setIncorrect([]);
          setSelected([]);
        }, 400);
      }
    } else {
      setSelected([index]);
    }
  };

  useEffect(() => {
    if (matched.length > 0 && matched.length === gameImages.length) {
      setTimeout(handleShowProposal, 1500);
    }
  }, [matched, gameImages, handleShowProposal]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-white/90 mb-4 tracking-tight">
          Memory <span className="text-red-500 italic">Lane</span>
        </h2>
        <div className="flex items-center justify-center gap-6 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-red-500 fill-red-500" />
            <span className="font-mono text-sm uppercase tracking-widest text-white/60">
              Matches: <span className="text-white font-bold">{matched.length / 2} / {totalPairs}</span>
            </span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <button 
            onClick={() => { setMatched([]); setSelected([]); setGameKey(k => k+1); }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </motion.div>

      {/* Game Board Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl"
      >
        <div 
          className="grid gap-2 md:gap-3 place-items-center"
          style={{ gridTemplateColumns: `repeat(${isMobile ? 7 : 9}, minmax(0, 1fr))` }}
        >
          {currentLayout.flat().map((index, i) => {
            if (index === null) return <div key={`empty-${i}`} className="w-[11vw] h-[11vw] sm:w-16 sm:h-16 md:w-20 md:h-20" />;

            const isFlipped = selected.includes(index) || matched.includes(index);
            const isMatched = matched.includes(index);
            const isIncorrect = incorrect.includes(index);

            return (
              <motion.div
                key={index}
                className="w-[11vw] h-[11vw] sm:w-16 sm:h-16 md:w-20 md:h-20 relative cursor-pointer group"
                whileHover={{ scale: 1.08, y: -4, rotateZ: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(index)}
              >
                <motion.div
                  className="w-full h-full relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* --- POLISHED CARD BACK --- */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Radial Bloom on Hover */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Heartbeat Pulse Icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10"
                    >
                      <Heart 
                        size={22} 
                        className="text-white/20 fill-white/10 group-hover:text-red-500/80 group-hover:fill-red-500/40 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                      />
                    </motion.div>

                    {/* Glass Shine Layer */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.05)_50%,transparent_80%)] -rotate-45 pointer-events-none group-hover:translate-x-[15%] group-hover:translate-y-[15%] transition-transform duration-1000" />
                  </div>

                  {/* --- CARD FRONT (IMAGE) --- */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-xl overflow-hidden border-2 shadow-2xl ${
                      isMatched ? "border-green-500/40" : isIncorrect ? "border-red-500" : "border-white/30"
                    }`}
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                  >
                    <img 
                      src={gameImages[index]} 
                      className={`w-full h-full object-cover transition-all duration-500 ${isMatched ? 'opacity-40 grayscale' : 'opacity-100'}`} 
                      alt="" 
                    />
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-green-500/20 p-2 rounded-full backdrop-blur-sm">
                           <Trophy size={20} className="text-green-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Global Ambient Red Glow */}
                <div className="absolute -inset-2 bg-red-500/0 group-hover:bg-red-500/10 blur-xl transition-all duration-300 -z-10 rounded-full" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Instructional Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-white/30 font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        Complete the heart to unlock the surprise
      </motion.div>
    </div>
  );
}