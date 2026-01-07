import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserSidebar from "./UserSidebar";
const Logo = require("../assets/logo.png");

export default function Navbar() {
  const navigate = useNavigate();
  const [openSidebar, setOpenSidebar] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/");
  window.location.reload();
};


  return (
    <>
      <nav
        className="flex items-center justify-between px-10 py-4"
        style={{ backgroundColor: "black", color: "white" }}
      >
        {/* Left Side Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-xl font-semibold">Aalishan Vibes</h1>
        </div>

        {/* Right Side User Info */}
        {user && (
          <div className="flex items-center gap-4">
            {/* CLICKABLE USER NAME */}
            <button
              onClick={() => setOpenSidebar(true)}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              👤 Hello, <strong>{user.name}</strong>
            </button>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* USER SIDEBAR */}
      {user && (
        <UserSidebar
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          user={user}
        />
      )}
    </>
  );
}
