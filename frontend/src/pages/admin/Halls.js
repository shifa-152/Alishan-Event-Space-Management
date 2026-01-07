// frontend/src/pages/admin/Halls.jsx
import { useState, useEffect } from "react";

export default function Halls() {
  const [halls, setHalls] = useState([]);
  const [newHall, setNewHall] = useState({ name: "", capacity: "", price1hr: "", price2hr: "" });
  const [editingHallId, setEditingHallId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch halls on mount
  useEffect(() => {
    fetchHalls();
  }, []);

  // Fetch halls from backend
  const fetchHalls = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/halls");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.success) setHalls(json.data);
      else setMessage(json.message || "Failed to fetch halls.");
    } catch (err) {
      console.error("fetchHalls error:", err);
      setMessage("Server error while fetching halls.");
    }
  };

  // Handle input changes
  const handleChange = (e, hallId = null) => {
    const { name, value } = e.target;
    if (hallId) {
      setHalls(halls.map(h => (h._id === hallId ? { ...h, [name]: value } : h)));
    } else {
      setNewHall(h => ({ ...h, [name]: value }));
    }
  };

  // Add new hall
  const addHall = async () => {
    const { name, capacity, price1hr, price2hr } = newHall;

    if (!name || !capacity || !price1hr || !price2hr) {
      setMessage("All fields are required.");
      return;
    }

    const payload = {
      name,
      capacity: Number(capacity),
      price1hr: Number(price1hr),
      price2hr: Number(price2hr),
    };

    try {
      const res = await fetch("http://localhost:5000/api/halls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.success) {
        setHalls([...halls, json.data]);
        setNewHall({ name: "", capacity: "", price1hr: "", price2hr: "" });
        setMessage("Hall added successfully!");
      } else {
        setMessage(json.message || "Failed to add hall.");
      }
    } catch (err) {
      console.error("addHall error:", err);
      setMessage("Server error while adding hall.");
    }
  };

  // Update hall
  const updateHall = async hallId => {
    const hallToUpdate = halls.find(h => h._id === hallId);
    const { name, capacity, price1hr, price2hr } = hallToUpdate;

    if (!name || !capacity || !price1hr || !price2hr) {
      setMessage("All fields are required for update.");
      return;
    }

    const payload = {
      name,
      capacity: Number(capacity),
      price1hr: Number(price1hr),
      price2hr: Number(price2hr),
    };

    try {
      const res = await fetch(`http://localhost:5000/api/halls/${hallId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.success) {
        setEditingHallId(null);
        setMessage("Hall updated successfully!");
        // Update local state
        setHalls(halls.map(h => (h._id === hallId ? json.data : h)));
      } else {
        setMessage(json.message || "Failed to update hall.");
      }
    } catch (err) {
      console.error("updateHall error:", err);
      setMessage("Server error while updating hall.");
    }
  };

  // Delete hall
  const deleteHall = async hallId => {
    if (!window.confirm("Are you sure you want to delete this hall?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/halls/${hallId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setHalls(halls.filter(h => h._id !== hallId));
        setMessage("Hall deleted successfully!");
      } else {
        setMessage(json.message || "Failed to delete hall.");
      }
    } catch (err) {
      console.error("deleteHall error:", err);
      setMessage("Server error while deleting hall.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Halls</h1>

      {/* Add New Hall */}
      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <h2 className="font-semibold mb-3">Add New Hall</h2>
        <div className="flex flex-wrap gap-2">
          <input
            name="name"
            placeholder="Hall Name"
            value={newHall.name}
            onChange={handleChange}
            className="p-2 border rounded flex-1"
          />
          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={newHall.capacity}
            onChange={handleChange}
            className="p-2 border rounded w-32"
          />
          <input
            name="price1hr"
            type="number"
            placeholder="Price 1 Hour"
            value={newHall.price1hr}
            onChange={handleChange}
            className="p-2 border rounded w-32"
          />
          <input
            name="price2hr"
            type="number"
            placeholder="Price 2 Hours"
            value={newHall.price2hr}
            onChange={handleChange}
            className="p-2 border rounded w-32"
          />
          <button onClick={addHall} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Hall
          </button>
        </div>
        {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
      </div>

      {/* Existing Halls */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Existing Halls</h2>
        {halls.length === 0 && <p>No halls added yet.</p>}
        {halls.map(h => (
          <div key={h._id} className="flex flex-wrap items-center justify-between border-b py-2">
            <div className="flex flex-wrap gap-2 flex-1">
              <input
                name="name"
                value={h.name}
                onChange={e => handleChange(e, h._id)}
                disabled={editingHallId !== h._id}
                className={`p-2 border rounded ${editingHallId === h._id ? "bg-white" : "bg-gray-100"}`}
              />
              <input
                name="capacity"
                type="number"
                value={h.capacity}
                onChange={e => handleChange(e, h._id)}
                disabled={editingHallId !== h._id}
                className={`p-2 border rounded w-24 ${editingHallId === h._id ? "bg-white" : "bg-gray-100"}`}
              />
              <input
                name="price1hr"
                type="number"
                value={h.price1hr}
                onChange={e => handleChange(e, h._id)}
                disabled={editingHallId !== h._id}
                className={`p-2 border rounded w-24 ${editingHallId === h._id ? "bg-white" : "bg-gray-100"}`}
              />
              <input
                name="price2hr"
                type="number"
                value={h.price2hr}
                onChange={e => handleChange(e, h._id)}
                disabled={editingHallId !== h._id}
                className={`p-2 border rounded w-24 ${editingHallId === h._id ? "bg-white" : "bg-gray-100"}`}
              />
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {editingHallId === h._id ? (
                <>
                  <button
                    onClick={() => updateHall(h._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingHallId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingHallId(h._id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteHall(h._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
