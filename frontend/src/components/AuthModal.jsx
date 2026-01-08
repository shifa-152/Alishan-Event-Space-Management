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
    setOtpSent(false);
  }, [isLogin]);

  /* ======================
     VALIDATORS
  ====================== */

  const isValidName = (value) =>
    /^[A-Za-z' ]+$/.test(value.trim());

  const isValidEmail = (email) => {
    if (!email) return false;
    if (email.includes("..")) return false;
    if (/\s/.test(email)) return false;

    const emailRegex =
      /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

    const localPart = email.split("@")[0];
    if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

    return emailRegex.test(email);
  };

  const isValidPhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone);

  const getIdentifierType = (value) => {
    if (/^\d+$/.test(value)) return "phone";
    if (value.includes("@")) return "email";
    return "invalid";
  };

  /* ======================
     OTP FLOW
  ====================== */

  const handleSendOtp = async () => {
    const type = getIdentifierType(identifier.trim());

    if (type === "email" && !isValidEmail(identifier))
      return toast.error("Enter a valid email address");

    if (type === "phone" && !isValidPhone(identifier))
      return toast.error("Enter a valid 10-digit phone number");

    if (type === "invalid")
      return toast.error("Enter a valid email or phone number");

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

    const type = getIdentifierType(identifier.trim());

    if (!isLogin && !isValidName(name))
      return toast.error("Name can contain only alphabets, spaces and apostrophe");

    if (type === "email" && !isValidEmail(identifier))
      return toast.error("Enter a valid email address");

    if (type === "phone" && !isValidPhone(identifier))
      return toast.error("Enter a valid 10-digit phone number");

    if (type === "invalid")
      return toast.error("Enter a valid email or phone number");

    if (!useOtp && password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (useOtp) return handleVerifyOtp();

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
            onChange={(e) => setIdentifier(e.target.value.trim())}
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
            <>Don’t have an account? <button onClick={() => setIsLogin(false)} style={linkStyle}>Register</button></>
          ) : (
            <>Already have an account? <button onClick={() => setIsLogin(true)} style={linkStyle}>Login</button></>
          )}
        </p>
      </div>
    </div>
  );
}
