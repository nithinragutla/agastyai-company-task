import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/CartPage.css";

const CartPage = ({ cart, setCart }) => {
  useEffect(() => {
    // Get saved cart from localStorage when the component mounts
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [setCart]);

  // Save cart to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId, amount) => {
    setCart(cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;

        // Check for stock limit (assuming `item.stock` contains the stock limit)
        if (newQuantity > item.stock) {
          alert(`Only ${item.stock} items available in stock.`);
          return item;
        }

        // Ensure quantity does not drop below 1
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageURL} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>₹ {item.price}</p>
                </div>
                <div className="cart-controls">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>Qty: {item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <h3>Total: ₹ {totalAmount}</h3>
            <Link to="/" className="back-btn">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
