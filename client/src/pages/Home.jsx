import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => console.error('Fetch error:', err));
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
            <div className="product-card" key={product._id}>
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
