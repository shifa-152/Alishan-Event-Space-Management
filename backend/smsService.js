import axios from "axios";

export const sendSmsOtp = async (phone, otp) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    const config = {
      method: "post",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        authorization: apiKey,
      },
      data: {
        route: "otp",
        variables_values: otp,
        numbers: phone,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("SMS ERROR:", error.response?.data || error.message);
    throw new Error("Failed to send OTP SMS");
  }
};
