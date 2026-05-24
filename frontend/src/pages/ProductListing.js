import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#1a73e8', marginTop: '15px' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>All Products</h1>
        <p style={{ color: '#888' }}>{filtered.length} products found</p>
      </div>

      {/* Search & Filter */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.catBtn,
                backgroundColor: category === cat ? '#1a73e8' : 'white',
                color: category === cat ? 'white' : '#333',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={styles.noProducts}>
          <p style={{ fontSize: '50px' }}>🔍</p>
          <h3>No products found!</h3>
          <p style={{ color: '#888' }}>Try a different search or category</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <div className="card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div className="card-content">
                <span className="category-badge">{product.category}</span>
                <h3 style={{ margin: '8px 0', fontSize: '16px' }}>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '10px' }}>
                  {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                </p>
                <Link to={`/product/${product._id}`} className="card-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '25px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
  },
  filterBar: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '30px',
    border: '2px solid #e8f0fe',
    fontSize: '15px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  categories: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '2px solid #e8f0fe',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  noProducts: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '15px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '100px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e8f0fe',
    borderTop: '5px solid #1a73e8',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 1s linear infinite',
  }
};

export default ProductListing;