
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { useState, useEffect } from "react";
import { CartProvider } from "./pages/CartContext";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminAnalytics from "./Admin/AdminAnalytics";
import AdminOrders from "./Admin/AdminOrders";
import AdminProducts from "./Admin/AdminProducts";
import AdminUsers from "./Admin/AdminUsers";

function App() {
  // Initialize user synchronously from localStorage to avoid a brief unauthenticated
  // render on page refresh which caused protected routes to redirect to /login.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch (e) {
      return null;
    }
  });

  return (
    <Router>
      <CartProvider user={user}>
        {/* show main Navbar only on non-admin routes */}
        <ConditionalNavbar user={user} setUser={setUser} />

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
          <Route path="/productdetails" element={<ProductDetails />} />
          {/* Admin Routes (protected) */}
          <Route
            path="/admin"
            element={
              user?.isAdmin ? (
                <AdminDashboard user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/analytics"
            element={
              user?.isAdmin ? (
                <AdminAnalytics user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/orders"
            element={
              user?.isAdmin ? (
                <AdminOrders user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/products"
            element={
              user?.isAdmin ? (
                <AdminProducts user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              user?.isAdmin ? (
                <AdminUsers user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
  </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </Router>
  );
}

// Small internal component to decide whether to render the public Navbar
function ConditionalNavbar({ user, setUser }) {
  const location = useLocation();

  // hide the main Navbar for any admin routes
  if (location.pathname.startsWith("/admin")) return null;
  return <Navbar user={user} setUser={setUser} />;
}

export default App;
