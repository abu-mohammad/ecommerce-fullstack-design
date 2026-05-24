import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart() {
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item._id === id) {
        const newQty = (item.quantity || 1) + change;
        if (newQty < 1) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart!');
  };

  const totalPrice = cart.reduce((total, item) =>
    total + (item.price * (item.quantity || 1)), 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login first!');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setOrdering(true);
    try {
      const response = await fetch(
        'https://ecommerce-fullstack-design-production-98f8.up.railway.app/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            products: cart.map(item => ({
              product: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity || 1
            })),
            totalPrice: totalPrice
          })
        });

      if (response.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        toast.success('Order placed successfully!');
        setTimeout(() => navigate('/orders'), 1500);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
    setOrdering(false);
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Your Cart</h1>
        <div style={styles.emptyCart}>
          <p style={{ fontSize: '60px' }}>🛒</p>
          <h2>Your cart is empty!</h2>
          <p style={{ color: '#888', margin: '10px 0 20px 0' }}>
            Looks like you haven't added anything yet.
          </p>
          <Link to="/products" style={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Your Cart</h1>

      {cart.map(item => (
        <div key={item._id} style={styles.cartItem}>
          <img src={item.image} alt={item.name} style={styles.image} />
          <div style={styles.itemInfo}>
            <h3>{item.name}</h3>
            <p style={{ color: '#888' }}>{item.category}</p>
            <p style={{ color: '#1a73e8', fontWeight: 'bold', fontSize: '18px' }}>
              ${(item.price * (item.quantity || 1)).toFixed(2)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div style={styles.quantityBox}>
            <button
              onClick={() => updateQuantity(item._id, -1)}
              style={styles.qtyBtn}>
              −
            </button>
            <span style={styles.qtyNum}>{item.quantity || 1}</span>
            <button
              onClick={() => updateQuantity(item._id, 1)}
              style={styles.qtyBtn}>
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            style={styles.removeBtn}>
            Remove
          </button>
        </div>
      ))}

      <div style={styles.total}>
        <p style={{ color: '#888', marginBottom: '5px' }}>
          {cart.reduce((t, i) => t + (i.quantity || 1), 0)} items
        </p>
        <h2>Total: ${totalPrice.toFixed(2)}</h2>
        <button
          onClick={handleCheckout}
          style={styles.checkoutBtn}
          disabled={ordering}>
          {ordering ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  emptyCart: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  shopButton: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    display: 'inline-block',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  itemInfo: { flex: 1, minWidth: '150px' },
  quantityBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f0f4f8',
    borderRadius: '8px',
    padding: '5px 10px',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#1a73e8',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '25px',
    textAlign: 'center',
  },
  removeBtn: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  total: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'right',
  },
  checkoutBtn: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

export default Cart;