import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/cart', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await fetch('http://localhost:3001/cart-delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${productId}`);
      }

      // Fetch updated cart items
      const updatedCartItems = await fetch('http://localhost:3001/cart', {credentials: 'include'});
      const updatedCart = await updatedCartItems.json();

      setCartItems(updatedCart);
    } catch (err) {
      console.error(`Error deleting from cart: ${err}`);
    }
  };

  const handleOrder = async () => {
    await fetch('http://localhost:3001/create-order', { method: 'POST', credentials: 'include' });
    navigate('/orders');
    setCartItems([]);
  };

  if (!cartItems) {
    return <h1>Loading...</h1>;
  }

  return (
    <main className="centered">
      {cartItems.length > 0 ? (
        <>
          <h1>Your Shopping Cart</h1>
          <ul className="cart__item-list">
            {cartItems.map((item) => (
              <li key={item.product._id} className="cart__item">
                <h1>{item.product.title}</h1>
                <img style={{ width: '15%' }} src={item.product.imageUrl} alt={item.product.title} />
                <p>Quantity: {item.quantity}</p>
                <h4>{item.product.price * item.quantity} €</h4>
                <button className="btn danger" onClick={() => handleDelete(item.product._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <hr style={{ width: '100%' }} />
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
