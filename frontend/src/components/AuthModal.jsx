// import { useState, useEffect } from "react";
// import axios from "axios";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
// import { toast } from "react-hot-toast";
// import { API_BASE_URL } from "../config";

// /* ======================
//    REGEX
// ====================== */
// const emailRegex =
//   /^(?!.*\.\.)[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
// const phoneRegex = /^[6-9]\d{9}$/;
// const nameRegex = /^[A-Za-z ]+$/;

// export default function AuthModal({ onClose }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [identifier, setIdentifier] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [useOtp, setUseOtp] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setErrors({});
//     setIdentifier("");
//     setName("");
//     setPassword("");
//     setOtp("");
//     setUseOtp(false);
//   }, [isLogin]);

//   /* ======================
//      VALIDATION FUNCTIONS
//   ====================== */

//   const validateIdentifier = (value) => {
//     if (!value.trim()) return "Email or phone is required";
//     if (!emailRegex.test(value) && !phoneRegex.test(value))
//       return "Enter a valid email or 10-digit phone number";
//     return "";
//   };

//   const validateName = (value) => {
//     if (!value.trim()) return "Name is required";
//     if (!nameRegex.test(value))
//       return "Name must contain only alphabets and spaces";
//     return "";
//   };

//   const validatePassword = (value) => {
//     if (!value.trim()) return "Password is required";
//     if (value.length < 6)
//       return "Password must be at least 6 characters";
//     return "";
//   };

//   /* ======================
//      SUBMIT
//   ====================== */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};

//     newErrors.identifier = validateIdentifier(identifier);
//     if (!isLogin) newErrors.name = validateName(name);
//     if (!useOtp) newErrors.password = validatePassword(password);

//     Object.keys(newErrors).forEach(
//       (k) => !newErrors[k] && delete newErrors[k]
//     );

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length) {
//       toast.error("Please fix the highlighted errors");
//       return;
//     }

//     try {
//       setLoading(true);

//       const url = isLogin
//         ? `${API_BASE_URL}/auth/login`
//         : `${API_BASE_URL}/auth/register`;

//       const payload = isLogin
//         ? { identifier, password }
//         : { name, identifier, password };

//       const res = await axios.post(url, payload);

//       if (res.data.user.role === "admin") {
//         toast.error("Admin login not allowed here");
//         return;
//       }

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       toast.success(isLogin ? "Login successful" : "Registration successful");
//       onClose();
//       window.location.href = "/";
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Authentication failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ======================
//      UI
//   ====================== */

//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         <button onClick={onClose} style={closeBtnStyle}>✕</button>

//         <h2 style={titleStyle}>
//           {isLogin ? "Login" : "Register"}
//         </h2>

//         <form onSubmit={handleSubmit} style={formStyle} noValidate>
//           {!isLogin && (
//             <>
//               <input
//                 style={input(errors.name)}
//                 placeholder="Full Name"
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   setErrors({ ...errors, name: validateName(e.target.value) });
//                 }}
//               />
//               {errors.name && <span style={errorText}>{errors.name}</span>}
//             </>
//           )}

//           <input
//             style={input(errors.identifier)}
//             placeholder="Email or Phone"
//             value={identifier}
//             onChange={(e) => {
//               setIdentifier(e.target.value);
//               setErrors({
//                 ...errors,
//                 identifier: validateIdentifier(e.target.value),
//               });
//             }}
//           />
//           {errors.identifier && (
//             <span style={errorText}>{errors.identifier}</span>
//           )}

//           {!useOtp && (
//             <>
//               <div style={{ position: "relative" }}>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   style={input(errors.password)}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     setErrors({
//                       ...errors,
//                       password: validatePassword(e.target.value),
//                     });
//                   }}
//                 />
//                 <span
//                   style={eyeStyle}
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeSlashIcon width={18} /> : <EyeIcon width={18} />}
//                 </span>
//               </div>
//               {errors.password && (
//                 <span style={errorText}>{errors.password}</span>
//               )}
//             </>
//           )}

//           <button disabled={loading} style={btnStyle}>
//             {loading ? "Processing..." : isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         <p style={switchTextStyle}>
//           {isLogin ? (
//             <>No account? <button onClick={() => setIsLogin(false)} style={linkStyle}>Register</button></>
//           ) : (
//             <>Have account? <button onClick={() => setIsLogin(true)} style={linkStyle}>Login</button></>
//           )}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ======================
//    STYLES
// ====================== */

// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.6)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const modalStyle = {
//   background: "#fff",
//   padding: 24,
//   borderRadius: 12,
//   width: 380,
// };

// const input = (error) => ({
//   padding: 10,
//   borderRadius: 6,
//   border: error ? "1px solid red" : "1px solid #ccc",
//   width: "100%",
// });

// const errorText = {
//   color: "red",
//   fontSize: 12,
// };

// const btnStyle = {
//   padding: 10,
//   background: "#111",
//   color: "#fff",
//   border: "none",
//   borderRadius: 6,
// };

// const closeBtnStyle = { float: "right", cursor: "pointer" };
// const titleStyle = { textAlign: "center" };
// const formStyle = { display: "flex", flexDirection: "column", gap: 8 };
// const switchTextStyle = { textAlign: "center", marginTop: 10 };
// const linkStyle = { background: "none", border: "none", color: "#2563eb" };
// const eyeStyle = { position: "absolute", right: 10, top: "30%", cursor: "pointer" };
import { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config";

/* ======================
   REGEX
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    setIdentifier("");
    setName("");
    setPassword("");
  }, [isLogin]);

  /* ======================
     VALIDATION
  ====================== */

  const validateIdentifier = (value) => {
    if (!value.trim()) return "Email or phone is required";
    if (!emailRegex.test(value) && !phoneRegex.test(value))
      return "Enter a valid email or 10-digit phone number";
    return "";
  };

  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (!nameRegex.test(value))
      return "Name must contain only alphabets and spaces";
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  /* ======================
     SUBMIT
  ====================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    newErrors.identifier = validateIdentifier(identifier);
    if (!isLogin) newErrors.name = validateName(name);
    newErrors.password = validatePassword(password);

    Object.keys(newErrors).forEach(
      (k) => !newErrors[k] && delete newErrors[k]
    );

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);

      const url = isLogin
        ? `${API_BASE_URL}/auth/login`
        : `${API_BASE_URL}/auth/register`;

      const payload = isLogin
        ? { identifier, password }
        : { name, identifier, password };

      const res = await axios.post(url, payload);

      if (res.data.user.role === "admin") {
        toast.error("Admin login not allowed here");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(isLogin ? "Login successful" : "Registration successful");
      onClose();
      window.location.href = "/";
    } catch (err) {
      const message = err.response?.data?.message || "Authentication failed";

      // ✅ HANDLE EXISTING USER ERROR
      if (
        !isLogin &&
        (err.response?.status === 409 ||
          message.toLowerCase().includes("already"))
      ) {
        setErrors({
          identifier: "User already exists with this email/phone",
        });
        toast.error("User already exists");
      } else {
        toast.error(message);
      }
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

        <h2 style={titleStyle}>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          {!isLogin && (
            <>
              <input
                style={input(errors.name)}
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: validateName(e.target.value) });
                }}
              />
              {errors.name && <span style={errorText}>{errors.name}</span>}
            </>
          )}

          <input
            style={input(errors.identifier)}
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors({
                ...errors,
                identifier: validateIdentifier(e.target.value),
              });
            }}
          />
          {errors.identifier && (
            <span style={errorText}>{errors.identifier}</span>
          )}

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={input(errors.password)}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({
                  ...errors,
                  password: validatePassword(e.target.value),
                });
              }}
            />
            <span
              style={eyeStyle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon width={18} />
              ) : (
                <EyeIcon width={18} />
              )}
            </span>
          </div>
          {errors.password && (
            <span style={errorText}>{errors.password}</span>
          )}

          <button disabled={loading} style={btnStyle}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={switchTextStyle}>
          {isLogin ? (
            <>No account? <button onClick={() => setIsLogin(false)} style={linkStyle}>Register</button></>
          ) : (
            <>Have account? <button onClick={() => setIsLogin(true)} style={linkStyle}>Login</button></>
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
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  width: 380,
};

const input = (error) => ({
  padding: 10,
  borderRadius: 6,
  border: error ? "1px solid red" : "1px solid #ccc",
  width: "100%",
});

const errorText = {
  color: "red",
  fontSize: 12,
};

const btnStyle = {
  padding: 10,
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};

const closeBtnStyle = { float: "right", cursor: "pointer" };
const titleStyle = { textAlign: "center" };
const formStyle = { display: "flex", flexDirection: "column", gap: 8 };
const switchTextStyle = { textAlign: "center", marginTop: 10 };
const linkStyle = { background: "none", border: "none", color: "#2563eb" };
const eyeStyle = { position: "absolute", right: 10, top: "30%", cursor: "pointer" };
