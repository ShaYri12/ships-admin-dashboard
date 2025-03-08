import React, { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import axios from "axios";

// Role types for ship positions
const SHIP_ROLES = [
  "Captain",
  "Chief Engineer",
  "First Officer",
  "Second Engineer",
  "Deck Officer",
  "Navigation Officer",
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user", // This will always be "user" for new users
    shipRole: "",
    assignedShip: "",
    status: "active",
  });

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "admin";

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:3000/api/users/${editingUser._id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:3000/api/users", formData, {
          withCredentials: true,
        });
      }
      fetchUsers();
      setIsAddingUser(false);
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "user",
        shipRole: "",
        assignedShip: "",
        status: "active",
      });
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      shipRole: user.shipRole,
      assignedShip: user.assignedShip,
      status: user.status,
    });
    setIsAddingUser(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  // If not admin, don't show the page
  if (!isAdmin) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center text-red-500">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" style={{ color: "#6366f1" }} />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <button
            onClick={() => setIsAddingUser(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* User Form */}
        {isAddingUser && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ship Role
                  </label>
                  <select
                    value={formData.shipRole}
                    onChange={(e) =>
                      setFormData({ ...formData, shipRole: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  >
                    <option value="">Select Role</option>
                    {SHIP_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assigned Ship
                  </label>
                  <select
                    value={formData.assignedShip}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedShip: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  >
                    <option value="">Select Ship</option>
                    <option value="Vlad Container">Vlad Container</option>
                    <option value="Paulo Tanker">Paulo Tanker</option>
                    <option value="Evy Yacht">Evy Yacht</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingUser(false);
                    setEditingUser(null);
                    setFormData({
                      name: "",
                      email: "",
                      role: "user",
                      shipRole: "",
                      assignedShip: "",
                      status: "active",
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingUser ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  System Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Ship Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Assigned Ship
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.shipRole}</td>
                  <td className="px-6 py-4">{user.assignedShip}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && user._id !== currentUser._id && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
