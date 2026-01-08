import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    if (!email) return false;
    if (/\s/.test(email)) return false;
    if (email.includes("..")) return false;

    const emailRegex =
      /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

    const [localPart] = email.split("@");
    if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      return setError("Enter a valid email address");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: email.trim(), password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={titleStyle}>Login</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          style={inputStyle}
          required
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: "40px" }}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={eyeIconStyle}
          >
            {showPassword ? <EyeSlashIcon width={20} /> : <EyeIcon width={20} />}
          </span>
        </div>

        <button type="submit" style={btnStyle}>
          Login
        </button>
      </form>
    </div>
  );
}
