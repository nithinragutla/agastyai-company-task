import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/CartPage.css";

const CartPage = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    fetch("https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [setCart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showCustomAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
    }, 2000);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(cart.map((item) => {
      if (item.id === productId) {
        const productInCatalog = products.find((p) => p.id === productId);
        const stockLimit = productInCatalog ? productInCatalog.quantity : 0;

        if (newQuantity > stockLimit) {
          showCustomAlert(`⚠ Only ${stockLimit} items available in stock.`, "error");
          return item;
        }
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));

    showCustomAlert("✅ Cart updated successfully", "success");
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showCustomAlert("🗑 Item removed from cart", "warning");
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      {alertMessage && <div className={`custom-alert ${alertType}`}>{alertMessage}</div>}

      <h2>Shopping Cart</h2>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty. <Link to="/">Continue Shopping</Link></p>
        ) : (
          <div>
            {cart.map((item) => {
              const productInCatalog = products.find((p) => p.id === item.id);
              const availableStock = productInCatalog ? productInCatalog.stock : 0;

              return (
                <div key={item.id} className="cart-item">
                  <img src={item.imageURL} alt={item.name} className="cart-image" />
                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <p>₹ {item.price}</p>
                  </div>
                  <div className="cart-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= availableStock}
                      >
                        +
                      </button>
                    </div>
                    <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
            <h3>Total: ₹ {totalAmount}</h3>
            <Link to="/" className="back-btn">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
