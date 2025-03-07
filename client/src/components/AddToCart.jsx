const AddToCart = ({ productId, csrfToken }) => {
  const handleAddToCart = async () => {
    try {
      const response  = await fetch('http://localhost:3001/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'CSRF-TOKEN': csrfToken},
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add product: ${productId}`);
      }

      alert('Product added to cart!');
    } catch (error) {
      console.error(`Error adding to cart: ${error}`);
    }
  };

  return (
    <button className="btn" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

export default AddToCart;
