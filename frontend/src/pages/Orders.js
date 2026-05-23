import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // eslint-disable-next-line
useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }
  fetchOrders();
}, []);

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:5000/api/orders/myorders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  if (loading) return <h2 style={{ padding: '30px' }}>Loading orders...</h2>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🛍️ My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.emptyOrders}>
          <p style={{ fontSize: '60px' }}>🛍️</p>
          <h2>No orders yet!</h2>
          <p style={{ color: '#888', margin: '10px 0 20px 0' }}>
            You haven't placed any orders yet.
          </p>
          <Link to="/products" style={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <p style={{ color: '#888' }}>
                Order ID: <strong>#{order._id.slice(-6)}</strong>
              </p>
              <span style={{
                backgroundColor:
                  order.status === 'delivered' ? '#4CAF50' :
                  order.status === 'processing' ? '#2196F3' :
                  order.status === 'cancelled' ? '#f44336' : '#FF9800',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {order.status}
              </span>
            </div>

            {order.products.map((item, index) => (
              <div key={index} style={styles.orderItem}>
                <img src={item.image} alt={item.name} style={styles.image} />
                <div>
                  <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ color: '#4CAF50' }}>${item.price}</p>
                </div>
              </div>
            ))}

            <div style={styles.orderFooter}>
              <p style={{ color: '#888', fontSize: '14px' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                Total: ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  emptyOrders: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'inline-block',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  }
};

export default Orders;