// import { Link, Outlet } from "react-router-dom";

// export default function AdminLayout() {
//   return (
//     <div className="flex h-screen overflow-hidden">

//       {/* SIDEBAR */}
//       <aside className="w-64 shrink-0 bg-gray-900 text-white p-6">
//         <h2 className="text-2xl font-bold text-[#d4af37] mb-6">
//           Aalishan Admin
//         </h2>

//         <nav className="space-y-3">
//           <Link to="/admin/dashboard" className="block hover:text-[#d4af37]">
//             Dashboard
//           </Link>
//           <Link to="/admin/bookings" className="block hover:text-[#d4af37]">
//             Bookings
//           </Link>
//           <Link to="/admin/halls" className="block hover:text-[#d4af37]">
//             Halls
//           </Link>
//         </nav>

//         <button
//           onClick={() => {
//             localStorage.removeItem("admin");
//             window.location.href = "/admin/login";
//           }}
//           className="mt-10 bg-red-600 hover:bg-red-700 w-full py-2 rounded"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
//         <Outlet />
//       </main>

//     </div>
//   );
// }
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
