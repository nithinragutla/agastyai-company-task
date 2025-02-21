import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShoppingCart from "./components/ShoppingCart";
import CartPage from "./components/cartpage"; // Ensure correct casing
import Navbar from "./components/navbar";      // Ensure correct casing

const App = () => {
  const [cart, setCart] = useState([]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      {/* Pass cartCount to Navbar */}
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<ShoppingCart cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>
    </Router>
  );
};

export default App;
