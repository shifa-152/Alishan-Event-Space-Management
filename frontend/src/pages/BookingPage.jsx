
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const DURATIONS = ["1 hour", "2 hours"];
const EVENT_TYPES = ["wedding", "reception", "corporate", "birthday"];
const PAYMENT_METHODS = ["cash", "upi", "card"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61"];

export default function BookingPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [payType, setPayType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
// Payment info message logic
const getPaymentMessage = () => {
  if (payType === "full" && paymentMethod === "cash") {
    return "Carry total amount on visit";
  }

  if (payType === "advance" && paymentMethod === "cash") {
    return "Advance cash payment should be done at least 1 day prior to the event";
  }

  if (payType === "advance" && paymentMethod !== "cash") {
    return "Remaining amount to be paid on visit";
  }

  return "";
};

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    hall: "",
    duration: "",
    eventType: "",
    eventDate: "",
    slot: "",
    price: 0,
  });

  const [halls, setHalls] = useState([]);
  const [slots, setSlots] = useState([]);

  const todayStr = new Date().toISOString().split("T")[0];
  const advanceAmount = form.price ? Math.ceil(form.price / 2) : 0;

  /* ---------------- FETCH HALLS ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/halls")
      .then((res) => res.json())
      .then((json) => json.success && setHalls(json.data || []))
      .catch(console.error);
  }, []);

  /* ---------------- SOCKET SLOT UPDATE ---------------- */
  useEffect(() => {
    socket.on("updateSlots", ({ hall, date }) => {
      if (hall === form.hall && date === form.eventDate) fetchSlots();
    });
    return () => socket.off("updateSlots");
  }, [form.hall, form.eventDate]);

  /* ---------------- PRICE CALCULATION ---------------- */
  useEffect(() => {
    const selectedHall = halls.find((h) => h._id === form.hall);
    if (!selectedHall || !form.duration) {
      setForm((f) => ({ ...f, price: 0 }));
      return;
    }

    const price =
      form.duration === "1 hour"
        ? Number(selectedHall.price1hr)
        : Number(selectedHall.price2hr);

    setForm((f) => ({ ...f, price }));
  }, [form.hall, form.duration, halls]);

  /* ---------------- FETCH SLOTS ---------------- */
  const fetchSlots = () => {
    if (!form.hall || !form.eventDate || !form.duration) return;

    setLoadingSlots(true);
    fetch(
      `http://localhost:5000/api/booking/slots?hall=${form.hall}&date=${form.eventDate}&duration=${form.duration}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSlots(json.data || []);
        else setSlots([]);
      })
      .catch(console.error)
      .finally(() => setLoadingSlots(false));
  };

  useEffect(fetchSlots, [form.hall, form.eventDate, form.duration]);

  /* ---------------- VALIDATIONS ---------------- */
  const validateStep1 = () => {
    const nameRegex = /^[A-Za-z\s']+$/;

    const emailRegex =
      /^(?!.*\.\.)[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9]+([.-][A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(form.name.trim())) {
      setMessage("Name can contain only alphabets, spaces and apostrophe");
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      setMessage("Enter a valid email address");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      setMessage("Enter a valid 10-digit mobile number");
      return false;
    }

    if (!form.hall || !form.duration || !form.eventType || !form.eventDate) {
      setMessage("Please fill all required fields");
      return false;
    }

    setMessage("");
    return true;
  };

  const validateStep2 = () => {
    if (!form.slot) {
      setMessage("Please select a slot");
      return false;
    }
    setMessage("");
    return true;
  };

  /* ---------------- SUBMIT BOOKING ---------------- */
  const submitBooking = async () => {
    if (!payType || !paymentMethod)
      return setMessage("Select payment type and payment method");

    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to continue");

    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          phone: `${form.countryCode}${form.phone}`,
          paymentMethod,
          payType,
        }),
      });

      const data = await res.json();
      if (res.ok) setStep(4);
      else setMessage(data.message || "Booking failed");
    } catch {
      setMessage("Server error");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-3xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4">Booking Your Hall</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <button
            onClick={() => navigate("/")}
            className="mb-3 text-blue-600 underline"
          >
            ← Back to Home
          </button>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />

          <div className="flex gap-2 mb-2">
            <select
              className="border p-2"
              value={form.countryCode}
              onChange={(e) =>
                setForm((f) => ({ ...f, countryCode: e.target.value }))
              }
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              className="border p-2 flex-1"
              placeholder="Phone"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phone: e.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>

          <select
            className="border p-2 w-full mb-2"
            value={form.hall}
            onChange={(e) => setForm((f) => ({ ...f, hall: e.target.value }))}
          >
            <option value="">Select Hall</option>
            {halls.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 w-full mb-2"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
          >
            <option value="">Select Duration</option>
            {DURATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            className="border p-2 w-full mb-2"
            value={form.eventType}
            onChange={(e) =>
              setForm((f) => ({ ...f, eventType: e.target.value }))
            }
          >
            <option value="">Event Type</option>
            {EVENT_TYPES.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <input
            type="date"
            min={todayStr}
            className="border p-2 w-full mb-2"
            value={form.eventDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, eventDate: e.target.value }))
            }
          />

          {form.price > 0 && (
            <p className="font-bold mb-2">Price: ₹{form.price}</p>
          )}
          {message && <p className="text-red-600 mb-2">{message}</p>}

          <button
            onClick={() => validateStep1() && setStep(2)}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Next
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          {loadingSlots ? (
            <p>Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-red-600">No slots available</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <div
                  key={s.slot}
                  onClick={() =>
                    s.status === "available" &&
                    setForm((f) => ({ ...f, slot: s.slot }))
                  }
                  className={`p-2 text-center border cursor-pointer ${
                    s.status === "booked"
                      ? "bg-red-200"
                      : form.slot === s.slot
                      ? "bg-blue-300"
                      : "bg-green-200"
                  }`}
                >
                  {s.slot}
                </div>
              ))}
            </div>
          )}

          {message && <p className="text-red-600 mt-2">{message}</p>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-500 text-white w-full py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={() => validateStep2() && setStep(3)}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {/* STEP 3 */}
{step === 3 && (
  <>
    <h3 className="font-bold mb-2">Payment & Method</h3>

    <div className="mb-2">
      <label className="mr-4">
        <input
          type="radio"
          value="full"
          checked={payType === "full"}
          onChange={(e) => setPayType(e.target.value)}
        />{" "}
        Full ₹{form.price}
      </label>

      <label>
        <input
          type="radio"
          value="advance"
          checked={payType === "advance"}
          onChange={(e) => setPayType(e.target.value)}
        />{" "}
        Advance ₹{advanceAmount}
      </label>
    </div>

    {PAYMENT_METHODS.map((p) => (
      <label key={p} className="block">
        <input
          type="radio"
          value={p}
          checked={paymentMethod === p}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />{" "}
        {p.toUpperCase()}
      </label>
    ))}

    {/* ✅ PAYMENT INFO MESSAGE */}
    {getPaymentMessage() && (
      <p className="text-orange-600 mt-2 font-medium">
        {getPaymentMessage()}
      </p>
    )}

    {message && <p className="text-red-600 mb-2">{message}</p>}

    <button
      onClick={submitBooking}
      className="bg-blue-700 text-white w-full py-2 rounded mt-4"
    >
      Pay & Book
    </button>
  </>
)}


      {/* STEP 4 */}
{step === 4 && (
  <>
    <button
      onClick={() => navigate("/")}
      className="mb-3 text-blue-600 underline"
    >
      ← Back to Home
    </button>

    <div className="bg-green-50 p-4 rounded">
      <h3 className="font-bold text-lg">Booking Request Sent ✅</h3>
      <p>Waiting for admin approval</p>
    </div>
  </>
)}

    </div>
  );
}




      
