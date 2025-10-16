import Navbar from "../component/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        alert("Login Successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.dispatchEvent(new Event("storage")); // 👈 instantly updates Navbar
        navigate("/");
      } else {
        alert("Invalid email or password!");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 mt-20">
        <div className="bg-slate-800 text-white rounded-lg shadow-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 rounded-md text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 rounded-md mt-2"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don’t have an account?{" "}
              <Link to="/registration" className="text-blue-400 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
