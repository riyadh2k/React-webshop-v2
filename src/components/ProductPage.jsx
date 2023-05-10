import React, { useState, useEffect } from "react";
import "../css/ProductPage.css";
import { getProducts, getCart, updateCart } from "./Firebase";
import Navbar from "./Navbar";

function ProductPage({ setNumOfItemsInCart }) {
  // State variables to hold products, cart items, and total price
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  setNumOfItemsInCart(() => {
    const tempArr = cartItems.map((p) => p.quantity);
    if (tempArr.length) {
      return tempArr.reduce((a, b) => a + b);
    } else return 0;
  });

  // Use useEffect to fetch products and cart data when the component mounts
  useEffect(() => {
    // Fetch products
    getProducts().then((fetchedProducts) => {
      setProducts(fetchedProducts);
    });

    // Fetch cart data
    getCart().then((data) => {
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    });
  }, []);
  // Function to handle adding a product to the cart
  const handleAddToCart = (product) => {
    // Check if the product is in stock and whether the item is already in the cart or not
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);

    if (
      product.inventory > 0 &&
      (itemIndex === -1 || cartItems[itemIndex].quantity < product.inventory)
    ) {
      // If the item is not in the cart, add it as a new item
      if (itemIndex === -1) {
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          inventory: product.inventory,
        };
        const newCartItems = [...cartItems, newItem];
        const newTotalPrice = totalPrice + newItem.price;
        updateCart({ items: newCartItems, totalPrice: newTotalPrice }, () => {
          setCartItems(newCartItems);
          setTotalPrice(newTotalPrice);
        });
      } else {
        // If the item is already in the cart, update its quantity
        const updatedItem = { ...cartItems[itemIndex] };
        updatedItem.quantity++;
        const newCartItems = [...cartItems];
        newCartItems[itemIndex] = updatedItem;
        const newTotalPrice = totalPrice + updatedItem.price;
        updateCart({ items: newCartItems, totalPrice: newTotalPrice }, () => {
          setCartItems(newCartItems);
          setTotalPrice(newTotalPrice);
        });
      }
    }
    console.log(cartItems);
  };
  // Render the products and their information
  return (
    <div className="product-page">
      {products.map((product) => (
        <div key={product.id} className="product">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-info">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">Price: {product.price}</p>
            {product.inventory > 0 ? (
              <React.Fragment>
                <p className="product-inventory">
                  Inventory: {product.inventory}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={
                    product.id >= product.inventory || product.inventory === 0
                  }
                >
                  Add to Cart {/*({buttonCount[product.id] || 0}) */}
                </button>
              </React.Fragment>
            ) : (
              <p>Out of stock</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default ProductPage;
