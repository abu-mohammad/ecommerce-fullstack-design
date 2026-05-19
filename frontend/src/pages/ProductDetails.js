import { useParams, Link } from 'react-router-dom';

const products = [
  { id: 1, name: "Wireless Headphones", price: 29.99, category: "Electronics", description: "High quality wireless headphones with noise cancellation and 20hr battery life." },
  { id: 2, name: "Running Shoes", price: 49.99, category: "Sports", description: "Lightweight and comfortable running shoes perfect for daily training." },
  { id: 3, name: "Coffee Mug", price: 19.99, category: "Kitchen", description: "Large ceramic coffee mug that keeps your drink warm for hours." },
  { id: 4, name: "Laptop Bag", price: 39.99, category: "Electronics", description: "Waterproof laptop bag with multiple compartments fits up to 15 inch laptops." },
  { id: 5, name: "Yoga Mat", price: 24.99, category: "Sports", description: "Non-slip yoga mat with carrying strap, perfect for home or gym workouts." },
  { id: 6, name: "Water Bottle", price: 14.99, category: "Kitchen", description: "Stainless steel water bottle keeps drinks cold for 24hrs and hot for 12hrs." },
];

function ProductDetails() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

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

      {/* Back Button */}
      <Link to="/products" style={{ color: '#333', textDecoration: 'none' }}>
        ← Back to Products
      </Link>

      {/* Product Details */}
      <div style={styles.container}>
        <img
          src="https://via.placeholder.com/350"
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <p style={{ color: '#888', marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ marginBottom: '15px' }}>{product.name}</h1>
          <p style={{ color: '#4CAF50', fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
            ${product.price}
          </p>
          <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '25px' }}>
            {product.description}
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