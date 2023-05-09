import React, { useState, useEffect } from "react";
import "../css/ProductPage.css";
import { getProducts, getCart, updateCart } from "./Firebase";
import Navbar from "./Navbar";

function ProductPage({ setNumOfItemsInCart }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  setNumOfItemsInCart(() => {
    const tempArr = cartItems.map((p) => p.quantity);
    if (tempArr.length) {
      return tempArr.reduce((a, b) => a + b);
    } else return 0;
  });

  useEffect(() => {
    getProducts().then((fetchedProducts) => {
      setProducts(fetchedProducts);
    });
    getCart().then((data) => {
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    });
  }, []);

  const handleAddToCart = (product) => {
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);

    if (
      product.inventory > 0 &&
      (itemIndex === -1 || cartItems[itemIndex].quantity < product.inventory)
    ) {
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
