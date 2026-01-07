import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";

Modal.setAppElement('#root'); // Accessibility

export default function HallCalendar() {
  const [bookings, setBookings] = useState([]); // list of booked dates
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Fetch booked dates (demo data)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Replace with your backend API
        const res = await axios.get("/api/bookings"); 
        setBookings(res.data); 
      } catch {
        // Demo booked dates if no backend
        setBookings(["2025-11-25", "2025-11-28", "2025-12-01"]);
      }
    };
    fetchBookings();
  }, []);

  const isBooked = (date) => {
    return bookings.some(
      (booking) => new Date(booking).toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date) => {
    if (!isBooked(date)) {
      setSelectedDate(date);
      setModalOpen(true);
    } else {
      alert(`Hall is already booked on ${date.toDateString()}`);
    }
  };

  const handleBooking = async () => {
    const newBooking = selectedDate.toISOString().split("T")[0];
    setBookings([...bookings, newBooking]);
    setModalOpen(false);
    setUserName("");

    // Send to backend (optional)
    try {
      await axios.post("/api/bookings", { date: newBooking, name: userName });
    } catch {
      console.log("Booking saved locally (demo mode)");
    }

    alert(`Hall booked on ${selectedDate.toDateString()}!`);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Hall Availability Calendar</h2>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          isBooked(date)
            ? "bg-red-500 text-white rounded"
            : "bg-yellow-300 rounded"
        }
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <h2 className="text-lg font-bold mb-4">Book Hall on {selectedDate?.toDateString()}</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleBooking}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
        >
          Confirm Booking
        </button>
      </Modal>
    </div>
  );
}
