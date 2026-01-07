import { useEffect, useState } from "react";

export default function BookingTable({ bookings, refreshStats, refreshBookings }) {
  const [localBookings, setLocalBookings] = useState([]);

  // Sync incoming props
  useEffect(() => {
    setLocalBookings(bookings ?? []);
  }, [bookings]);


  // --- Update Status Function (Approve/Cancel) ---
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/booking/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const json = await res.json();
      const updated = json.data;

      // Update instantly on UI
      setLocalBookings(prev =>
        prev.map(b => (b._id === id ? updated : b))
      );

      // Refresh dashboard
      refreshStats();
      refreshBookings();

    } catch (err) {
      console.error("Error updating status:", err);
    }
  };


  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-[#b8860b]">All Bookings</h3>

      <div className="overflow-x-auto">
        <table className="w-full border rounded overflow-hidden">
          <thead>
            <tr className="bg-black text-[#d4af37]">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {localBookings.length === 0 ? (
              <tr>
                <td colSpan="6"
                    className="text-center p-4 text-gray-500 italic">
                  No bookings found
                </td>
              </tr>
            ) : (
              localBookings.map(b => (
                <tr key={b._id} className="border-b hover:bg-[#fff9e6]">
                  <td className="p-3 text-black">{b.name}</td>
                  <td className="p-3 text-black">{b.eventType}</td>
                  <td className="p-3 text-black">
                    {b.eventDate ? new Date(b.eventDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3 text-black">{b.guests}</td>

                  <td className={`p-3 font-semibold 
                    ${b.status === "approved" 
                      ? "text-green-600" 
                      : b.status === "cancelled" 
                      ? "text-red-600" 
                      : "text-orange-500"}`}>
                    {b.status}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(b._id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "cancelled")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
