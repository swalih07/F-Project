
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // 🔹 Fetch cart & wishlist when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          axios.get(`http://localhost:5000/cart?userId=${user.id}`),
          axios.get(`http://localhost:5000/wishlist?userId=${user.id}`),
        ]);

        setCart(cartRes.data || []);
        setWishlist(wishlistRes.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cart/wishlist:", err);
      }
    };

    fetchData();
  }, [user]);

  // 🛒 Add to cart
  const addToCart = async (product) => {
    if (!user) return alert("Please login to add items to cart!");

    // Avoid duplicates
    const alreadyInCart = cart.find((item) => item.id === product.id);
    if (alreadyInCart) {
      alert("Item already in cart!");
      return;
    }

    const newItem = { ...product, userId: user.id, quantity: 1 };

    try {
      const res = await axios.post("http://localhost:5000/cart", newItem);
      setCart((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
    }
  };

  // 🗑️ Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const item = cart.find((c) => c.id === productId);
      if (item) await axios.delete(`http://localhost:5000/cart/${item.id}`);
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error("❌ Failed to remove from cart:", err);
    }
  };

  // 🧹 Clear entire cart (after payment)
  const clearCart = async () => {
    if (!user) return;
    try {
      const userCartItems = cart.filter((c) => c.userId === user.id);
      for (const item of userCartItems) {
        await axios.delete(`http://localhost:5000/cart/${item.id}`);
      }
      setCart([]);
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

  // 💖 Add to wishlist
  const addToWishlist = async (product) => {
    if (!user) return alert("Please login to add items to wishlist!");

    // Avoid duplicates
    const alreadyInWishlist = wishlist.find((item) => item.id === product.id);
    if (alreadyInWishlist) {
      alert("Item already in wishlist!");
      return;
    }

    const newItem = { ...product, userId: user.id };

    try {
      const res = await axios.post("http://localhost:5000/wishlist", newItem);
      setWishlist((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Failed to add to wishlist:", err);
    }
  };

  // 🗑️ Remove from wishlist
  const removeFromWishlist = async (id) => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:5000/wishlist/${id}`);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Failed to remove from wishlist:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
