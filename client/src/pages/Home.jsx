import "../css/Home.css"; // Ensure styling is included

import AddToCart from '../components/AddToCart';

const Home = ({ products }) => {
  return (
    <main>
      {products.length > 0 ? (
        <div className="grid">
          {products.map((product) => (
            <article key={product.id} className="card product-item">
              <header className="card__header">
                <h1 className="product__title">{product.title}</h1>
              </header>
              <div className="card__image">
                <img src={product.imageUrl} alt={product.title} />
              </div>
              <div className="card__content">
                <h2 className="product__price">EUR {product.price}</h2>
                <p className="product__description">{product.description}</p>
              </div>
              <div className="card__actions">
                 <AddToCart product={product} />
                <button className="btn">Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h1>No Products Found!</h1>
      )}
    </main>
  );
};

export default Home;
