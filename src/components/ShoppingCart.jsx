import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../css/ShoppingCart.css";
import { getCart, updateCart, updateInventory } from "./Firebase";

function ShoppingCart() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart data from Firebase
    getCart().then((data) => {
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    });

    // Listen for changes to cart data in Firebase
    const eventSource = new EventSource(
      "https://webshop-9434b-default-rtdb.europe-west1.firebasedatabase.app/cart.json"
    );
    eventSource.addEventListener("message", (event) => {
      const cartData = JSON.parse(event.data);
      console.log("Shopping cart updated: ", cartData);
      setCartItems(cartData.items);
      setTotalPrice(cartData.totalPrice);
    });
  }, []);

  const handlePurchase = () => {
    // Update inventory balance on Firebase
    cartItems.forEach((item) => {
      const productId = item.id;
      const newInventory = item.inventory - item.quantity;
      updateInventory(productId, newInventory).catch((error) => {
        console.error(error);
      });
    });

    // Clear the cart
    updateCart({ items: [], totalPrice: 0 }).then(() => {
      // Refetch cart data from Firebase
      getCart().then((data) => {
        setCartItems(data.items);
        setTotalPrice(data.totalPrice);
        alert("Thank you for your purchase!");
        navigate("/product");
      });
    });
  };

  const handleEmptyCart = () => {
    // Clear the cart
    updateCart({ items: [], totalPrice: 0 }).then(() => {
      // Refetch cart data from Firebase
      getCart().then((data) => {
        setCartItems(data.items);
        setTotalPrice(data.totalPrice);
        navigate("/product");
      });
    });
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>

      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity}-st) - {item.price * item.quantity} Sek
          </li>
        ))}
      </ul>
      <div className="total-quantity">
        Total Item:{" "}
        {cartItems.reduce((total, item) => total + item.quantity, 0)}
      </div>
      <div className="total price">
        Total Price: {totalPrice.toFixed(2)} Sek
      </div>
      <div className="cart-buttons">
        <button onClick={handlePurchase}>Purchase</button>
        <button onClick={handleEmptyCart}>Empty Cart</button>
      </div>
    </div>
  );
}

export default ShoppingCart;
