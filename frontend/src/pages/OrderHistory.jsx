import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import { ShoppingBag, Truck, Package, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await getMyOrders();
        setOrders(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container py-4 my-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold brand-font mb-1">My Agricultural Orders & Deliveries</h2>
          <p className="text-muted small mb-0">Track farm inputs, delivery timelines, and invoices.</p>
        </div>
        <Link to="/marketplace" className="btn btn-outline-agri btn-sm">
          + Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <ShoppingBag size={48} className="opacity-50 mb-3" />
          <h5 className="fw-bold">No Orders Placed Yet</h5>
          <p className="small mb-3">You haven't ordered any seeds, fertilizers, or tools yet.</p>
          <Link to="/marketplace" className="btn btn-agri btn-sm">
            Visit Agri Store
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="agri-card p-4 bg-white border">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-3 border-bottom">
                <div>
                  <span className="badge bg-light text-dark border me-2">ID: {order._id.slice(-8).toUpperCase()}</span>
                  <small className="text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-success'
                        : order.orderStatus === 'Dispatched'
                        ? 'bg-info'
                        : 'bg-primary'
                    } px-3 py-1`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="badge bg-light text-secondary border">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="row g-3 align-items-center mb-3">
                <div className="col-lg-8">
                  <div className="d-flex flex-column gap-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center small p-2 bg-light rounded-2">
                        <div>
                          <strong>{item.name}</strong>
                          <span className="text-muted ms-2">x {item.quantity} {item.unit || 'unit'}</span>
                        </div>
                        <span className="fw-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-4 border-start-lg ps-lg-4">
                  <span className="text-muted small d-block">Delivery Address:</span>
                  <p className="small text-dark mb-2">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold">Total Paid:</span>
                    <span className="fs-5 fw-extrabold text-success">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
