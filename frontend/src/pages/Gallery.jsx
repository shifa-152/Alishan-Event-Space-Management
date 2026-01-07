import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const images = {
  weddings: [
    "/images/wedding.jpg",
    "/images/wedding.jpg",
    "/images/wedding.jpg",
  ],
  receptions: [
    "/images/birthday.jpg",
    "/images/birthday.jpg",
    "/images/birthday.jpg",
  ],
  corporate: [
    "/images/bi.jpg",
    "/images/bi.jpg",
    "/images/bi.jpg",
  ],
};

// ✅ REVIEWS CAROUSEL COMPONENT
function ReviewsCarousel() {
  const sliderRef = useRef(null);

  const reviews = [
    {
      name: "Ayesha Khan",
      text: "Aalishan Event Space made our wedding absolutely magical. The decor and service were royal!",
      rating: 5,
    },
    {
      name: "Rahul Mehta",
      text: "Perfect venue for our corporate meet. Professional staff and elegant ambience.",
      rating: 5,
    },
    {
      name: "Sana Shaikh",
      text: "Beautiful lighting, stunning hall and smooth booking process. Highly recommended!",
      rating: 4,
    },
  ];

  // ✅ Auto sliding effect
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (slider) {
        scrollAmount += 320;
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0;
        }
        slider.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={sliderRef} className="flex gap-6 overflow-x-auto px-4 pb-6 mt-6">
      {reviews.map((review, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="min-w-[320px] bg-gradient-to-b from-gray-900 to-black border border-[#FFD700]/30 rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-300 italic mb-4">“{review.text}”</p>

          {/* STAR RATINGS */}
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < review.rating ? "text-[#FFD700]" : "text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <h4 className="text-[#FFD700] font-semibold text-right">
            — {review.name}
          </h4>
        </motion.div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [category, setCategory] = useState("weddings");
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="bg-[#fff8e6] min-h-screen p-10 text-black">
      <h2 className="text-4xl font-bold text-center text-[#FFD700] mb-8">
        Event Gallery
      </h2>

      {/* CATEGORY FILTERS */}
      <div className="flex justify-center gap-4 mb-10">
        {["weddings", "receptions", "corporate"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
category === cat
? "bg-[#d4af37] text-black"
: "border border-[#d4af37] text-[#b8860b]"
}`}

          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* IMAGE GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {images[category].map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt="event"
            whileHover={{ scale: 1.05 }}
            onClick={() => setLightbox(img)}
            className="rounded-3xl cursor-pointer shadow-xl border border-[#d4af37]/30"

          />
        ))}
      </div>

      {/* ✅ CUSTOMER REVIEWS SECTION */}
      <div className="mt-20">
        <h3 className="text-3xl font-bold text-center text-[#FFD700] mb-8">
          What Our Clients Say
        </h3>
        <ReviewsCarousel />
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-white/90 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <motion.img
            src={lightbox}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
