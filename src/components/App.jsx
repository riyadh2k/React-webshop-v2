import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import ProductPage from "./ProductPage";
import ShoppingCart from "./ShoppingCart";
import "../css/App.css";

function App() {
  const [numOfItemsInCart, setNumOfItemsInCart] = useState([]);

  return (
    <div>
      <Navbar numOfItemsInCart={numOfItemsInCart} />
      <Routes>
        <Route
          path="/"
          element={<ProductPage setNumOfItemsInCart={setNumOfItemsInCart} />}
        />
        <Route
          path="/product"
          element={<ProductPage setNumOfItemsInCart={setNumOfItemsInCart} />}
        />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </div>
  );
}

export default App;
