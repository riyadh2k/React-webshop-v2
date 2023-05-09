import { useState } from "react";

function Counter({ handleAddToCart }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    handleAddToCart();
    setCount(count + 1);
  };

  return (
    <div onClick={handleClick}>
      <span>{count}</span>
    </div>
  );
}

export default Counter;
