import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { FaUserEdit, FaTrash, FaUserPlus, FaEye } from "react-icons/fa";
import useUnsavedChanges from "../hooks/useUnsavedChanges";

function AdminUsers({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    isAdmin: false,
  });

  // determine if the form has unsaved changes
  const initialForm = useMemo(() => ({
    fullName: selectedUser ? selectedUser.fullName || "" : "",
    email: selectedUser ? selectedUser.email || "" : "",
    phone: selectedUser ? selectedUser.phone || "" : "",
    isAdmin: selectedUser ? selectedUser.isAdmin || false : false,
  }), [selectedUser]);

  const isDirty = useMemo(() => {
    return (
      formData.fullName !== initialForm.fullName ||
      formData.email !== initialForm.email ||
      formData.phone !== initialForm.phone ||
      formData.isAdmin !== initialForm.isAdmin
    );
  }, [formData, initialForm]);

  // prevent browser refresh/close when modal has unsaved changes
  useUnsavedChanges(isModalOpen && isDirty);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    setSelectedUser(null);
  };

  // Add or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // Update existing user
        await axios.put(
          `http://localhost:5000/users/${selectedUser.id}`,
          formData
        );
      } else {
        // Add new user
        await axios.post("http://localhost:5000/users", {
          ...formData,
          password: "default123",
          blocked: false,
        });
      }
      fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin || false,
    });
    setIsModalOpen(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Block/unblock user
  const toggleBlock = async (id, isBlocked) => {
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
        blocked: !isBlocked,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  return (
    <>
      <AdminNavbar user={user} setUser={setUser} />
      <div className="pl-64 pt-8 min-h-screen bg-gray-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage your users and administrators
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FaUserPlus /> Add User
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.blocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                        <button
                          onClick={() => setViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaUserEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleBlock(user.id, user.blocked)}
                          className={`${
                            user.blocked
                              ? "text-green-600 hover:text-green-800"
                              : "text-yellow-600 hover:text-yellow-800"
                          }`}
                        >
                          {user.blocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.isAdmin} // prevent deleting admin
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* View User Details Modal */}
          {viewUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">User Details: {viewUser.fullName}</h2>
                  <button
                    onClick={() => setViewUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 text-sm text-gray-800">
                  <div><strong>ID:</strong> {viewUser.id}</div>
                  <div><strong>Email:</strong> {viewUser.email}</div>
                  <div><strong>Phone:</strong> {viewUser.phone || '-'}</div>
                  <div><strong>Role:</strong> {viewUser.isAdmin ? 'Admin' : 'User'}</div>
                  <div><strong>Status:</strong> {viewUser.blocked ? 'Blocked' : 'Active'}</div>

                  {viewUser.cart && viewUser.cart.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Cart Items</h3>
                      <ul className="list-disc list-inside">
                        {viewUser.cart.map((item) => (
                          <li key={item.id}>{item.name} — ₹{item.price} × {item.quantity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* show any additional fields raw */}
                  <div>
                    <h3 className="font-semibold">Raw Data</h3>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(viewUser, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal for add/edit user */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedUser ? "Edit User" : "Add New User"}
                  </h2>
                  <button
                    onClick={() => {
                      if (isDirty) {
                        if (!window.confirm("You have unsaved changes. Discard them?")) {
                          return;
                        }
                      }
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Administrator Access
                    </label>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (isDirty) {
                          if (!window.confirm("You have unsaved changes. Discard them?")) {
                            return;
                          }
                        }
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedUser ? "Update User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
