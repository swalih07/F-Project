import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { useState } from "react";
import { toast } from "react-toastify";

function ProductDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useCart();
  const product = state?.product;
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) {
    return <h2 className="text-center text-xl mt-10">No product found!</h2>;
  }

  const sizes = [6, 7, 8, 9, 10, 11, 12]; // Example shoe sizes

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-6 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row gap-10 max-w-6xl w-full">

        {/* LEFT SIDE — Images */}
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-1/2">
          {/* Main Image with hover zoom */}
          <div className="flex-1 overflow-hidden rounded-xl shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover transform transition duration-500 hover:scale-110 hover:rotate-2"
            />
          </div>

          {/* Small images */}
          <div className="flex md:flex-col justify-center gap-3 mt-4 md:mt-0">
            {[product.image, product.image, product.image].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`view ${index}`}
                className="w-24 h-24 object-cover rounded-lg shadow-sm hover:scale-105 transition cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE — Details */}
        <div className="flex flex-col justify-between md:w-1/2">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-blue-600 font-semibold text-2xl mb-4">
              ₹{product.price}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Shoe Features */}
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>✅ Premium breathable material</li>
              <li>✅ Shock-absorb sole for extra comfort</li>
              <li>✅ Water-resistant coating</li>
              <li>✅ Lightweight & durable design</li>
              <li>✅ Ideal for casual and sports wear</li>
            </ul>

            {/* Shoe Sizes */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Select Size:</h4>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === size
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                if (!selectedSize) return alert("Please select a size!");
                if (user) {
                  addToCart({ ...product, selectedSize });
                  navigate("/cart");
                } else {
                   toast.error("⚠️ Please login to add items to cart!")
                  navigate("/login");
                }
              }}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-lg transition"
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              onClick={() => {
                if (user) {
                  addToWishlist(product);
                } else {
                   toast.error("⚠️ Please login to add items to cart!")
                  navigate("/login");
                }
              }}
              className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-medium text-lg transition"
            >
              <FaHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
