import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Product.css';

const AddOrEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const editing = !!productId;

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    if (editing) {
      fetch(`http://localhost:3001/products/${productId}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title || '',
            imageUrl: data.imageUrl || '',
            price: data.price || '',
            description: data.description || '',
          });
        })
        .catch((err) => console.error('Error fetching product:', err));
    }
  }, [editing, productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editing ? `http://localhost:3001/admin/edit-product` : 'http://localhost:3001/admin/add-product';
    const method = editing ? 'POST' : 'POST';
    let responseBody = editing ? { ...formData, id: productId } : formData;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseBody),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      navigate('/admin/products'); // Redirect after submission
    } catch (error) {
      console.error('Error submitting product:', error);
    }

    navigate('/admin/products'); // Redirect after submission
  };

  return (
    <main>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form-control">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="product-form-control">
          <label htmlFor="imageUrl">Image URL</label>
          <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </div>
        <div className="product-form-control">
          <label htmlFor="price">Price</label>
          <input type="number" name="price" id="price" step="0.01" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="product-form-control">
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" rows="5" value={formData.description} onChange={handleChange} required />
        </div>

        <button className="btn" type="submit">
          {editing ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </main>
  );
};

export default AddOrEditProduct;
