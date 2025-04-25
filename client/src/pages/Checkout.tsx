import { FC, FormEvent, useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import '../css/Checkout.css';
import { Item } from '../types';

const Checkout: FC = () => {
  const stripe: Stripe | null = useStripe();
  const elements: StripeElements | null = useElements();
  const [error, setError] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [checkoutItems, setCheckoutItems] = useState<Item[] | null>(null);
  const [stripeSessionID, setStripeSessionID] = useState<string>('');

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      setError('Stripe is not loaded yet');
      setLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (cardElement) {
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setError(null);
      }

      setLoading(false);
    }
  };

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>
      <div>
        <ul className="cart__item-list">
          {checkoutItems
            ? checkoutItems.map((item: Item) => (
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
            stripe?.redirectToCheckout({
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
