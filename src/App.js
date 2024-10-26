import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(''); // State for delete message

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Clear the delete message after 3 seconds
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage('');
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (product) => {
    try {
      if (editIndex !== null) {
        const productId = products[editIndex].id;
        const response = await fetch(`http://localhost:5001/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProduct = await response.json();
        const updatedProducts = products.filter((_, index) => index !== editIndex);
        setProducts([...updatedProducts, updatedProduct]);

        setEditIndex(null);
        setCurrentProduct(null);
      } else {
        const response = await fetch('http://localhost:5001/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error('Failed to add product');
        }

        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
 

  const handleEdit = (index) => {
    setCurrentProduct(products[index]);
    setEditIndex(index);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/products/${id}`, {
        method: 'DELETE',
      });
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setDeleteMessage('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      setDeleteMessage('Error deleting product');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-4">Product Management</h1>
      <ProductForm onSubmit={handleAddProduct} initialData={currentProduct} />
      {deleteMessage && <div className="alert alert-warning mt-3">{deleteMessage}</div>}
      <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default App;
