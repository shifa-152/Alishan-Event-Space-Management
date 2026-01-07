import axios from "axios";

const sendSmsOtp = async (phone, otp) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      throw new Error("FAST2SMS_API_KEY not set");
    }

    const message = `Your OTP is ${otp}`;

    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "v3",
        sender_id: "TXTIND",
        message,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ SMS OTP sent");
  } catch (err) {
    console.error("❌ SMS OTP failed:", err.response?.data || err.message);
    throw err;
  }
};

export default sendSmsOtp;
