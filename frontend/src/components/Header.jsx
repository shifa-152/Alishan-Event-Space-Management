import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="font-medium">Hello {user.name}</span>

      <div className="relative">
        <button onClick={() => setOpen(!open)}>
          <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white shadow rounded w-48">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
              My Account
            </Link>
            <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">
              My Bookings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
