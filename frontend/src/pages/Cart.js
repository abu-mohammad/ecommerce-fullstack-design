import { Link } from 'react-router-dom';

function Cart() {
  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🛒 Your Cart</h1>

      {/* Empty Cart Message */}
      <div style={styles.emptyCart}>
        <p style={{ fontSize: '60px' }}>🛒</p>
        <h2>Your cart is empty!</h2>
        <p style={{ color: '#888', margin: '10px 0 20px 0' }}>
          Looks like you haven't added anything yet.
        </p>
        <Link to="/products" style={styles.shopButton}>
          Start Shopping
        </Link>
      </div>

    </div>
  );
}

const styles = {
  emptyCart: {
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
  }
};

export default Cart;