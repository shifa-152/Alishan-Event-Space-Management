import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const PAGE_SIZE = 5;
const API_URL = "http://localhost:5000/api"; // Backend URL

export default function BookingApproval() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || user.role !== "admin") {
      setError("Access denied. Admin only.");
      setLoading(false);
      return;
    }

    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const res = await fetch(`${API_URL}/booking/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(
          `Unexpected response from server. Status: ${res.status}. Response: ${text}`
        );
      }

      if (!res.ok) throw new Error(data.message || "Server error");
      setBookings(data.data || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server error");

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const receiveRemainingPayment = async (booking) => {
    if (!window.confirm("Mark remaining payment as received?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_URL}/booking/${booking._id}/receive-payment`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(
          `Unexpected response from server. Status: ${res.status}. Response: ${text}`
        );
      }

      if (!res.ok) throw new Error(data.message || "Server error");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? { ...b, amountPaid: booking.price, paymentStatus: "full" }
            : b
        )
      );
      alert("Remaining payment received successfully!");
    } catch (err) {
      alert("Error receiving payment: " + err.message);
      console.error("Receive payment error:", err);
    }
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(bookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Bookings");
    XLSX.writeFile(wb, "bookings.xlsx");
  };

  const filtered = bookings.filter((b) => {
    const name = b.name?.toLowerCase() || "";
    const date = b.eventDate
      ? new Date(b.eventDate).toISOString().split("T")[0]
      : "";
    return (
      (filter === "all" || b.status === filter) &&
      (name.includes(search.toLowerCase()) || date.includes(search))
    );
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 24 }}>📅 Booking Approval</h2>

      <input
        placeholder="Search name or date"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "10px 0", padding: 6 }}
      />

      <div style={{ marginBottom: 10 }}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            style={{
              marginRight: 6,
              padding: "6px 12px",
              background: filter === f ? "#2563eb" : "#e5e7eb",
              color: filter === f ? "#fff" : "#000",
              border: "none",
              borderRadius: 5,
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <button onClick={exportExcel} style={{ marginLeft: 10 }}>
          Export Excel
        </button>
      </div>

      {paginated.map((b) => {
        const isFullPaid = b.amountPaid >= b.price;
        return (
          <div key={b._id} style={card}>
            <p><b>Name:</b> {b.name}</p>
            <p><b>Date:</b> {b.eventDate?.split("T")[0]}</p>
            <p><b>Status:</b> {b.status}</p>
            <p><b>Payment Type:</b> {b.paymentType?.toUpperCase()}</p>
            <p>
              <b>Payment Status:</b>{" "}
              {isFullPaid ? (
                <span style={{ color: "green", fontWeight: "bold" }}>FULL PAID</span>
              ) : (
                <span style={{ color: "orange", fontWeight: "bold" }}>ADVANCE PAID</span>
              )}
            </p>
            <p><b>Amount:</b> ₹{b.amountPaid} / ₹{b.price}</p>

            {!isFullPaid && b.status === "approved" && (
              <button onClick={() => receiveRemainingPayment(b)} style={payBtn}>
                Receive Remaining Payment
              </button>
            )}

            <button onClick={() => setSelected(b)}>View</button>

            {b.status === "pending" && (
              <>
                <button onClick={() => updateStatus(b._id, "approved")} style={approveBtn}>
                  Approve
                </button>
                <button onClick={() => updateStatus(b._id, "rejected")} style={rejectBtn}>
                  Reject
                </button>
              </>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 10 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              marginRight: 4,
              padding: "4px 8px",
              background: page === p ? "#2563eb" : "#e5e7eb",
              color: page === p ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {selected && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3>Booking Details</h3>
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Phone:</b> {selected.phone}</p>
            <p><b>Date:</b> {selected.eventDate?.split("T")[0]}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p><b>Payment Mode:</b> {selected.paymentType}</p>
            <p><b>Amount:</b> ₹{selected.amountPaid} / ₹{selected.price}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const card = { border: "1px solid #ddd", padding: 12, marginTop: 10 };
const approveBtn = { background: "green", color: "#fff", marginLeft: 6 };
const rejectBtn = { background: "red", color: "#fff", marginLeft: 6 };
const payBtn = { background: "#0ea5e9", color: "#fff", marginTop: 6, marginRight: 6 };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modal = { background: "#fff", padding: 20, borderRadius: 8, width: "300px" };
