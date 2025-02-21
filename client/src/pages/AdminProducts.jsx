import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Product.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(`Error fetching products: ${err}`));
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/delete-product/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Fetch updated products list
      const updatedProducts = await fetch('http://localhost:3001/admin/products');
      const productsData = await updatedProducts.json();
      setProducts(productsData); // Update state with new product list

    } catch (err) {
      console.error(`Error deleting product: ${err}`);
    }
  };

  return (
    <main>
      {products.length > 0 ? (
        <div className="grid">
          {products.map((product) => (
            <article key={product._id} className="card product-item">
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
                <Link to={`/admin/edit-product/${product._id}`} className="btn">
                  Edit
                </Link>
                <button className="btn danger" onClick={() => handleDelete(product._id)}>
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
