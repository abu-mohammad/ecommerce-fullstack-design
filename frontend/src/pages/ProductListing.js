import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: "Wireless Headphones", price: 29.99, category: "Electronics" },
  { id: 2, name: "Running Shoes", price: 49.99, category: "Sports" },
  { id: 3, name: "Coffee Mug", price: 19.99, category: "Kitchen" },
  { id: 4, name: "Laptop Bag", price: 39.99, category: "Electronics" },
  { id: 5, name: "Yoga Mat", price: 24.99, category: "Sports" },
  { id: 6, name: "Water Bottle", price: 14.99, category: "Kitchen" },
];

function ProductListing() {
  return (
    <div style={{ padding: '30px' }}>
      <h1>All Products</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        {products.length} products found
      </p>

      <div className="products-grid">
        {products.map(product => (
          <div className="card" key={product.id}>
            <img
              src="https://via.placeholder.com/200"
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>{product.category}</p>
            <p className="price">${product.price}</p>
            <Link to={`/product/${product.id}`} className="card-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListing;