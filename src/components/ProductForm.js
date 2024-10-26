import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData }) => {
  const [product, setProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [message, setMessage] = useState(''); // For success or error messages

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Clear the success message after 3 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000); // 3000 ms = 3 seconds

      // Cleanup timer when the component is unmounted or if message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Make sure onSubmit returns a promise
    onSubmit(product)
      .then(() => {
        setMessage('Product submitted successfully!');
        setProduct({ name: '', description: '', price: '', quantity: '' });
      })
      .catch((error) => {
        setMessage(`Error submitting product: ${error.message}`);
      });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            step="0.01"
            min="0"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={product.quantity}
            min="0"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default ProductForm;
