import { FC, useEffect, useState } from 'react';
import '../css/Order.css';
import { Order, Product } from '../types';

const Orders: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/orders', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  if (!orders) {
    return <h1>Loading...</h1>;
  }

  return (
    <main className="orders-container">
      {orders.length === 0 ? (
        <h1 className="no-orders">No orders here!</h1>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h2>Order</h2>
            <h4>ref: #{order._id}</h4>
            <div className="order-items">
              {order.products.map((product) => (
                <div key={product.product.title} className="order-item">
                  <img
                    src={product.product.imageUrl}
                    alt={product.product.title}
                    className="order-item-image"
                  />
                  <div className="order-item-info">
                    <h3>{product.product.title}</h3>
                    <p>Quantity: {product.quantity}</p>
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
