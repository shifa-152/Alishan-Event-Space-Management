import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-grow bg-gray-100 p-4">
        <Outlet />   {/* <-- Loaded page appears here */}
      </main>

      <Footer />
    </div>
  );
}
