import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";

const galleryData = [
  { id: 1, category: "Weddings", img: "https://source.unsplash.com/600x400/?wedding-hall" },
  { id: 2, category: "Receptions", img: "https://source.unsplash.com/600x400/?reception" },
  { id: 3, category: "Corporate", img: "https://source.unsplash.com/600x400/?conference-event" },
];

export default function Home() {
  const [activeCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 SHOW LOGIN / REGISTER POPUP ON FIRST LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
    if (!storedUser) {
      setShowAuth(true);
    }
  }, []);

  const handleBookingClick = (e) => {
    if (!user) {
      e.preventDefault(); // stop navigation
      setShowAuth(true); // show login modal
    }
  };

  return (
    <div className="bg-[#fff8e6] min-h-screen text-black">
      {/* 🔐 AUTH MODAL */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* HERO SECTION */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#d4af37] inline-block text-black px-8 py-3 rounded-full font-bold"
        >
          Welcome to Aalishan Vibes
        </motion.h1>

        <p className="text-gray-300 text-lg mt-6 mb-8">
          Experience royal ambience and premium event planning
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/booking-page"
            onClick={handleBookingClick}
            className="bg-white px-6 py-3 rounded-2xl border border-[#d4af37]/40 shadow-xl"
          >
            Book Now
          </Link>

          <Link
            to="/gallery"
            className="bg-white px-6 py-3 rounded-2xl border border-[#d4af37]/40 shadow-xl"
          >
            View Gallery
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-3 gap-6">
        {["Royal Decor", "Easy Booking", "24/7 Support"].map((title, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 p-6 rounded-2xl border border-[#FFD700]/20 shadow-lg"
          >
            <h3 className="text-xl font-bold text-[#FFD700] mb-2">{title}</h3>
            <p className="text-gray-400">
              Luxury services crafted for premium events.
            </p>
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            src={lightbox}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="max-w-3xl rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* WHATSAPP */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        WhatsApp
      </a>
    </div>
  );
}
