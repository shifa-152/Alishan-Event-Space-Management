import { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config";

/* ======================
   VALIDATION HELPERS
====================== */

const emailRegex =
  /^(?!.*\.\.)[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const phoneRegex = /^[6-9]\d{9}$/;

const nameRegex = /^[A-Za-z ]+$/;

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [useOtp, setUseOtp] = useState(false);

  useEffect(() => {
    setIdentifier("");
    setName("");
    setPassword("");
    setOtp("");
    setShowPassword(false);
    setOtpSent(false);
  }, [isLogin]);

  const isEmail = emailRegex.test(identifier.trim());
  const isPhone = phoneRegex.test(identifier.trim());

  /* ======================
     OTP FLOW
  ====================== */

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      return toast.error("Enter email or phone number");
    }

    if (!isEmail && !isPhone) {
      return toast.error("Enter a valid email or 10-digit phone number");
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        identifier: identifier.trim(),
      });
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return toast.error("Enter OTP");

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        identifier: identifier.trim(),
        otp: otp.trim(),
        name: isLogin ? undefined : name.trim(),
      });

      if (res.data.user.role === "admin") {
        toast.error("Please login from Admin Panel");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");
      onClose();
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     PASSWORD LOGIN / REGISTER
  ====================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useOtp) return handleVerifyOtp();

    if (!identifier.trim()) {
      return toast.error("Email or phone is required");
    }

    if (!isEmail && !isPhone) {
      return toast.error("Enter a valid email or phone number");
    }

    if (!isLogin) {
      if (!name.trim()) return toast.error("Name is required");
      if (!nameRegex.test(name.trim()))
        return toast.error("Name must contain only alphabets and spaces");
    }

    if (!password.trim()) {
      return toast.error("Password is required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const url = isLogin
        ? `${API_BASE_URL}/auth/login`
        : `${API_BASE_URL}/auth/register`;

      const payload = isLogin
        ? { identifier: identifier.trim(), password: password.trim() }
        : {
            name: name.trim(),
            identifier: identifier.trim(),
            password: password.trim(),
          };

      const res = await axios.post(url, payload);

      if (isLogin && res.data.user.role === "admin") {
        toast.error("Please login from Admin Panel");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(isLogin ? "Login successful" : "Registration successful");
      onClose();
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>

        <h2 style={titleStyle}>
          {isLogin ? "Login to Aalishan Vibes" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit} style={formStyle} autoComplete="off">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          )}

          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={inputStyle}
          />

          {!useOtp && (
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
              >
                {showPassword ? <EyeSlashIcon width={20} /> : <EyeIcon width={20} />}
              </span>
            </div>
          )}

          {useOtp && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                style={btnStyle}
                disabled={loading || otpSent}
              >
                {otpSent ? "OTP Sent" : "Send OTP"}
              </button>
            </>
          )}

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Processing..." : useOtp ? "Verify OTP" : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {isLogin && (
          <p style={switchTextStyle}>
            <button onClick={() => setUseOtp(!useOtp)} style={linkStyle}>
              {useOtp ? "Login with Password" : "Login with OTP"}
            </button>
          </p>
        )}

        <p style={switchTextStyle}>
          {isLogin ? (
            <>Don’t have an account? <button onClick={() => setIsLogin(false)} style={linkStyle}>Register</button></>
          ) : (
            <>Already have an account? <button onClick={() => setIsLogin(true)} style={linkStyle}>Login</button></>
          )}
        </p>
      </div>
    </div>
  );
}

/* ======================
   STYLES (FIXED)
====================== */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "16px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const eyeStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

const btnStyle = {
  padding: "10px",
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const switchTextStyle = {
  textAlign: "center",
  marginTop: "12px",
};

const linkStyle = {
  border: "none",
  background: "transparent",
  color: "#2563eb",
  cursor: "pointer",
};
