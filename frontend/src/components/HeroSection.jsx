import { useState } from 'react';
import { motion } from 'framer-motion';
import BookingForm from './BookingForm';
import heroImg from '../assets/logo.png'; // replace with your asset

export default function HeroSection() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <section className="relative w-full min-h-[70vh] bg-black text-white">
      <img src={heroImg} alt="Aalishan Royal Hall" className="absolute inset-0 w-full h-full object-cover opacity-40" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Experience <span className="text-[#ffd700]">Aalishan</span> Royal Halls
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            Make your special moments unforgettable — elegant halls, bespoke service & regal vibe.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowBooking(true)}
              className="px-6 py-3 rounded-2xl bg-[#ffd700] text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              Book Now
            </button>
            <a href="#gallery" className="px-6 py-3 rounded-2xl border border-[#ffd700] hover:bg-[#111]">
              View Gallery
            </a>
          </div>
        </motion.div>
      </div>

      {showBooking && <BookingForm onClose={() => setShowBooking(false)} />}
    </section>
  );
}
