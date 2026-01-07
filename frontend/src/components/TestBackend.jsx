import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function TestBackend() {
  const testRegister = async () => {
    const url = `${API_BASE_URL}/auth/register`;
    const payload = {
      name: "Test User",
      identifier: "test@example.com",
      password: "123456"
    };

    console.log("Axios URL:", url);
    console.log("Payload:", payload);

    try {
      const res = await axios.post(url, payload);
      console.log("Response:", res.data);
      alert("Success! Check console for details.");
    } catch (err) {
      console.error("Axios Error:", err.response || err);
      alert("Error! Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={testRegister}>Test Backend Register</button>
    </div>
  );
}
