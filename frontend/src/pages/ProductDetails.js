import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2 style={{ padding: '30px' }}>Loading product...</h2>;
  }

  if (!product) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2>Product not found!</h2>
        <Link to="/products" className="card-button">Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>

      <Link to="/products" style={{ color: '#333', textDecoration: 'none' }}>
        ← Back to Products
      </Link>

      <div style={styles.container}>
        <img
          src={product.image}
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <p style={{ color: '#888', marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ marginBottom: '15px' }}>{product.name}</h1>
          <p style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
            ${product.price}
          </p>
          <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '15px' }}>
            {product.description}
          </p>
          <p style={{ color: '#888', marginBottom: '25px' }}>
            Stock: {product.stock} items available
          </p>
          <button style={styles.addButton}>
            🛒 Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '40px',
    marginTop: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '350px',
    borderRadius: '10px',
  },
  info: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    width: '100%',
  }
};

export default ProductDetails;