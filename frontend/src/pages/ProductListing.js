import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ padding: '30px' }}>Loading products...</h2>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>All Products</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        {products.length} products found
      </p>
      <div className="products-grid">
        {products.map(product => (
          <div className="card" key={product._id}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>{product.category}</p>
            <p className="price">${product.price}</p>
            <Link to={`/product/${product._id}`} className="card-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListing;