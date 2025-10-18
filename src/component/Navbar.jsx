import { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo2 from "../assets/Logo2.png";
import { useCart } from "../pages/CartContext";

function Navbar({ user, setUser, setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { cart, wishlist } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCartCount(cart?.length || 0);
    setWishlistCount(wishlist?.length || 0);
  }, [cart, wishlist]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate("/product");
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={Logo2} alt="Brand Logo" className="w-20 h-10 object-contain" />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          BIGGER MAX
        </h1>
      </div>

      {/* Search Bar (Desktop) */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex flex-1 mx-6 justify-center"
      >
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </form>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-blue-400 font-semibold">
          Home
        </Link>
        <Link to="/product" className="hover:text-blue-400 font-semibold">
          Products
        </Link>
        <Link to="/order" className="hover:text-blue-400 font-semibold">
          Orders
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="hover:text-red-400 flex items-center gap-1 relative"
        >
          <FaHeart />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-pink-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="hover:text-blue-400 flex items-center gap-1 relative"
        >
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User */}
        {user ? (
          <>
            <span className="font-semibold text-yellow-300">
              Hi, {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="hover:text-blue-400 border border-gray-400 px-3 py-1 rounded-md font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="hover:text-blue-400 border border-gray-400 px-3 py-1 rounded-md font-semibold"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div
        className="md:hidden text-2xl cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-700 flex flex-col items-center gap-4 py-4 md:hidden z-50">
          <form onSubmit={handleSearch} className="relative w-11/12">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>

          <Link to="/" className="hover:text-blue-400 font-semibold">
            Home
          </Link>
          <Link to="/product" className="hover:text-blue-400 font-semibold">
            Products
          </Link>
          <Link to="/order" className="hover:text-blue-400 font-semibold">
            Orders
          </Link>

          {user ? (
            <>
              <span className="font-semibold text-yellow-300">
                Hi, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-blue-400 border border-gray-400 px-4 py-1 rounded-md font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:text-blue-400 border border-gray-400 px-4 py-1 rounded-md font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
