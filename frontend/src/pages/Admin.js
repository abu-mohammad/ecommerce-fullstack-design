import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', category: '', stock: ''
  });

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert('Product added!');
      setFormData({ name: '', price: '', description: '', category: '', stock: '' });
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Product deleted!');
      fetchProducts();
    }
  };

  if (loading) return <h2 style={{ padding: '30px' }}>Loading...</h2>;

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '20px' }}>🔧 Admin Panel</h1>

      {/* Add Product Form */}
      <div style={styles.formBox}>
        <h2 style={{ marginBottom: '20px' }}>Add New Product</h2>
        <input name="name" placeholder="Product Name" value={formData.name}
          onChange={handleChange} style={styles.input} />
        <input name="price" placeholder="Price" type="number" value={formData.price}
          onChange={handleChange} style={styles.input} />
        <input name="category" placeholder="Category" value={formData.category}
          onChange={handleChange} style={styles.input} />
        <input name="stock" placeholder="Stock" type="number" value={formData.stock}
          onChange={handleChange} style={styles.input} />
        <textarea name="description" placeholder="Description" value={formData.description}
          onChange={handleChange} style={{ ...styles.input, height: '80px' }} />
        <button onClick={handleAdd} style={styles.addBtn}>Add Product</button>
      </div>

      {/* Products List */}
      <h2 style={{ margin: '30px 0 20px 0' }}>All Products</h2>
      <table style={styles.table}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: 'white' }}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>${product.price}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.stock}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={styles.deleteBtn}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  formBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  th: {
    padding: '15px',
    textAlign: 'left',
  },
  td: {
    padding: '15px',
  },
  deleteBtn: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Admin;