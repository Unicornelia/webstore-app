import { useEffect, useState } from 'react';
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
    try {
      const response = await fetch('http://localhost:3001/cart-delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Fetch updated cart items
      const updatedCartItems = await fetch('http://localhost:3001/cart');
      const updatedCart = await updatedCartItems.json();

      setCartItems(updatedCart);

    } catch (err) {
      console.error(`Error deleting from cart: ${err}`);
    }
  };

  const handleOrder = async () => {
    await fetch('http://localhost:3001/create-order', { method: 'POST' });

    setCartItems([]); // Clear cart after order
  };

  return (
    <main className="centered">
      {cartItems.length > 0 ? (
        <>
          <h1>Your Shopping Cart</h1>
          <ul className="cart__item-list">
            {cartItems.map((item) => (
              <li key={item.product._id} className="cart__item">
                <h1>{item.product.title}</h1>
                <img style={{ width: '15%'}} src={item.product.imageUrl} alt={item.product.title} />
                <p>Quantity: {item.quantity}</p>
                <h4>{item.product.price * item.quantity} €</h4>
                <button className="btn danger" onClick={() => handleDelete(item.product._id)}>
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
