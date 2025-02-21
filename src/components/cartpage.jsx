import React from "react";
import { Link } from "react-router-dom";
import "./styles/CartPage.css";
import { useEffect } from "react";

const CartPage = ({ cart, setCart }) => {
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
      }, []);
    
      // Save cart to localStorage whenever it updates
      useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);
    const updateQuantity = (productId, amount) => {
        setCart(cart.map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            
            if (newQuantity > item.quantity) { // Check stock limit
              alert(`Only ${item.quantity} items available in stock.`);
              return item;
            }
            
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        }));
      };
      
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
      ) : (
        <div>
          {cart.map((item) => (
            <div className="cart-item">
            <img src={item.imageURL} alt={item.name} className="cart-image" />
            <div className="cart-details">
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
            </div>
            <div className="cart-controls">
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>Qty:{item.quantity}</span>
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
  );
};
export default CartPage;