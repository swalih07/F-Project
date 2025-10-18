import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

function Wishlist() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Fetch wishlist from backend when page loads
  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/wishlist?userId=${user.id}`);
        setWishlist(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch wishlist:", err);
        toast.error("Failed to load wishlist!");
      }
    };

    fetchWishlist();
  }, [user]);

  // Remove from wishlist (delete from DB)
  const handleRemove = async (id) => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:5000/wishlist/${id}`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      toast.success("🗑️ Removed from Wishlist!");
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
      toast.error("Failed to remove item!");
    }
  };

  // Add item to cart (save in DB)
  const handleAddToCart = async (item) => {
    if (!user) {
      toast.error("⚠️ Please login first!");
      return;
    }

    try {
      // Add to cart DB
      await axios.post("http://localhost:5000/cart", {
        ...item,
        userId: user.id,
      });

      addToCart(item);
      toast.success("🛒 Added to Cart!");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      toast.error("Failed to add item to cart!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">💖 Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => (
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
                  onClick={() => handleAddToCart(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
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

export default Wishlist;
