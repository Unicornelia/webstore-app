import { useState, useEffect } from 'react';
import '../css/Cart.css'; // Ensure styling is included

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/cart')
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (productId) => {
    await fetch('http://localhost:3001/cart-delete-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    const updatedCartItems = await fetch('http://localhost:3001/cart');
    const updatedCart = await updatedCartItems.json();

    setCartItems(updatedCart);
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
              <li key={p._id} className="cart__item">
                <h1>{p.title}</h1>
                <img style={{ width: '10%' }} src={p.imageUrl} alt={p.title} />
                <h2>Quantity: {p.quantity}</h2>
                <button className="btn danger" onClick={() => handleDelete(p._id)}>
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
