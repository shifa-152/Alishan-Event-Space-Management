import { useState } from "react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });

  function handleLogin(e) {
    e.preventDefault();

    // Fake Login (replace with API)
    if (form.email === "admin@gmail.com" && form.password === "admin123") {
      localStorage.setItem("admin", JSON.stringify({ role: "admin" }));
      window.location.href = "/admin/dashboard";
    } else {
      alert("Invalid admin credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">

        <h2 className="text-[#d4af37] text-2xl mb-6 font-bold text-center">
          Admin Login
        </h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-[#d4af37] text-black w-full py-2 rounded font-semibold hover:bg-[#b8922b]">
          Login
        </button>
      </form>
    </div>
  );
}
