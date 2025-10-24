import { Link, useNavigate } from "react-router-dom";

function AdminNavbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  // Left Sidebar for admin
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-50 shadow-lg">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-wide">ADMIN PANEL</h1>
          {user && <div className="text-sm text-gray-300 mt-2">{user.fullName}</div>}
        </div>

        <nav className="flex-1 flex flex-col gap-3">
          <Link to="/admin" className="px-3 py-2 rounded hover:bg-slate-800">Dashboard</Link>
          <Link to="/admin/analytics" className="px-3 py-2 rounded hover:bg-slate-800">Analytics</Link>
          <Link to="/admin/products" className="px-3 py-2 rounded hover:bg-slate-800">Products</Link>
          <Link to="/admin/orders" className="px-3 py-2 rounded hover:bg-slate-800">Orders</Link>
          <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-slate-800">Users</Link>
        </nav>

        <div className="mt-6">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700">Logout</button>
        </div>
      </div>
    </aside>
  );
}

export default AdminNavbar;
