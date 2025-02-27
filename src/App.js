import React, { useState, useEffect, useCallback } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Use the API URL from environment variables or fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  


  

  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);


const fetchProducts = useCallback(async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    setProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}, [API_URL]); // Depend on API_URL only
useEffect(() => {
  fetchProducts();
}, [fetchProducts]); // Add fetchProducts to the dependency array


  const handleAddProduct = async (product) => {
    try {
      if (editIndex !== null) {
        // Update product in the database
        const productId = products[editIndex].id;
        const response = await fetch(`${API_URL}/products/${productId}`, {
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

        // Update the product in the list
        const updatedProducts = products.map((p, index) =>
          index === editIndex ? updatedProduct : p
        );
        setProducts(updatedProducts);

        // Reset form state
        setEditIndex(null);
        setCurrentProduct(null);
      } else {
        // Add a new product if not in edit mode
        const response = await fetch(`${API_URL}/products`, {
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
      await fetch(`${API_URL}/products/${id}`, {
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
