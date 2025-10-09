import { useCart } from "./CartContext"; 

function Cart() {
  const { cart, removeFromCart, buyNow } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Cart is empty!</p>
      ) : (
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
                  onClick={() => buyNow(item)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Buy Now
                </button>
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
      )}
    </div>
  );
}

export default Cart;
