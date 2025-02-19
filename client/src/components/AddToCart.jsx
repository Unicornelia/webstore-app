const AddToCart = ({ productId }) => {
  const handleAddToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <button className="btn" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

export default AddToCart;
