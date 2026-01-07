import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
// Layouts
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (User)
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
// Pages (Admin)
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import BookingApproval from "./pages/admin/BookingApproval";
import Users from "./pages/admin/Users";
import Halls from "./pages/admin/Halls";

function App() {
  return (
    
    <Routes>
        <Toaster position="top-right" reverseOrder={false} />
      {/* ================= USER / PUBLIC ROUTES ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booking-page" element={<BookingPage />} />
        <Route path="/gallery" element={<Gallery />} />
      <Route path="/my-bookings" element={<MyBookings />} />
        {/* 🔒 Protected User Route */}
        <Route
          path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<BookingApproval />} />
        <Route path="halls" element={<Halls />} />
          <Route path="users" element={<Users />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center bg-gray-900 min-h-screen">
            <h1 className="text-white text-3xl font-bold">
              Page Not Found
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
