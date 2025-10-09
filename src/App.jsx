import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";



function App() {
  return (
    <Router>
      <Navbar />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/product" element={<Products/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/wishlist" element={<Wishlist/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
      
    </Router>
  );
}

export default App;

