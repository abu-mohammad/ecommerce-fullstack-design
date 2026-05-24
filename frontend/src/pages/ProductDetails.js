import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find(item => item._id === product._id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      setAdded(true);
      toast.success('Product added to cart!');
      setTimeout(() => setAdded(false), 2000);
    } else {
      toast.warning('Already in cart!');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <p style={{ color: '#1a73e8', fontSize: '18px' }}>Loading product...</p>
      </div>
    );
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
    <div style={styles.container}>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadLink}>Home</Link> →
        <Link to="/products" style={styles.breadLink}> Products</Link> →
        <span style={{ color: '#333' }}> {product.name}</span>
      </div>

      {/* Product Details */}
      <div style={styles.productBox}>
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>
        <div style={styles.info}>
          <span className="category-badge">{product.category}</span>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>${product.price}</p>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockBox}>
            {product.stock > 0 ? (
              <p style={{ color: '#4CAF50', fontWeight: '600' }}>
                ✅ In Stock ({product.stock} available)
              </p>
            ) : (
              <p style={{ color: 'red', fontWeight: '600' }}>❌ Out of Stock</p>
            )}
          </div>

          <div style={styles.btnGroup}>
            <button
              onClick={handleAddToCart}
              style={{
                ...styles.addBtn,
                backgroundColor: added ? '#4CAF50' : '#1a73e8'
              }}
              disabled={product.stock === 0}>
              {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={styles.cartBtn}>
              View Cart →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  breadcrumb: {
    marginBottom: '20px',
    fontSize: '14px',
    color: '#888',
  },
  breadLink: {
    color: '#1a73e8',
    textDecoration: 'none',
  },
  productBox: {
    display: 'flex',
    gap: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  imageBox: {
    flex: 1,
  },
  image: {
    width: '100%',
    borderRadius: '15px',
    objectFit: 'cover',
    height: '400px',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '10px 0',
    color: '#333',
  },
  price: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1a73e8',
    margin: '15px 0',
  },
  description: {
    color: '#666',
    lineHeight: '1.8',
    fontSize: '15px',
    marginBottom: '20px',
  },
  stockBox: {
    padding: '12px 20px',
    backgroundColor: '#f0f4f8',
    borderRadius: '10px',
    marginBottom: '25px',
  },
  btnGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  addBtn: {
    color: 'white',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.3s',
  },
  cartBtn: {
    backgroundColor: 'white',
    color: '#1a73e8',
    padding: '14px 30px',
    border: '2px solid #1a73e8',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  }
};

export default ProductDetails;