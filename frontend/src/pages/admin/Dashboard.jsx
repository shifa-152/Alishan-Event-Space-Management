import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initDashboard = async () => {
      const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

      console.log("ADMIN DASHBOARD AUTH:", user, token);

      // 🔒 FRONTEND ADMIN GUARD
      if (!token || !user || user.role !== "admin") {
        setError("Access denied. Admin only.");
        setLoading(false);
        return;
      }

      await fetchBookings(token);
    };

    initDashboard();
  }, []);

  const fetchBookings = async (token) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/booking/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.data || []);
    } catch (err) {
      console.error("Admin bookings error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p className="text-red-600 font-bold">{error}</p>;

  const revenue = bookings.reduce(
    (sum, b) => sum + (b.price ?? b.amount ?? 0),
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Stat title="Total Bookings" value={bookings.length} />
        <Stat
          title="Total Revenue"
          value={`₹${revenue.toLocaleString()}`}
        />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
