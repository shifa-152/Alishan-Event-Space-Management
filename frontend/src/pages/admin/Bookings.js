// frontend/src/pages/admin/Bookings.jsx
import { useEffect, useState } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [hallFilter, setHallFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchBookings();
    const onUpdated = () => fetchBookings();
    window.addEventListener("bookings-updated", onUpdated);
    return () => window.removeEventListener("bookings-updated", onUpdated);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/booking/admin/bookings");
      const json = await res.json();
      if (json.success) {
        setBookings(json.data || []);
        setFiltered(json.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/booking/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [search, dateFilter, hallFilter, statusFilter, bookings]);

  const applyFilters = () => {
    let temp = [...bookings];
    if (search) temp = temp.filter(b => (b.name || "").toLowerCase().includes(search.toLowerCase()));
    if (dateFilter) temp = temp.filter(b => (b.date || b.eventDate) === dateFilter);
    if (hallFilter) temp = temp.filter(b => b.hall === hallFilter);
    if (statusFilter) temp = temp.filter(b => (b.status || "").toLowerCase() === statusFilter.toLowerCase());
    setFiltered(temp);
  };

  if (loading) return <p>Loading bookings...</p>;

  const today = new Date().toISOString().split("T")[0];
  const isPastDate = (date) =>
    date && new Date(date).toISOString().split("T")[0] < today;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="bg-white shadow rounded p-6 overflow-x-auto">
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Hall</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Slot</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => {
              const bookingDateStr = b.date
                ? new Date(b.date).toISOString().split("T")[0]
                : "";
              const isPast = bookingDateStr && bookingDateStr < today;

              return (
                <tr key={b._id} className="border">
                  <td className="p-3 border">{b.name || "-"}</td>
                  <td className="p-3 border">{b.phone || "-"}</td>
                  <td className="p-3 border">{b.email || "-"}</td>
                  <td className="p-3 border">{b.hall || "-"}</td>
                  <td className="p-3 border">{b.date || "-"}</td>
                  <td className="p-3 border">{b.slot || "-"}</td>
                  <td className="p-3 border">₹{b.price ?? "-"}</td>

                  {/* PAYMENT COLUMN */}
                  <td className="p-3 border text-sm">
                    <div>
                      <strong>Mode:</strong>{" "}
                      {b.paymentMode === "online" ? "Online" :
                       b.paymentMode === "cash_on_visit" ? "Cash on Visit" : "-"}
                    </div>

                    {b.paymentMode === "online" && (
                      <div className={b.isPaid ? "text-green-600" : "text-red-600"}>
                        {b.isPaid ? `Paid ₹${b.amountPaid}` : "Not Paid"}
                      </div>
                    )}

                    {b.paymentMode === "cash_on_visit" && (
                      <>
                        <div>Advance: ₹{b.advanceAmount ?? 0}</div>
                        <div>Expected: {b.advanceExpectedDate || "-"}</div>
                        <div
                          className={
                            !b.advancePaid && isPastDate(b.advanceExpectedDate)
                              ? "text-red-600 font-semibold"
                              : b.advancePaid
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {b.advancePaid
                            ? "Advance Paid"
                            : isPastDate(b.advanceExpectedDate)
                            ? "Advance NOT paid yet"
                            : "Advance Pending"}
                        </div>
                      </>
                    )}
                  </td>

                  <td className="p-3 border capitalize">{b.status || "pending"}</td>

                  <td className="p-3 flex gap-2">
                    {isPast ? (
                      <>
                        <button onClick={() => updateStatus(b._id, "visited")} className="px-3 py-1 bg-indigo-600 text-white rounded">Visited</button>
                        <button onClick={() => updateStatus(b._id, "not_visited")} className="px-3 py-1 bg-gray-600 text-white rounded">Not Visited</button>
                      </>
                    ) : b.status === "pending" ? (
                      <>
                        <button onClick={() => updateStatus(b._id, "approved")} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                        <button onClick={() => updateStatus(b._id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                      </>
                    ) : (
                      <span className="text-gray-500 italic">No actions</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
