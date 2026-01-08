console.log("REGISTER COMPONENT LOADED - VALIDATION ACTIVE");

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const validateName = (value) => {
    if (!value) return "Name is required";
    if (!/^[A-Za-z' ]+$/.test(value))
      return "Only alphabets, spaces and apostrophe allowed";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (email.includes("..")) return "Email cannot contain double dots";
    if (/\s/.test(email)) return "Email cannot contain spaces";

    const emailRegex =
      /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

    if (!emailRegex.test(email)) return "Invalid email format";

    const localPart = email.split("@")[0];
    if (localPart.startsWith(".") || localPart.endsWith("."))
      return "Email cannot start or end with dot";

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const nErr = validateName(name);
    const eErr = validateEmail(email);

    setNameError(nErr);
    setEmailError(eErr);

    if (nErr || eErr || password.length < 6) {
      if (password.length < 6)
        setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={titleStyle}>Create Account</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(validateName(e.target.value));
          }}
          style={inputStyle}
        />
        {nameError && <div style={errorStyle}>{nameError}</div>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          style={inputStyle}
        />
        {emailError && <div style={errorStyle}>{emailError}</div>}

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
            style={eyeIconStyle}
          >
            {showPassword ? <EyeSlashIcon width={20} /> : <EyeIcon width={20} />}
          </span>
        </div>

        <PasswordStrengthMeter password={password} />

        <button type="submit" style={btnStyle}>
          Register
        </button>
      </form>
    </div>
  );
}
