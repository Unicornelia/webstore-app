import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Product.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    await fetch('/api/admin/delete-product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });

    setProducts(products.filter((product) => product.id !== productId));
  };

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
                <Link to={`/admin/edit-product/${product.id}`} className="btn">
                  Edit
                </Link>
                <button className="btn danger" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
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

export default AdminProducts;
