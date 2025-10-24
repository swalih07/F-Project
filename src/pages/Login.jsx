
import Navbar from "../component/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login via backend (json-server query)
      const res = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        toast.error("❌ Invalid email or password!");
        return;
      }

      const user = res.data[0];

      // Set logged-in user in app state
      setUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      toast.success("✅ Login Successful!");

      // If user is admin, redirect to admin dashboard, otherwise go home
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong. Try again!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center px-4 mt-20 bg-gray-100">
        <div className="bg-slate-800 text-white rounded-lg shadow-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 rounded-md text-white bg-slate-700"
              />
            </div>
            <div className="flex flex-col">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-2 rounded-md text-white bg-slate-700"
              />
            </div>
            <button type="submit" className="bg-blue-500 py-2 rounded-md mt-2">
              Login
            </button>
          </form>
          <div className="mt-6 text-center text-gray-300">
            Don’t have an account?{" "}
            <Link to="/registration" className="text-blue-400 hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
