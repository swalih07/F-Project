
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [genderFilter, setGenderFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const itemsPerPage = 10;

  const { addToCart, addToWishlist, wishlist } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load products!");
      }
    };
    fetchProducts();
  }, []);

  const handleFilter = (gender) => {
    setGenderFilter(gender);
    setCurrentPage(1);
    let updatedProducts =
      gender === "All"
        ? [...products]
        : products.filter((p) => p.gender === gender);

    if (sortBy) updatedProducts = sortProducts(updatedProducts, sortBy);

    setFilteredProducts(updatedProducts);
  };

  const sortProducts = (items, sortOption) => {
    let sorted = [...items];
    if (sortOption === "priceLowHigh") sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === "priceHighLow") sorted.sort((a, b) => b.price - a.price);
    else if (sortOption === "nameAZ") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "nameZA") sorted.sort((a, b) => b.name.localeCompare(a.name));
    return sorted;
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    const sorted = sortProducts(filteredProducts, e.target.value);
    setFilteredProducts(sorted);
  };

  const handleAddToWishlist = (e, product) => {
    e.stopPropagation();
    if (!user) {
      toast.error("⚠️ Please login to add items to wishlist!");
      navigate("/login");
      return;
    }

    if (wishlist && wishlist.find((item) => item.id === product.id)) {
      toast.info("💖 Already in Wishlist!");
      return;
    }

    addToWishlist(product);
    toast.success("💖 Added to Wishlist!");
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
        🛍️ Our Products
      </h2>

      {/* Filter & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          {["Women", "Men", "All"].map((gender) => (
            <button
              key={gender}
              onClick={() => handleFilter(gender)}
              className={`px-4 py-2 rounded-lg ${
                genderFilter === gender
                  ? gender === "Women"
                    ? "bg-pink-500 text-white"
                    : gender === "Men"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low → High</option>
          <option value="priceHighLow">Price: High → Low</option>
          <option value="nameAZ">Name: A → Z</option>
          <option value="nameZA">Name: Z → A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {currentItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out w-full max-w-sm flex flex-col cursor-pointer"
            onClick={() => navigate("/productdetails", { state: { product } })}
          >
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-56 transition-transform duration-500 ease-in-out hover:scale-110"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1 flex-1">{product.description}</p>
              <p className="text-blue-600 font-semibold text-lg mt-2">₹{product.price}</p>

              <div className="flex justify-between mt-4 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user) {
                      addToCart(product);
                      toast.success("🛒 Added to Cart!");
                      navigate("/cart");
                    } else {
                      toast.error("⚠️ Please login to add items to cart!");
                      navigate("/login");
                    }
                  }}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex-1 justify-center"
                >
                  <FaShoppingCart /> Add to Cart
                </button>

                <button
                  onClick={(e) => handleAddToWishlist(e, product)}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition flex-1 justify-center ml-2"
                >
                  <FaHeart /> Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-3 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === num + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-3 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
