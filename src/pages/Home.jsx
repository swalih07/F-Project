import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const [videos] = useState(["video1.mp4", "video2.mp4", "video3.mp4", "video4.mp4"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Auto-change video every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [videos.length]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/homeProduct");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Video Banner */}
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-full h-full">
          {videos.map((video, index) => (
            <video
              key={index}
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0  bg-opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Our Store
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Discover premium products at the best prices.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowProducts(true)}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {showProducts && (
        <div className="w-full py-16 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate("/productdetails", { state: { product } })}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-700 mb-4">₹{product.price}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user) addToCart(product);
                        else {
                           toast.error("⚠️ Please login to add items to cart!");
                          navigate("/login");
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 transition font-medium"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user) addToWishlist(product);
                        else {
                          toast.error("⚠️ Please login to add items to cart!");
                          navigate("/login");
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-1/2 transition font-medium"
                    >
                      <FaHeart /> Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
