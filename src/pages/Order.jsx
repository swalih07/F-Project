import { useEffect, useState } from "react";
import axios from "axios";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let user = null;
  try {
    const raw = localStorage.getItem("loggedInUser");
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Failed to parse loggedInUser from localStorage", e);
    user = null;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/orders?userId=${user.id}`);
        setOrders(response.data.reverse());
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        🧾 Your Orders
      </h2>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">
          No orders yet! 🛍️ Start shopping now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, orderIdx) => {
            // ✅ Calculate total from items
            const orderTotal = (order.items || []).reduce(
              (sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)),
              0
            );

            return (
              <div
                key={order.id ?? `order-${orderIdx}`}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full 
                      ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                {(order.items || []).map((item, itemIdx) => (
                  <div
                    key={item.id ?? `item-${itemIdx}`}
                    className="flex items-center gap-3 border-b py-2"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name || "product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-gray-600">₹{item.price}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        Subtotal: ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* ✅ Show total below all items */}
                <p className="text-right text-blue-700 font-bold mt-4 text-lg">
                  Total: ₹{orderTotal}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order;
