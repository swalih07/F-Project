import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleBuyAll = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    // Navigate to payment page and pass cart & totalAmount
    navigate("/payment", { state: { cart, totalAmount } });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Cart is empty!</p>
      ) : (
        <>
          <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Amount:</h3>
            <p className="text-xl font-bold text-green-600">₹{totalAmount}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-4 text-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500 mt-2">₹{item.price}</p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Buy All Button */}
          <div className="max-w-3xl mx-auto mt-8 flex justify-center">
            <button
              onClick={handleBuyAll}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              Buy All for ₹{totalAmount}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
