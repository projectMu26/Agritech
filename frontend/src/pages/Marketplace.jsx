import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources, createOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Check,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Truck
} from 'lucide-react';

const Marketplace = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);

  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: 'Main Farm Gate, Sector 4',
    city: user?.location?.region || 'Ludhiana',
    state: user?.location?.state || 'Punjab',
    postalCode: '141001',
    contactNumber: user?.phone || '+91 98765 43210',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (Kisan Pay)');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data } = await getResources({
        category: category !== 'all' ? category : undefined,
        search: search || undefined,
        isOrganic: isOrganic ? 'true' : undefined,
      });
      setResources(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category, isOrganic]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or use 1-click demo access to complete your order.');
      navigate('/login');
      return;
    }

    try {
      setCheckoutLoading(true);
      const itemsPayload = cart.map((i) => ({
        resourceId: i._id,
        quantity: i.quantity,
      }));

      await createOrder({
        items: itemsPayload,
        shippingAddress,
        paymentMethod,
      });

      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => {
        setShowCart(false);
        setOrderSuccess(false);
        navigate('/orders');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="container py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold brand-font mb-1">AgriTech Marketplace & Farm Supplies</h2>
          <p className="text-muted small mb-0">
            Certified seeds, biofertilizers, organic repellents, and precision micro-drip kits.
          </p>
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="btn btn-agri d-flex align-items-center gap-2 position-relative shadow-sm"
        >
          <ShoppingCart size={18} />
          <span>Kisan Cart</span>
          {cart.length > 0 && (
            <span className="badge bg-warning text-dark rounded-pill ms-1">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 mb-4 bg-white border">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6">
            <div className="d-flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'seeds', label: 'Seeds' },
                { id: 'fertilizers', label: 'Fertilizers' },
                { id: 'pesticides', label: 'Bio-Protection' },
                { id: 'irrigation', label: 'Drip Systems' },
                { id: 'tools', label: 'Smart Tools' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`btn btn-sm ${
                    category === cat.id ? 'btn-success fw-bold' : 'btn-light border text-secondary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search seed varieties, NPK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-agri btn-sm">
                <Search size={15} />
              </button>
            </form>
          </div>

          <div className="col-lg-2">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="organicSwitch"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="organicSwitch">
                🌿 100% Organic
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <ShoppingBag size={48} className="text-muted opacity-50 mb-3" />
          <h5 className="fw-bold">No Products Found</h5>
          <p className="small mb-0">Try changing your search keywords or filter category.</p>
        </div>
      ) : (
        <div className="row g-4">
          {resources.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <div className="agri-card h-100 d-flex flex-column justify-content-between overflow-hidden">
                <div>
                  <div className="position-relative" style={{ height: 180, overflow: 'hidden' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    {item.isOrganic && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success shadow-sm">
                        🌿 100% Organic
                      </span>
                    )}
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">{item.manufacturer}</small>
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={14} fill="#eab308" />
                        <span className="fw-bold">{item.rating}</span>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-1 brand-font">{item.name}</h5>
                    <p className="text-muted small leading-normal mb-3" style={{ minHeight: 40 }}>
                      {item.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs-4 fw-extrabold text-success">₹{item.price}</span>
                        <small className="text-muted"> / {item.unit}</small>
                      </div>
                      <small className="text-secondary">
                        Stock: <strong>{item.stock}</strong>
                      </small>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-top bg-light">
                  <button
                    onClick={() => addToCart(item)}
                    className="btn btn-agri w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Offcanvas / Modal */}
      {showCart && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <ShoppingCart size={20} /> Kisan Shopping Cart
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCart(false)}></button>
              </div>

              <div className="modal-body p-4">
                {orderSuccess ? (
                  <div className="text-center py-4 text-success">
                    <Check size={48} className="mb-2" />
                    <h4 className="fw-bold">Order Confirmed!</h4>
                    <p className="small text-muted">Directing to your order tracking page...</p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <ShoppingCart size={40} className="opacity-50 mb-2" />
                    <p>Your cart is empty. Add fertilizers, seeds, or tools.</p>
                  </div>
                ) : (
                  <div>
                    {/* Items table */}
                    <div className="table-responsive mb-3">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={item._id}>
                              <td>
                                <strong className="d-block">{item.name}</strong>
                                <small className="text-muted">{item.unit}</small>
                              </td>
                              <td>₹{item.price}</td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item._id, -1)}
                                    className="btn btn-sm btn-outline-secondary py-0 px-2"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="fw-bold">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item._id, 1)}
                                    className="btn btn-sm btn-outline-secondary py-0 px-2"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="fw-bold">₹{item.price * item.quantity}</td>
                              <td>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="btn btn-sm text-danger"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between p-3 bg-light rounded-3 mb-4">
                      <h5 className="mb-0 fw-bold">Total Order Amount:</h5>
                      <h4 className="mb-0 fw-bold text-success">₹{cartTotal}</h4>
                    </div>

                    {/* Shipping Address & Payment Form */}
                    <form onSubmit={handleCheckout}>
                      <h6 className="fw-bold brand-font mb-2 d-flex align-items-center gap-1">
                        <Truck size={16} className="text-success" /> Delivery Address & Kisan Pay
                      </h6>

                      <div className="row g-2 mb-3">
                        <div className="col-12">
                          <label className="form-label small">Farm / Village Address</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small">District / City</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small">State</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-4">
                          <label className="form-label small">Pincode</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Payment Option</label>
                        <select
                          className="form-select form-select-sm"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="Cash on Delivery (Kisan Pay)">Cash on Delivery (Kisan Pay)</option>
                          <option value="UPI / Net Banking">UPI / Google Pay / PhonePe</option>
                          <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                          <option value="Credit/Debit Card">Credit / Debit Card</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={checkoutLoading}
                        className="btn btn-agri w-100 py-2 fw-bold"
                      >
                        {checkoutLoading ? 'Processing Order...' : `Confirm & Place Order (₹${cartTotal})`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
