import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Payment from "./pages/Payment";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState,useEffect } from "react";
import { CartProvider } from "./pages/CartContext";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <Router>
      <CartProvider user={user}>
        <Navbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/registration" element={<Registration setUser={setUser} />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order" element={<Order />} />
          <Route path="/Productdetails" element={<ProductDetails />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </Router>
  );
}

export default App;
