import { Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import BookingApproval from "./pages/admin/BookingApproval";
import Users from "./pages/admin/Users";
import Halls from "./pages/admin/Halls";

export default function App() {
  return (
    <Routes>
      {/* USER ROUTES */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booking-page" element={<BookingPage />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<BookingApproval />} />
        <Route path="halls" element={<Halls />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

