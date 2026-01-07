import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Lightbox({ images = [], startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  useEffect(() => setIndex(startIndex), [startIndex]);

  if (!images.length) return null;

  const prev = () => setIndex(i => (i > 0 ? i - 1 : i));
  const next = () => setIndex(i => (i < images.length - 1 ? i + 1 : i));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image container
      >
        <img src={images[index].src} alt={images[index].alt} className="w-full max-h-[80vh] object-contain rounded-md" />

        {/* caption */}
        <div className="mt-3 text-center text-gray-300">{images[index].alt} — <span className="text-[#FFD700]">{images[index].category}</span></div>

        {/* controls */}
        <button onClick={onClose} className="absolute top-3 right-3 bg-white/10 text-white px-3 py-1 rounded">Close</button>
        <button onClick={prev} disabled={index === 0} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 text-white px-3 py-1 rounded disabled:opacity-40">‹</button>
        <button onClick={next} disabled={index === images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 text-white px-3 py-1 rounded disabled:opacity-40">›</button>
      </motion.div>
    </motion.div>
  );
}
