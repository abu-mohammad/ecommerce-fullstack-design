import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const closeMenu = () => setMenuOpen(false);

  // Admin Navbar
  if (user && user.isAdmin) {
    return (
      <nav style={styles.nav}>
        <Link to="/admin" style={styles.logo}>ShopEasy Admin</Link>
        <div style={styles.desktopLinks}>
          <span style={styles.username}>{user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
    );
  }

  // Regular User Navbar
  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>ShopEasy</Link>

      {/* Hamburger Button - Mobile Only */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop Links */}
      <div style={styles.desktopLinks}>
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
            <span style={styles.username}>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={closeMenu}>Home</Link>
          <Link to="/products" style={styles.mobileLink} onClick={closeMenu}>Products</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={closeMenu}>
            Cart {cart.length > 0 && `(${cart.length})`}
          </Link>
          {user ? (
            <>
              <Link to="/orders" style={styles.mobileLink} onClick={closeMenu}>My Orders</Link>
              <span style={styles.mobileUsername}>{user.name}</span>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={closeMenu}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      )}
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
    flexWrap: 'wrap',
  },
  logo: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  hamburger: {
    display: 'none',
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    fontSize: '20px',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block',
    }
  },
  desktopLinks: {
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
  },
  mobileMenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '15px 0',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    marginTop: '10px',
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  mobileUsername: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '15px',
    padding: '8px 0',
  },
  mobileLogoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    width: '100%',
    textAlign: 'center',
  }
};

export default Navbar;