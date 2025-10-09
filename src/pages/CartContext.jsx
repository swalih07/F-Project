import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load saved cart & wishlist from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  // Save updates to localStorage automatically
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist]);

  // 👉 Add to cart
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      setCart([...cart, product]);
    } else {
      alert("Product already in cart!");
    }
  };

  // 👉 Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 👉 Add to wishlist
  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    } else {
      alert("Already in wishlist!");
    }
  };

  // 👉 Remove from wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  // 👉 Buy Now
  const buyNow = (product) => {
    alert(`You bought ${product.name} for ₹${product.price}`);
    removeFromCart(product.id);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
