import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../css/Checkout.css';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState(0);
  const [stripeSessionID, setStripeSessionID] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/checkout', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setCheckoutItems(data.checkoutItems);
        setTotal(data.totalSum);
        setStripeSessionID(data.stripeSessionID);
      })
      .catch((e) => console.error(`Fetch error in checkout: ${e}`));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setError('Stripe is not loaded yet');
      setLoading(false);
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setError(null);
    }
    setLoading(false);
  };

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>
      <div>
        <ul className="cart__item-list">
          {checkoutItems
            ? checkoutItems.map((item) => (
                <li key={item.product._id} className="cart__item">
                  <h1>{item.product.title}</h1>
                  <img
                    style={{ width: '15%' }}
                    src={item.product.imageUrl}
                    alt={item.product.title}
                  />
                  <p>Quantity: {item.quantity}</p>
                  <h4>{item.product.price * item.quantity} €</h4>
                </li>
              ))
            : null}
        </ul>
        <h3>Total sum: {total} €</h3>
      </div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <button
          id="order-btn"
          type="submit"
          onClick={() =>
            stripe.redirectToCheckout({
              sessionId: stripeSessionID,
            })
          }
          className="checkout__btn"
          disabled={!stripe || loading}
        >
          Pay Now
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Payment successful!</p>}
    </main>
  );
};

export default Checkout;
