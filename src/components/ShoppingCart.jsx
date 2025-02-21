import React, { useState, useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import "./styles/ShoppingCart.css";
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";

const ShoppingCart = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 786);


  useEffect(() => {
    fetch("https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 786);
      if (window.innerWidth >= 786) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCheckboxChange = (value, setFilter, filterArray) => {
    setFilter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };
  

  const filterProducts = () => {
    return products.filter((product) => {
      const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesGender = selectedGender.length === 0 || selectedGender.includes(product.gender);
      const matchesPrice = selectedPrice.length === 0 || selectedPrice.some(range => {
        const [min, max] = range.split('-').map(Number);
        return product.price >= min && (max ? product.price <= max : true);
      });
      const matchesType = selectedType.length === 0 || selectedType.includes(product.type);
      
      return matchesSearch && matchesColor && matchesGender && matchesPrice && matchesType;
    });
  };
  
//   const addToCart = (product) => {
//     const existingItem = cart.find((item) => item.id === product.id);
//     if (existingItem) {
//       setCart(cart.map((item) =>
//         item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
  
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) { // Check stock limit
        alert(`Only ${product.quantity} items available in stock.`);
        return;
      }
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  

  return (
    
    <div className="shopping-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <CiSearch className="search-btn"  /> {isMobile && <FaFilter className="filter-icon" onClick={() => setShowSidebar(!showSidebar)} />}
        


      </div>
      <div className="main-content">
{(showSidebar || !isMobile) && (
        <div className="filter-sidebar">
          <h3>Colour</h3>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Red", setSelectedColors, selectedColors)} /> Red</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Blue", setSelectedColors, selectedColors)} /> Blue</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Green", setSelectedColors, selectedColors)} /> Green</label>

          <h3>Gender</h3>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Men", setSelectedGender, selectedGender)} /> Men</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Women", setSelectedGender, selectedGender)} /> Women</label>

          <h3>Price</h3>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("0-250", setSelectedPrice, selectedPrice)} /> 0 - Rs250</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("251-450", setSelectedPrice, selectedPrice)} /> Rs251 - 450</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("450", setSelectedPrice, selectedPrice)} /> Rs450</label>

          <h3>Type</h3>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Polo", setSelectedType, selectedType)} /> Polo</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Hoodie", setSelectedType, selectedType)} /> Hoodie</label>
          <label><input type="checkbox" onChange={() => handleCheckboxChange("Basic", setSelectedType, selectedType)} /> Basic</label>
        </div>
)}

        {/* Product Grid */}
        <div className="product-grid">
  {filterProducts().map((product) => (
    <div key={product.id} className="product-card">
      <img src={product.imageURL} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>₹ {product.price}</p>
      <button 
        className="add-cart-btn" 
        onClick={() => {
          addToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  ))}
</div>

      </div>
      

    </div>
  );
};

export default ShoppingCart;
