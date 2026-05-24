import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API = 'https://ecommerce-fullstack-design-production-98f8.up.railway.app';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 3)));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to ShopEasy</h1>
          <p style={styles.heroSubtitle}>
            Discover amazing products at unbeatable prices
          </p>
          <div style={styles.heroBtns}>
            <Link to="/products" style={styles.primaryBtn}>
              Shop Now
            </Link>
            <Link to="/register" style={styles.secondaryBtn}>
              Join Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.featuresWrapper}>
        <div className="features-grid">
          {[
            { title: 'Free Delivery', desc: 'On orders over $50' },
            { title: 'Secure Payment', desc: '100% secure transactions' },
            { title: 'Easy Returns', desc: '30 day return policy' },
            { title: '24/7 Support', desc: 'Always here to help' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <h3 style={{ margin: '10px 0 5px', color: '#1a73e8' }}>{f.title}</h3>
              <p style={{ color: '#888', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" style={styles.viewAll}>View All</Link>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div className="card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div className="card-content">
                <span className="category-badge">{product.category}</span>
                <h3 style={{ margin: '8px 0', fontSize: '16px' }}>{product.name}</h3>
                <p className="price">${product.price}</p>
                <Link to={`/product/${product._id}`} className="card-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Section */}
      <div style={styles.banner}>
        <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '10px' }}>
          Special Offer!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', fontSize: '16px' }}>
          Get 20% off on your first order. Use code: WELCOME20
        </p>
        <Link to="/products" style={styles.bannerBtn}>
          Shop Now
        </Link>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 ShopEasy. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    padding: '100px 40px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heroTitle: {
    color: 'white',
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '15px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '18px',
    marginBottom: '35px',
  },
  heroBtns: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: 'white',
    color: '#1a73e8',
    padding: '14px 35px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '14px 35px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    border: '2px solid white',
  },
  featuresWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  featureCard: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f0f4f8',
  },
  section: {
    padding: '50px 40px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
  },
  viewAll: {
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
  },
  banner: {
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    padding: '60px 40px',
    textAlign: 'center',
    margin: '0 40px 40px',
    borderRadius: '20px',
  },
  bannerBtn: {
    backgroundColor: 'white',
    color: '#1a73e8',
    padding: '12px 35px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
  }
};

export default Home;