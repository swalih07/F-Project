import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount } = location.state || {};

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // 🔹 Get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        (error) => {
          alert("Location access denied! Please enable GPS.");
          console.error(error);
        }
      );
    } else {
      alert("Your browser does not support location access!");
    }
  };

  // 🔹 Handle payment
  const handlePayment = () => {
    if (!name || !address || !phone || !state || !pincode || !paymentMethod) {
      alert("⚠️ Please fill all fields!");
      return;
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

      // Auto close popup & redirect
      setTimeout(() => {
        setShowPopup(false);
        navigate("/orders");
      }, 3000);
    }, 1500);
  };

  // 🔹 Check if cart is empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      alert("🛒 Cart is empty!");
      navigate("/products");
    }
  }, [cart, navigate]);

  return (
    <div className="relative min-h-screen flex justify-center items-start bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg mt-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          💳 Payment Details
        </h2>

        <div className="flex flex-col gap-4">
          {/* Name */}
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
            placeholder="Phone Number"
            className="border rounded-lg p-3 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10}"
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
            onChange={(e) => setPincode(e.target.value)}
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
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            📍 Use Current Location
          </button>

          {coords.lat && (
            <iframe
              title="map"
              width="100%"
              height="250"
              className="rounded-lg shadow-md mt-2"
              src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
            ></iframe>
          )}

          {/* Payment Method */}
          <div className="mt-2">
            <label className="font-semibold text-gray-700">Payment Method:</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Total + Pay Button */}
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-slate-800 mb-4">
              Total: ₹{totalAmount}
            </p>
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

      {/* 🎉 Centered Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center animate-[pop_0.4s_ease-in-out]">
            <h2 className="text-4xl font-bold text-green-600 mb-3">
              🎉 Order Completed!
            </h2>
            <p className="text-gray-600 text-lg">Thank you for your purchase!</p>
            <p className="text-sm mt-2 text-gray-500">Redirecting to Orders...</p>
          </div>

          {/* 🎨 Custom pop animation */}
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
