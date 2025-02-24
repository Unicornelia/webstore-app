import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Product.css';
import AddToCart from '../components/AddToCart';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
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
      <AddToCart productId={product._id} />
    </main>
  );
};

export default ProductDetail;
