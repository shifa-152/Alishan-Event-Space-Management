import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/booking/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.put(
        `${API_BASE_URL}/booking/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBookings(); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Hall</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t text-center">
                <td className="p-2">{b.hall?.name}</td>
                <td>{new Date(b.eventDate).toDateString()}</td>
                <td>{b.slot}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      b.status === "approved"
                        ? "bg-green-600"
                        : b.status === "rejected"
                        ? "bg-red-600"
                        : b.status === "cancelled"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  {b.status === "pending" ? (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
