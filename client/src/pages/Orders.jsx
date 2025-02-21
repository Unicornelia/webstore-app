import { useState, useEffect } from 'react';
import '../css/Order.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/orders') // Adjust the API endpoint as needed
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  return (
    <main className="orders-container">
      {orders.length === 0 ? (
        <h1 className="no-orders">Nothing there!</h1>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h2>Order</h2>
            <h4>ref: #{order._id}</h4>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.title} className="order-item">
                  <img src={item.imageUrl} alt={item.title} className="order-item-image" />
                  <div className="order-item-info">
                    <h3>{item.title}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default Orders;
