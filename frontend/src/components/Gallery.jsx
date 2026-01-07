import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from './Lightbox';

const IMAGES = [
  // Weddings
  { id: 1, src: '/images/wedding.jpg', category: 'Weddings', alt: 'Wedding - Aalishan' },
  { id: 2, src: '/images/wedding.jpg', category: 'Weddings', alt: 'Wedding 2' },

  // Receptions
  { id: 3, src: '/images/birthday.jpg', category: 'Receptions', alt: 'Reception - Aalishan' },
  { id: 4, src: '/images/birthday.jpg', category: 'Receptions', alt: 'Reception 2' },

  // Corporate
  { id: 5, src: '/images/bi.jpg', category: 'Corporate', alt: 'Corporate Event' },
  { id: 6, src: '/images/bi.jpg', category: 'Corporate', alt: 'Corporate 2' },
];

const CATEGORIES = ['All', 'Weddings', 'Receptions', 'Corporate'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return IMAGES;
    return IMAGES.filter(img => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#FFD700] mb-4 text-center">
          Event Gallery
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Weddings · Receptions · Corporate Events
        </p>

        {/* CATEGORY FILTER */}
        <div className="flex justify-center gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeCategory === cat
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* IMAGE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg border border-[#FFD700]/10"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-56 object-cover hover:scale-105 transition duration-300"
                />

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-sm text-[#FFD700] font-semibold">
                    {img.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* CUSTOMER REVIEWS */}  
<div className="mt-20">
  <h3 className="text-3xl font-bold text-center text-[#FFD700] mb-8">
    What Our Clients Say
  </h3>

  <ReviewsCarousel />
</div>


      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filtered}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
