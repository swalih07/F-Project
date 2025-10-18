import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaWallet, FaCreditCard, FaMobileAlt, FaMapMarkerAlt } from "react-icons/fa";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount } = location.state || {};

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiOption, setUpiOption] = useState(""); // GooglePay, PhonePe, UPI ID
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // 🔹 Check cart
  useEffect(() => {
    if (!cart || cart.length === 0) {
      toast.error("🛒 Cart is empty!");
      navigate("/products");
    }
  }, [cart, navigate]);

  // 🔹 Location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        () => toast.error("📍 Location access denied! Please enable GPS")
      );
    } else {
      toast.warning("🌐 Your browser does not support location access!");
    }
  };

  // 🔹 Handle Payment
  const handlePayment = () => {
    if (!name || !phone || !address || !state || !pincode || !paymentMethod) {
      toast.warning("⚠️ Please fill all fields!");
      return;
    }
    if (phone.length !== 10) {
      toast.warning("⚠️ Enter a valid 10-digit phone number!");
      return;
    }

    // Validate UPI/Card if selected
    if (paymentMethod === "UPI" && !upiId) {
      toast.warning("⚠️ Enter your UPI ID!");
      return;
    }
    if (paymentMethod === "Card") {
      const { number, expiry, cvv } = cardDetails;
      if (!number || !expiry || !cvv) {
        toast.warning("⚠️ Fill all card details!");
        return;
      }
      if (number.length !== 16) {
        toast.warning("⚠️ Card number must be 16 digits!");
        return;
      }
      if (cvv.length !== 3) {
        toast.warning("⚠️ CVV must be 3 digits!");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        userEmail: user?.email,
        name,
        phone,
        address,
        state,
        pincode,
        paymentMethod: paymentMethod === "UPI" ? `UPI - ${upiOption || upiId}` :
                        paymentMethod === "Card" ? `Card - ${cardDetails.number.slice(-4)}` :
                        paymentMethod,
        location: coords,
        items: cart,
        total: totalAmount,
        date: new Date().toISOString(),
      };
      existingOrders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      setLoading(false);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/order");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex justify-center items-start bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">💳 Payment Details</h2>
        <div className="flex flex-col gap-4">

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg p-3 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="10-digit Phone Number"
            className="border rounded-lg p-3 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
            maxLength="10"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            className="border rounded-lg p-3 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Pincode */}
          <input
            type="text"
            placeholder="Pincode"
            className="border rounded-lg p-3 w-full"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/, ""))}
          />

          {/* State */}
          <select
            className="border rounded-lg p-3 w-full"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">Select State</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
          </select>

          {/* Location */}
          <button
            onClick={handleGetLocation}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt /> Use Current Location
          </button>

          {coords.lat && (
            <iframe
              title="map"
              width="100%"
              height="200"
              className="rounded-lg shadow-md mt-2"
              src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
            ></iframe>
          )}

          {/* Payment Methods */}
          <div className="mt-4">
            <label className="font-semibold text-gray-700">Select Payment Method:</label>
            <div className="flex flex-col gap-2 mt-2">

              {/* COD */}
              <button
                onClick={() => { setPaymentMethod("COD"); setShowPaymentOptions(false); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg w-full ${paymentMethod === "COD" ? "bg-green-500 text-white" : "bg-white"}`}
              >
                <FaWallet /> Cash on Delivery
              </button>

              {/* UPI */}
              <button
                onClick={() => { setPaymentMethod("UPI"); setShowPaymentOptions(!showPaymentOptions); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg w-full ${paymentMethod === "UPI" && showPaymentOptions ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <FaMobileAlt /> UPI / Digital Wallet
              </button>

              {paymentMethod === "UPI" && showPaymentOptions && (
                <div className="flex flex-col gap-2 mt-2 pl-6">
                  <button onClick={() => setUpiOption("Google Pay")} className={`flex items-center gap-2 px-3 py-2 border rounded-lg w-full ${upiOption === "Google Pay" ? "bg-indigo-500 text-white" : "bg-white"}`}>Google Pay</button>
                  <button onClick={() => setUpiOption("PhonePe")} className={`flex items-center gap-2 px-3 py-2 border rounded-lg w-full ${upiOption === "PhonePe" ? "bg-indigo-500 text-white" : "bg-white"}`}>PhonePe</button>
                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="border px-3 py-2 rounded-lg mt-2"
                  />
                </div>
              )}

              {/* Card */}
              <button
                onClick={() => { setPaymentMethod("Card"); setShowPaymentOptions(!showPaymentOptions); }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg w-full ${paymentMethod === "Card" && showPaymentOptions ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <FaCreditCard /> Credit / Debit / ATM Card
              </button>

              {paymentMethod === "Card" && showPaymentOptions && (
                <div className="flex flex-col gap-2 mt-2 pl-6">
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    maxLength="16"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/, "") })}
                    className="border px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="border px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength="3"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/, "") })}
                    className="border px-3 py-2 rounded-lg"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Total + Pay */}
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-slate-800 mb-4">Total: ₹{totalAmount}</p>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full font-semibold transition"
            >
              {loading ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Order Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center animate-[pop_0.4s_ease-in-out]">
            <h2 className="text-4xl font-bold text-green-600 mb-3">🎉 Order Completed!</h2>
            <p className="text-gray-600 text-lg">Thank you for your purchase!</p>
            <p className="text-sm mt-2 text-gray-500">Redirecting to Orders...</p>
          </div>
          <style>{`
            @keyframes pop {
              0% { transform: scale(0.7); opacity: 0; }
              60% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Payment;
