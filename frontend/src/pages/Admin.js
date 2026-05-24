import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API = 'https://ecommerce-fullstack-design-production-98f8.up.railway.app';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '',
    category: '', stock: '', image: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !user.isAdmin) navigate('/');
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    await fetchProducts();
    await fetchUsers();
    await fetchOrders();
    setLoading(false);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setOrders(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const res = await fetch(`${API}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      toast.success('Product added!');
      setFormData({ name: '', price: '', description: '', category: '', stock: '', image: '' });
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      image: product.image
    });
    setActiveTab('addProduct');
  };

  const handleUpdate = async () => {
    const res = await fetch(`${API}/api/products/${editProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      toast.success('Product updated!');
      setEditProduct(null);
      setFormData({ name: '', price: '', description: '', category: '', stock: '', image: '' });
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success('Product deleted!');
      fetchProducts();
    }
  };

  const handleOrderStatus = async (id, status) => {
    const res = await fetch(`${API}/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      toast.success('Order status updated!');
      fetchOrders();
    }
  };

  if (loading) return <h2 style={{ padding: '30px' }}>Loading...</h2>;

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '20px' }}>Admin Panel</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['dashboard', 'addProduct', 'products', 'users', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setEditProduct(null); }}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab ? '#1a73e8' : '#333'
            }}>
            {tab === 'dashboard' ? 'Dashboard' :
             tab === 'addProduct' ? 'Add Product' :
             tab === 'products' ? 'Products' :
             tab === 'users' ? 'Users' : 'Orders'}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2 style={{ color: '#1a73e8', fontSize: '36px' }}>{products.length}</h2>
            <p style={{ color: '#888' }}>Total Products</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ color: '#4CAF50', fontSize: '36px' }}>{users.length}</h2>
            <p style={{ color: '#888' }}>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ color: '#FF9800', fontSize: '36px' }}>{orders.length}</h2>
            <p style={{ color: '#888' }}>Total Orders</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ color: '#f44336', fontSize: '36px' }}>
              ${orders.reduce((t, o) => t + o.totalPrice, 0).toFixed(2)}
            </h2>
            <p style={{ color: '#888' }}>Total Revenue</p>
          </div>
        </div>
      )}

      {/* Add/Edit Product */}
      {activeTab === 'addProduct' && (
        <div style={styles.formBox}>
          <h2 style={{ marginBottom: '20px' }}>
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <input name="name" placeholder="Product Name"
            value={formData.name} onChange={handleChange} style={styles.input} />
          <input name="price" placeholder="Price" type="number"
            value={formData.price} onChange={handleChange} style={styles.input} />
          <input name="category" placeholder="Category"
            value={formData.category} onChange={handleChange} style={styles.input} />
          <input name="stock" placeholder="Stock" type="number"
            value={formData.stock} onChange={handleChange} style={styles.input} />
          <input name="image" placeholder="Image URL"
            value={formData.image} onChange={handleChange} style={styles.input} />
          {formData.image && (
            <img src={formData.image} alt="preview"
              style={{ width: '150px', borderRadius: '8px', marginBottom: '15px' }} />
          )}
          <textarea name="description" placeholder="Description"
            value={formData.description} onChange={handleChange}
            style={{ ...styles.input, height: '80px' }} />
          <button
            onClick={editProduct ? handleUpdate : handleAdd}
            style={styles.addBtn}>
            {editProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      )}

      {/* Products Table */}
      {activeTab === 'products' && (
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: 'white' }}>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={styles.td}>
                  <img src={product.image} alt={product.name}
                    style={{ width: '50px', borderRadius: '5px' }} />
                </td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>${product.price}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.stock}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(product)}
                    style={{ ...styles.deleteBtn, backgroundColor: '#1a73e8', marginRight: '10px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)}
                    style={styles.deleteBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: 'white' }}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={{
                    backgroundColor: u.isAdmin ? '#1a73e8' : '#4CAF50',
                    color: 'white', padding: '4px 10px', borderRadius: '20px'
                  }}>
                    {u.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '15px' }}>
              No orders yet!
            </div>
          ) : orders.map(order => (
            <div key={order._id} style={styles.orderCard}>

              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order #{order._id.slice(-6)}
                  </p>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold' }}>
                    Customer: {order.user?.name || 'Unknown'}
                  </p>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    {order.user?.email || ''}
                  </p>
                </div>
                <span style={{
                  backgroundColor:
                    order.status === 'delivered' ? '#4CAF50' :
                    order.status === 'processing' ? '#1a73e8' :
                    order.status === 'cancelled' ? '#f44336' : '#FF9800',
                  color: 'white',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontWeight: '600',
                }}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                  style={styles.statusSelect}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Ordered Products */}
              <div style={styles.orderProducts}>
                {order.products.map((item, index) => (
                  <div key={index} style={styles.orderProduct}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.orderProductImg}
                    />
                    <div>
                      <p style={{ fontWeight: '600' }}>{item.name}</p>
                      <p style={{ color: '#1a73e8' }}>${item.price}</p>
                      {item.quantity && (
                        <p style={{ color: '#888', fontSize: '13px' }}>
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div style={styles.orderTotal}>
                <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a73e8' }}>
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
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
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  th: { padding: '15px', textAlign: 'left' },
  td: { padding: '15px' },
  deleteBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  orderProducts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '15px',
  },
  orderProduct: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f0f4f8',
    padding: '10px',
    borderRadius: '10px',
  },
  orderProductImg: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  orderTotal: {
    textAlign: 'right',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  statusSelect: {
    padding: '8px',
    borderRadius: '8px',
    border: '2px solid #e8f0fe',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Admin;