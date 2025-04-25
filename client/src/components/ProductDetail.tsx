import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Product.css';
import AddToCart from './AddToCart';

const ProductDetail = ({ csrfToken }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`/products/${productId}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((err) => console.error(err));
  }, [productId]);

  if (!product) {
    return <h1>Loading...</h1>;
  }

  return (
    <main className="centered">
      <h1>Product Detail</h1>
      <hr />
      <h2 className="product__title">{product.title}</h2>
      <div className="product__image">
        <img src={product.imageUrl} alt={product.title} />
      </div>
      <h3 className="product__price">EUR {product.price}</h3>
      <p className="product__description">{product.description}</p>
      {isAuthenticated && (
        <AddToCart productId={product._id} csrfToken={csrfToken} />
      )}
    </main>
  );
};

export default ProductDetail;
