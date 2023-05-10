mport React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { set } from "firebase/database";

const Navbar = ({ numOfItemsInCart, setPage }) => {
  console.log(numOfItemsInCart);

  function setPageToView() {
    setPage((prev) => !prev);
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/product" className="navbar-logo">
          Web Shop
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/product" onClick={setPageToView}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/cart">
              Shopping Cart {numOfItemsInCart ? numOfItemsInCart : 0}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
