import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { FaBox, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";

function AdminDashboard({ user, setUser }) {
  // Initialize state
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data from API
        const [products, users, orders] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/orders")
        ]);

        // Calculate statistics
        const totalRevenue = orders.data.reduce((sum, order) => sum + (order.amount || 0), 0);
        
        // Update stats
        setStats({
          totalProducts: products.data.length,
          totalUsers: users.data.length,
          totalOrders: orders.data.length,
          totalRevenue
        });

        // Set recent orders (last 5, reversed)
        setRecentOrders(orders.data.slice(-5).reverse());

        // Process products to find top selling items
        const productCounts = {};
        orders.data.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              productCounts[item.id] = (productCounts[item.id] || 0) + 1;
            });
          }
        });

        // Sort products by sales count and get top products
        const topProductIds = Object.entries(productCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([id]) => id);

        // Get full product details for top products
        const topProductsData = products.data
          .filter(product => topProductIds.includes(product.id.toString()))
          .slice(0, 6);

        setTopProducts(topProductsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <AdminNavbar user={user} setUser={setUser} />
      <main className="pl-64 pt-8 bg-gray-100">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading admin data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm">
                Make sure json-server is running:
                <br />
                1. Open a new terminal
                <br />
                2. Run: npx json-server --watch db.json --port 5000
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Products</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
                    </div>
                    <FaBox className="text-blue-500 text-3xl" />
                  </div>
                  <Link to="/admin/products" className="text-blue-500 text-sm hover:underline mt-4 block">
                    Manage Products
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
                    </div>
                    <FaUsers className="text-green-500 text-3xl" />
                  </div>
                  <Link to="/admin/users" className="text-blue-500 text-sm hover:underline mt-4 block">
                    Manage Users
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Orders</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                    </div>
                    <FaShoppingCart className="text-purple-500 text-3xl" />
                  </div>
                  <Link to="/admin/orders" className="text-blue-500 text-sm hover:underline mt-4 block">
                    View Orders
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue}</h3>
                    </div>
                    <FaChartLine className="text-orange-500 text-3xl" />
                  </div>
                  <Link to="/admin/analytics" className="text-blue-500 text-sm hover:underline mt-4 block">
                    View Analytics
                  </Link>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer || order.name || order.userEmail || order.email || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === "Completed" ? "bg-green-100 text-green-800" : 
                              order.status === "Processing" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {recentOrders.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <div className="col-span-3 text-center text-gray-500 py-4">
                      No products ordered yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
