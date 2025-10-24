import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";

export default function AdminAnalytics({ user, setUser }) {
  const [summary, setSummary] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, uRes, oRes] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/orders"),
        ]);

        const products = pRes.data.length;
        const users = uRes.data.length;
        const orders = oRes.data.length;
        const revenue = oRes.data.reduce((s, o) => s + (o.amount || 0), 0);

        setSummary({ products, users, orders, revenue });

        // Revenue per day (last 30 days)
        const byDate = {};
        const byDateCount = {};
        oRes.data.forEach((o) => {
          const d = new Date(o.date).toISOString().split("T")[0];
          const rev = (Number(o.amount) || Number(o.total) || 0);
          byDate[d] = (byDate[d] || 0) + rev;
          byDateCount[d] = (byDateCount[d] || 0) + 1;
        });

        const days = Object.keys(byDate).sort().slice(-30);
        setOrdersTrend(days.map((d) => ({ date: d, revenue: byDate[d], orders: byDateCount[d] || 0 })));

        // Top products by revenue
        const productRevenue = {};
        oRes.data.forEach((o) => {
          (o.items || []).forEach((it) => {
            const id = it.id?.toString() ?? String(it.productId ?? it._id ?? "");
            const rev = (Number(it.price) || 0) * (Number(it.quantity) || 1);
            productRevenue[id] = (productRevenue[id] || 0) + rev;
          });
        });

        const topProducts = Object.entries(productRevenue)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([id, revenue]) => ({ id, revenue }));

        const topProductsEnriched = topProducts.map((tp) => {
          const prod = pRes.data.find((p) => p.id.toString() === tp.id.toString());
          return { id: tp.id, name: prod?.name || `Product ${tp.id}`, revenue: tp.revenue };
        });

        const totalTopRevenue = topProductsEnriched.reduce((s, p) => s + p.revenue, 0) || 1;
        const topWithPercent = topProductsEnriched.map((p) => ({ ...p, percent: (p.revenue / totalTopRevenue) * 100 }));
        setTopProducts(topWithPercent);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const gradientColors = ["#6a11cb", "#2575fc"]; // Gradient purple-blue

  return (
    <>
      <AdminNavbar user={user} setUser={setUser} />
      <div className="pl-64 pt-8 min-h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {["Products", "Users", "Orders", "Revenue"].map((title, idx) => (
              <div key={idx} className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold">
                  {title === "Products"
                    ? summary.products
                    : title === "Users"
                    ? summary.users
                    : title === "Orders"
                    ? summary.orders
                    : `₹${summary.revenue.toLocaleString()}`}
                </p>
              </div>
            ))}
          </div>

          {/* Revenue Trend */}
          <div className="bg-white rounded shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Revenue Trend (last 30 days)</h2>
            <div style={{ width: "100%", height: 300 }}>
              {ordersTrend.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">No data yet</div>
              ) : (
                <ResponsiveContainer>
                  <BarChart data={ordersTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={gradientColors[1]} stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(val) => `₹${val.toLocaleString()}`} />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                    <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Top Products by Revenue</h3>
            <div style={{ width: "100%", height: 250 }}>
              {topProducts.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">No product data</div>
              ) : (
                <ResponsiveContainer>
  <PieChart>
    <Pie
      data={topProducts}
      dataKey="revenue"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={90}
      labelLine={false}
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
    >
      {topProducts.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={["#4F46E5", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6"][index % 6]}
        />
      ))}
    </Pie>

    <Tooltip
      formatter={(val) => `₹${Number(val).toLocaleString()}`}
      contentStyle={{
        borderRadius: "8px",
        border: "none",
        background: "#ffffff"
      }}
    />

    <Legend verticalAlign="bottom" height={36} />
  </PieChart>
</ResponsiveContainer>

              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
