import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">

      <h2 className="text-2xl font-bold text-[#d4af37] mb-8">
        Aalishan Admin
      </h2>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-800 text-[#d4af37]" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-800 text-[#d4af37]" : "hover:bg-gray-800"
            }`
          }
        >
          Bookings
        </NavLink>

        <NavLink
          to="/admin/halls"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-800 text-[#d4af37]" : "hover:bg-gray-800"
            }`
          }
        >
          Halls
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block px-3 py-2 rounded ${
              isActive ? "bg-gray-800 text-[#d4af37]" : "hover:bg-gray-800"
            }`
          }
        >
          Users
        </NavLink>
      </nav>

     <button
  onClick={() => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  window.location.href = "/admin/login";
}}

  className="mt-10 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
>
  Logout
</button>

    </aside>
  );
}
