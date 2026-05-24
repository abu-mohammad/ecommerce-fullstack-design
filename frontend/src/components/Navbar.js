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

  if (user && user.isAdmin) {
    return (
      <nav className="navbar">
        <Link to="/admin" className="nav-logo">ShopEasy Admin</Link>
        <div className="nav-links">
          <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <span className="nav-username">{user.name}</span>
          <button onClick={handleLogout} className="nav-logout">Logout</button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">ShopEasy</Link>

      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop Links */}
      <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
        <Link to="/cart" className="nav-cart" onClick={closeMenu}>
          Cart
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/orders" className="nav-link" onClick={closeMenu}>My Orders</Link>
            <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            <span className="nav-username">{user.name}</span>
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="nav-register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: 'white',
    color: '#1a73e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
  }
};

export default Navbar;