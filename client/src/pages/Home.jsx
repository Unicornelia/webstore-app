import { Link } from 'react-router-dom';
import '../css/Home.css';
import { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const getRandomProducts = (products, count = 3) => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, count);
  };

  return (
    <main className="home-container">
      <section className="hero">
        <h1>Welcome to Our Store</h1>
        <p>Discover unique and high-quality products, handpicked just for you.</p>
        <Link to="/products" className="btn">Shop Now</Link>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>
        <div className="featured-products">
          {getRandomProducts(products).map((product) => (
            <div className="product-card">
              <img src={product.imageUrl} alt={product.title} />
              <h3>{product.title}</h3>
            </div>
          ))}
        </div>
        <Link to="/products" className="btn secondary">View All Products</Link>
      </section>
    </main>
  );
};

export default Home;
