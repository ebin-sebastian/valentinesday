import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

const MEMORIES = [
  { id: 1, url: 'https://picsum.photos/seed/love1/800/1000', caption: 'The Day We Met' },
  { id: 2, url: 'https://picsum.photos/seed/love2/800/800', caption: 'Our First Date' },
  { id: 3, url: 'https://picsum.photos/seed/love3/1000/800', caption: 'Late Night Walks' },
  { id: 4, url: 'https://picsum.photos/seed/love4/800/1000', caption: 'That One Sunset' },
  { id: 5, url: 'https://picsum.photos/seed/love5/800/800', caption: 'Coffee Mornings' },
  { id: 6, url: 'https://picsum.photos/seed/love6/1000/800', caption: 'Just Us' },
];

const PhotoGallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <p className="text-red-400/80 font-mono text-xs tracking-[0.2em] uppercase pl-1">
          Captured Moments
        </p>
        <h2 className="text-4xl md:text-6xl font-serif text-white/90">
          Our <span className="italic text-red-500">Memory</span> Lane
        </h2>
      </div>

      {/* Masonry-style Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {MEMORIES.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => setSelectedImg(photo)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            {/* Image */}
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
              <Maximize2 className="text-white mb-2" size={20} />
              <p className="text-white font-serif italic text-sm text-center">{photo.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- PROFESSIONAL LIGHTBOX (Full Screen View) --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImg(null)}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/50 hover:text-white"
              whileTap={{ scale: 0.9 }}
            >
              <X size={32} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImg.url}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                alt="Selected"
              />
              <p className="mt-6 text-xl md:text-3xl text-white font-serif italic text-center">
                {selectedImg.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;