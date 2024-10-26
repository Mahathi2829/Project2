const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
const PORT = 5001;  // Backend is running on port 5001

// Middleware
app.use(cors());  // Allows requests from different origins (e.g., your frontend at port 3000)
app.use(bodyParser.json());  // Parses incoming JSON data

// PostgreSQL Pool (Connect to your mahathigarapati database)
const pool = new Pool({
  user: 'postgres',       // Your PostgreSQL username
  host: 'localhost',      // Hostname (localhost for local development)
  database: 'mahathigarapati',  // Change the database to 'mahathigarapati'
  password: '2004', // Your PostgreSQL password
  port: 5433,             // PostgreSQL port (change if using a different port)
});

// Verify PostgreSQL connection when server starts
(async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(-1); // Exit process if connection fails
  }
})();

// ROUTES

// 1. GET: Fetch all products
app.get('/products', async (req, res) => {
  try {
    console.log('Fetching products...');
    const result = await pool.query('SELECT * FROM products');
    console.log('Products fetched:', result.rows);
    res.json(result.rows);  // Return the list of products
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

// 2. POST: Add a new product
app.post('/products', async (req, res) => {
  const { name, description, price, quantity } = req.body;

  // Validate input fields
  if (!name || !description || !price || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Adding new product:', req.body);
    const result = await pool.query(
      'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, quantity]
    );
    console.log('Product added:', result.rows[0]);
    res.status(201).json(result.rows[0]);  // Send the newly created product as response
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ error: 'Server error while adding product' });
  }
});

// 3. PUT: Edit an existing product
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  // Validate input
  if (!name || !description || !price || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log(`Updating product with ID: ${id}`);
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
      [name, description, price, quantity, id]
    );
    
    if (result.rowCount === 0) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product updated:', result.rows[0]);
    res.json(result.rows[0]);  // Return the updated product
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

// 4. DELETE: Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Deleting product with ID: ${id}`);
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product deleted successfully');
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
