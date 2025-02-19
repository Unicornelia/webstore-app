import { useState, useEffect } from 'react';
import '../css/Cart.css'; // Ensure styling is included

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/cart') // Adjust API endpoint as needed
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (productId) => {
    await fetch('/api/cart-delete-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const handleOrder = async () => {
    await fetch('/api/create-order', { method: 'POST' });

    setCartItems([]); // Clear cart after order
  };

  return (
    <main className="centered">
      {cartItems.length > 0 ? (
        <>
          <h1>Your Shopping Cart</h1>
          <ul className="cart__item-list">
            {cartItems.map((p) => (
              <li key={p.id} className="cart__item">
                <h1>{p.title}</h1>
                <img style={{ width: '10%' }} src={p.imageUrl} alt={p.title} />
                <h2>Quantity: {p.cartItem.quantity}</h2>
                <button className="btn danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <hr />
          <button className="btn" onClick={handleOrder}>
            Order
          </button>
        </>
      ) : (
        <h1>Your Cart is Empty</h1>
      )}
    </main>
  );
};

export default Cart;
