import { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guests: "",
    notes: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.name.length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return "Phone must be 10 digits";
    }

    if (!formData.eventType) {
      return "Please select event type";
    }

    if (!formData.eventDate) {
      return "Please select event date";
    }

    if (formData.guests && formData.guests <= 0) {
      return "Guests must be greater than 0";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage("❌ " + error);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage("✅ Booking submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          eventDate: "",
          guests: "",
          notes: ""
        });
      } else {
        setMessage("❌ Booking failed.");
      }
    } catch {
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Alishan Event Space</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

        <select name="eventType" value={formData.eventType} onChange={handleChange} required>
          <option value="">Select Event Type</option>
          <option value="wedding">Wedding</option>
          <option value="reception">Reception</option>
          <option value="corporate">Corporate</option>
          <option value="birthday">Birthday</option>
        </select>

        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />

        <input type="number" name="guests" placeholder="Number of Guests" value={formData.guests} onChange={handleChange} />

        <textarea name="notes" placeholder="Additional Notes" value={formData.notes} onChange={handleChange}></textarea>

        <button type="submit">Book Now</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
