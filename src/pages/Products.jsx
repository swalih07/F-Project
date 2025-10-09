import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext"; 
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [genderFilter, setGenderFilter] = useState("All");
  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle gender filter
  const handleFilter = (gender) => {
    setGenderFilter(gender);
    if (gender === "All") setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.gender === gender));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        🛍️ Our Products
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => handleFilter("Women")}
          className={`px-4 py-2 rounded-lg ${
            genderFilter === "Women"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-pink-300"
          }`}
        >
          Women
        </button>
        <button
          onClick={() => handleFilter("Men")}
          className={`px-4 py-2 rounded-lg ${
            genderFilter === "Men"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-300"
          }`}
        >
          Men
        </button>
        <button
          onClick={() => handleFilter("All")}
          className={`px-4 py-2 rounded-lg ${
            genderFilter === "All"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-green-300"
          }`}
        >
          All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition w-full max-w-sm"
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-56"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{product.description}</p>
              <p className="text-blue-600 font-semibold text-lg mt-2">₹{product.price}</p>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    addToCart(product);
                    navigate("/cart");
                  }}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => addToWishlist(product)}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg transition"
                >
                  <FaHeart /> Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
