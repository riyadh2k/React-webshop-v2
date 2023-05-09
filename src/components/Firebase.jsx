import "firebase/database";
import "firebase/firestore";

export const getProducts = async () => {
  console.log("Fetching products...");
  const response = await fetch(
    "https://webshop-9434b-default-rtdb.europe-west1.firebasedatabase.app/products.json"
  );

  if (response.ok) {
    const data = await response.json();
    if (data !== undefined && data !== null) {
      const fetchedProducts = Object.entries(data).map(([id, product]) => ({
        id,
        ...product,
      }));
      console.log("Products fetched:", fetchedProducts);
      return fetchedProducts;
    }
  }

  console.log("No products found");
  return []; // return an empty array if no data is found or there...
};

export const getCart = async () => {
  console.log("Fetching cart...");
  const response = await fetch(
    "https://webshop-9434b-default-rtdb.europe-west1.firebasedatabase.app/cart.json"
  );

  if (response.ok) {
    const data = await response.json();
    if (data !== undefined && data !== null) {
      const items = Object.entries(data.items || {}).map(([id, item]) => ({
        id,
        ...item,
      }));
      const totalPrice = parseFloat(data.totalPrice) || 0;
      console.log("Cart fetched:", { items, totalPrice });
      return { items, totalPrice };
    }
  }

  console.log("No cart found");
  return { items: [], totalPrice: 0 }; // return an empty cart object if no data is found or there is an error
};

export const updateCart = async (cart, onCartUpdated) => {
  console.log("Updating cart...");
  const response = await fetch(
    "https://webshop-9434b-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    }
  );

  if (!response.ok) {
    throw new Error("Could not update cart");
  }

  console.log("Cart updated successfully");

  if (onCartUpdated) {
    onCartUpdated();
  }
};

export const updateInventory = async (productId, newInventory) => {
  console.log(`Updating inventory of product ${productId} to ${newInventory}`);
  // Check if newInventory is a number, and convert it to a number if necessary
  // if (typeof newInventory !== 'number') {
  //   newInventory = Number(newInventory);
  // }

  return fetch(
    `https://webshop-9434b-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory: newInventory,
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }
      return response.json();
    })
    .then((data) => {
      console.log(
        `Inventory of product ${productId} updated to ${newInventory}`
      );
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};
