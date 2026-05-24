import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API = 'https://ecommerce-fullstack-design-production-98f8.up.railway.app';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    const res = await fetch(`${API}/api/products/${id}`);
    const data = await res.json();
    setProduct(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const res = await fetch(`${API}/api/reviews/${id}`);
    const data = await res.json();
    setReviews(data);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find(item => item._id === product._id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      setAdded(true);
      toast.success('Product added to cart!');
      setTimeout(() => setAdded(false), 2000);
    } else {
      toast.warning('Already in cart!');
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error('Please login to write a review!');
      return;
    }
    if (!comment) {
      toast.error('Please write a comment!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment,
          userName: user.name
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Review added!');
        setComment('');
        setRating(5);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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

          {/* Rating Summary */}
          <div style={styles.ratingRow}>
            <span style={{ color: '#f59e0b', fontSize: '20px' }}>
              {renderStars(Math.round(avgRating))}
            </span>
            <span style={{ color: '#888', marginLeft: '10px' }}>
              {avgRating} ({reviews.length} reviews)
            </span>
          </div>

          <p style={styles.price}>${product.price}</p>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockBox}>
            {product.stock > 0 ? (
              <p style={{ color: '#4CAF50', fontWeight: '600' }}>
                In Stock ({product.stock} available)
              </p>
            ) : (
              <p style={{ color: 'red', fontWeight: '600' }}>Out of Stock</p>
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
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={styles.cartBtn}>
              View Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>Customer Reviews</h2>

        {/* Add Review Form */}
        {user && !user.isAdmin && (
          <div style={styles.reviewForm}>
            <h3 style={{ marginBottom: '15px' }}>Write a Review</h3>

            {/* Star Rating */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ marginBottom: '8px', fontWeight: '600' }}>Your Rating:</p>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: '30px',
                      cursor: 'pointer',
                      color: star <= rating ? '#f59e0b' : '#ddd',
                      transition: 'color 0.2s'
                    }}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Write your review here..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={styles.textarea}
            />
            <button
              onClick={handleReviewSubmit}
              disabled={submitting}
              style={styles.submitBtn}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div style={styles.noReviews}>
            <p style={{ color: '#888' }}>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewAvatar}>
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '600' }}>{review.userName}</p>
                  <p style={{ color: '#888', fontSize: '12px' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ color: '#f59e0b', fontSize: '18px', marginLeft: 'auto' }}>
                  {renderStars(review.rating)}
                </span>
              </div>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{review.comment}</p>
            </div>
          ))
        )}
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
    flexWrap: 'wrap',
  },
  imageBox: {
    flex: 1,
    minWidth: '280px',
  },
  image: {
    width: '100%',
    borderRadius: '15px',
    objectFit: 'cover',
    height: '400px',
  },
  info: {
    flex: 1,
    minWidth: '280px',
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '10px 0',
    color: '#333',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
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
  },
  reviewsSection: {
    marginTop: '40px',
  },
  reviewsTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#333',
  },
  reviewForm: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '25px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #e8f0fe',
    fontSize: '15px',
    height: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: '15px',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '25px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  noReviews: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '15px',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  reviewAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#1a73e8',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0,
  },
};

export default ProductDetails;