import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // eslint-disable-next-line
    useEffect(() => {
        if (!user || !user.isAdmin) navigate('/');
        fetchAll();
    }, []);

    const fetchAll = async () => {
        await fetchProducts();
        await fetchUsers();
        await fetchOrders();
        setLoading(false);
    };

    const fetchProducts = async () => {
        const res = await fetch('https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products');
        const data = await res.json();
        setProducts(data);
    };

    const fetchUsers = async () => {
        const res = await fetch('https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/auth/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
    };

    const fetchOrders = async () => {
        const res = await fetch('https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        const res = await fetch('https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products', {
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
        const res = await fetch(`https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products/${editProduct._id}`, {
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
        if (true) {

            const res = await fetch(`https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Product deleted!');
                fetchProducts();
            }
        }
    };

    const handleOrderStatus = async (id, status) => {
        const res = await fetch(`https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/orders/${id}`, {
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
            <h1 style={{ marginBottom: '20px' }}>🔧 Admin Panel</h1>

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
                        <h2 style={{ color: '#4CAF50' }}>{products.length}</h2>
                        <p>Total Products</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={{ color: '#2196F3' }}>{users.length}</h2>
                        <p>Total Users</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={{ color: '#FF9800' }}>{orders.length}</h2>
                        <p>Total Orders</p>
                    </div>
                    <div style={styles.statCard}>
                        <h2 style={{ color: '#f44336' }}>
                            ${orders.reduce((t, o) => t + o.totalPrice, 0).toFixed(2)}
                        </h2>
                        <p>Total Revenue</p>
                    </div>
                </div>
            )}

            {/* Add/Edit Product */}
            {activeTab === 'addProduct' && (
                <div style={styles.formBox}>
                    <h2 style={{ marginBottom: '20px' }}>
                        {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                    </h2>
                    <input name="name" placeholder="Product Name"
                        value={formData.name} onChange={handleChange} style={styles.input} />
                    <input name="price" placeholder="Price" type="number"
                        value={formData.price} onChange={handleChange} style={styles.input} />
                    <input name="category" placeholder="Category"
                        value={formData.category} onChange={handleChange} style={styles.input} />
                    <input name="stock" placeholder="Stock" type="number"
                        value={formData.stock} onChange={handleChange} style={styles.input} />
                    <input name="image" placeholder="Image URL (paste image link here)"
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
                                        style={{ ...styles.deleteBtn, backgroundColor: '#2196F3', marginRight: '10px' }}>
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(product._id)}
                                        style={styles.deleteBtn}>
                                        🗑️ Delete
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
                                        backgroundColor: u.isAdmin ? '#4CAF50' : '#2196F3',
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

            {/* Orders Table */}
            {activeTab === 'orders' && (
                <table style={styles.table}>
                    <thead>
                        <tr style={{ backgroundColor: '#333', color: 'white' }}>
                            <th style={styles.th}>Order ID</th>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Total</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                                    No orders yet!
                                </td>
                            </tr>
                        ) : orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={styles.td}>{order._id.slice(-6)}</td>
                                <td style={styles.td}>{order.user?.name || 'Unknown'}</td>
                                <td style={styles.td}>${order.totalPrice}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        backgroundColor:
                                            order.status === 'delivered' ? '#4CAF50' :
                                                order.status === 'processing' ? '#2196F3' :
                                                    order.status === 'cancelled' ? '#f44336' : '#FF9800',
                                        color: 'white', padding: '4px 10px', borderRadius: '20px'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td style={styles.td}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                                        style={{ padding: '5px', borderRadius: '5px' }}>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
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
    th: { padding: '15px', textAlign: 'left' },
    td: { padding: '15px' },
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