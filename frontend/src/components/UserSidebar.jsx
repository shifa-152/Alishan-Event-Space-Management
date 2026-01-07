import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function UserSidebar({ open, onClose, user }) {
  const [bookings, setBookings] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });

  useEffect(() => {
    if (open) fetchBookings();
  }, [open]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  /* =====================
     API CALLS
  ====================== */

const fetchBookings = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/booking/my`,
      authHeader
    );
    setBookings(res.data.data);
  } catch (err) {
    console.error("Fetch bookings error:", err);
  }
};
const cancelBooking = async (bookingId) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    await axios.put(
      `${API_BASE_URL}/booking/cancel/${bookingId}`,
      {},
      authHeader
    );
    fetchBookings(); // refresh list
  } catch (err) {
    alert(err.response?.data?.error || "Failed to cancel booking");
  }
};


  const updateProfile = async () => {
    if (!formData.name.trim()) return;

    try {
      setSaving(true);

      const res = await axios.put(
        `${API_BASE_URL}/users/update-profile`,
        formData,
        authHeader
      );

      // update localStorage user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setEditMode(false);
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });
    setEditMode(false);
  };

  /* =====================
     UI HELPERS
  ====================== */

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "visited":
        return "bg-blue-100 text-blue-700";
      case "not_visited":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <div
        className={`fixed z-50 transition-transform duration-300
        w-full sm:w-[420px] h-[90%] sm:h-full bottom-0 sm:top-0 right-0
        bg-white text-gray-800 shadow-2xl
        ${darkMode ? "bg-gray-900 text-gray-100" : ""}
        ${open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">My Account</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={onClose} className="text-xl">✖</button>
          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="p-5 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Profile Details</h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                type="text"
                disabled={!editMode}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full p-2 rounded border
                ${editMode ? "bg-white" : "bg-gray-100"}
                text-black`}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-2 rounded border bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                type="text"
                disabled={!editMode}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full p-2 rounded border
                ${editMode ? "bg-white" : "bg-gray-100"}
                text-black`}
              />
            </div>

            {editMode && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={updateProfile}
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="p-5 overflow-y-auto h-[55%]">
          <h3 className="font-semibold text-lg mb-3">My Bookings</h3>

          {bookings.length === 0 && (
            <p className="text-gray-500">No bookings found</p>
          )}

          {bookings.map((b) => (
  <div
    key={b._id}
    className="border rounded-xl p-4 mb-3 text-sm"
  >
    <div className="flex justify-between mb-2">
      <p className="font-semibold">{b.hall?.name}</p>
      <span
        className={`px-3 py-1 text-xs rounded-full ${statusColor(
          b.status
        )}`}
      >
        {b.status}
      </span>
    </div>

    <p><strong>Date:</strong> {new Date(b.eventDate).toDateString()}</p>
    <p><strong>Slot:</strong> {b.slot}</p>
    <p><strong>Payment Type:</strong> {b.paymentType}</p>
<p>
  <strong>Payment:</strong>{" "}
  {b.paymentStatus === "full" ? "Full Paid" : "Advance Paid"}
</p>


    {/* CANCEL BUTTON */}
    {b.status === "pending" && (
      <button
        onClick={() => cancelBooking(b._id)}
        className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
      >
        Cancel Booking
      </button>
    )}
  </div>
))}

        </div>
      </div>
    </>
  );
}
