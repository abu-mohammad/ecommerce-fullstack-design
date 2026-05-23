import { Link } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Admin Navbar
  if (user && user.isAdmin) {
    return (
      <nav style={styles.nav}>
        <Link to="/admin" style={styles.logo}>ShopEasy Admin</Link>
        <div style={styles.links}>
          <span style={styles.username}>{user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
    );
  }

  // Regular User Navbar
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>ShopEasy</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.cartLink}>
          Cart
          {cart.length > 0 && (
            <span style={styles.cartBadge}>{cart.length}</span>
          )}
        </Link>
        {user ? (
          <>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            <div style={styles.userMenu}>
              <span style={styles.username}>{user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    padding: '15px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  links: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  cartLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ff4444',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  username: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '15px',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '6px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  registerBtn: {
    backgroundColor: 'white',
    color: '#1a73e8',
    padding: '8px 20px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  }
};

export default Navbar;