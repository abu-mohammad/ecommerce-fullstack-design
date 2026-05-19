import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to ShopEasy 🛒</h1>
        <p style={styles.heroText}>Find the best products at the best prices</p>
        <Link to="/products" style={styles.heroButton}>Shop Now</Link>
      </div>

      {/* Featured Products Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>

          {/* Product Card 1 */}
          <div style={styles.card}>
            <img src="https://via.placeholder.com/200" alt="product" style={styles.cardImage}/>
            <h3>Product 1</h3>
            <p style={styles.price}>$29.99</p>
            <Link to="/product/1" style={styles.cardButton}>View Details</Link>
          </div>

          {/* Product Card 2 */}
          <div style={styles.card}>
            <img src="https://via.placeholder.com/200" alt="product" style={styles.cardImage}/>
            <h3>Product 2</h3>
            <p style={styles.price}>$49.99</p>
            <Link to="/product/2" style={styles.cardButton}>View Details</Link>
          </div>

          {/* Product Card 3 */}
          <div style={styles.card}>
            <img src="https://via.placeholder.com/200" alt="product" style={styles.cardImage}/>
            <h3>Product 3</h3>
            <p style={styles.price}>$19.99</p>
            <Link to="/product/3" style={styles.cardButton}>View Details</Link>
          </div>

        </div>
      </div>

    </div>
  );
}

const styles = {
  hero: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    padding: '80px 20px',
  },
  heroTitle: {
    fontSize: '48px',
    margin: '0 0 10px 0',
  },
  heroText: {
    fontSize: '20px',
    margin: '0 0 30px 0',
  },
  heroButton: {
    backgroundColor: 'white',
    color: '#4CAF50',
    padding: '12px 30px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  section: {
    padding: '40px 30px',
  },
  sectionTitle: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardImage: {
    width: '100%',
    borderRadius: '8px',
  },
  price: {
    color: '#4CAF50',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  cardButton: {
    backgroundColor: '#333',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '10px',
  }
};

export default Home;