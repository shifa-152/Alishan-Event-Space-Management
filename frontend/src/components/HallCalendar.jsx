import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

Modal.setAppElement("#root");

const timeSlots = ["Morning (9am-12pm)", "Afternoon (1pm-4pm)", "Evening (5pm-8pm)"];

export default function HallCalendar() {
  const [bookings, setBookings] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/bookings"); // Replace with your backend API
        setBookings(res.data);
      } catch {
        // Demo bookings
        setBookings({
          "2025-11-25": ["Morning (9am-12pm)"],
          "2025-11-28": ["Afternoon (1pm-4pm)"],
        });
      }
    };
    fetchBookings();
  }, []);

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getBookingStatus = (date) => {
    const day = date.toISOString().split("T")[0];
    const bookedCount = bookings[day]?.length || 0;

    if (isPastDate(date)) return "past";
    if (bookedCount === 0) return "available"; // Green
    if (bookedCount < timeSlots.length) return "partial"; // Yellow
    return "full"; // Red
  };

  const handleDateClick = (date) => {
    if (isPastDate(date)) {
      alert("You cannot book a past date!");
      return;
    }

    const status = getBookingStatus(date);
    if (status === "full") {
      alert(`All slots are booked on ${date.toDateString()}`);
      return;
    }

    setSelectedDate(date.toISOString().split("T")[0]);
    setModalOpen(true);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Hall Availability
      </h2>
      <Calendar
        onClickDay={handleDateClick}
        tileClassName={({ date }) => {
          const status = getBookingStatus(date);
          switch (status) {
            case "past":
              return "bg-gray-400 text-white rounded-lg cursor-not-allowed";
            case "available":
              return "bg-green-400 text-white rounded-lg shadow-sm";
            case "partial":
              return "bg-yellow-300 rounded-lg shadow-sm";
            case "full":
              return "bg-red-500 text-white rounded-lg shadow-md";
            default:
              return "";
          }
        }}
        tileContent={({ date }) => {
          const status = getBookingStatus(date);
          if (status === "past") return <div title="Cannot book past dates"></div>;
          if (status === "full") return <div title="All slots booked"></div>;
          if (status === "partial") return <div title="Some slots available"></div>;
          return <div title="All slots available"></div>;
        }}
      />

      {/* Booking Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded-2xl shadow-2xl outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">
          Book Hall on {selectedDate}
        </h2>

        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <label className="font-semibold mb-2 block">Select Time Slot:</label>
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">-- Select Slot --</option>
          {timeSlots.map((slot) => {
            const isBooked = bookings[selectedDate]?.includes(slot);
            return (
              <option key={slot} value={slot} disabled={isBooked}>
                {slot} {isBooked ? "(Already Booked)" : ""}
              </option>
            );
          })}
        </select>

        <button
          onClick={() => {
            if (!selectedSlot || !userName) return alert("Enter name and select slot!");
            const updatedBookings = { ...bookings };
            if (!updatedBookings[selectedDate]) updatedBookings[selectedDate] = [];
            updatedBookings[selectedDate].push(selectedSlot);
            setBookings(updatedBookings);
            setModalOpen(false);
            setUserName("");
            setSelectedSlot("");

            try {
              axios.post("/api/bookings", {
                date: selectedDate,
                slot: selectedSlot,
                name: userName,
              });
            } catch {
              console.log("Booking saved locally (demo mode)");
            }

            alert(
              `Your booking for ${selectedSlot} on ${selectedDate} is successful! Wait for confirmation from the admin.`
            );
          }}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg transition-all duration-200"
        >
          Confirm Booking
        </button>
      </Modal>
    </div>
  );
}
