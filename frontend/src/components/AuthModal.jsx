import { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config";

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

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  /* ======================
     OTP FLOW
  ====================== */

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      return toast.error("Enter email or phone");
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        identifier: identifier.trim(),
      });
      setOtpSent(true);
      toast.success("OTP sent!");
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

      // 🚫 BLOCK ADMIN FROM USER MODAL
      if (res.data.user.role === "admin") {
        toast.error("Please login from Admin Panel");
        return;
      }

      // ✅ USER AUTH ONLY
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
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

    if (!identifier.trim() || (!isLogin && !name.trim()) || !password.trim()) {
      return toast.error("Fill all fields");
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

      // 🚫 BLOCK ADMIN FROM USER MODAL
      if (isLogin && res.data.user.role === "admin") {
        toast.error("Please login from Admin Panel");
        return;
      }

      // ✅ USER AUTH ONLY
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(isLogin ? "Login successful!" : "Registration successful!");
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
        <p style={subtitleStyle}>
          {isLogin ? "Welcome back! Login below" : "Register to book your event"}
        </p>

        <form onSubmit={handleSubmit} style={formStyle} autoComplete="off">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={inputStyle}
          />

          {!useOtp && (
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ width: 20, height: 20 }} />
                ) : (
                  <EyeIcon style={{ width: 20, height: 20 }} />
                )}
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
                required
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
            {loading
              ? "Processing..."
              : useOtp
              ? "Verify OTP"
              : isLogin
              ? "Login"
              : "Register"}
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
            <>
              Don’t have an account?{" "}
              <button onClick={switchToRegister} style={linkStyle}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={switchToLogin} style={linkStyle}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/* ======================
   STYLES
====================== */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
};

const modalStyle = {
  background: "#fff",
  width: "90%",
  maxWidth: "400px",
  borderRadius: "12px",
  padding: "24px",
  position: "relative",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};

const closeBtnStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "bold",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#555",
  marginBottom: "16px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#555",
};

const btnStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const switchTextStyle = {
  textAlign: "center",
  marginTop: "12px",
  fontSize: "14px",
};

const linkStyle = {
  color: "#2563eb",
  fontWeight: "500",
  cursor: "pointer",
  border: "none",
  background: "transparent",
};
