import { useEffect, useState } from "react";

function Order() {
  const [orders, setOrders] = useState([]);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = savedOrders.filter(
      (order) => order.userEmail === user?.email
    );
    setOrders(userOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        🧾 Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">
          No orders yet! 🛍️ Start shopping now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition"
            >
              <h3 className="text-lg font-semibold mb-2 text-slate-700">
                Order #{index + 1}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Date:</strong> {new Date(order.date).toLocaleString()}
              </p>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b py-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <p className="text-gray-600">₹{item.price}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-right text-blue-600 font-semibold mt-3">
                Total: ₹{order.total}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
