import React, { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  getResources,
  createResource,
  deleteResource
} from '../services/api';
import {
  Shield,
  Users,
  TrendingUp,
  Package,
  Activity,
  Trash2,
  Edit2,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'inventory'
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const initialResourceForm = {
    name: '',
    category: 'fertilizers',
    price: '',
    unit: '50 kg bag',
    stock: 50,
    description: '',
    manufacturer: 'AgriTech Agro Inputs',
    isOrganic: false,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
  };

  const [resourceForm, setResourceForm] = useState(initialResourceForm);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, resourcesRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getResources({}),
      ]);
      setStats(statsRes.data.stats || {});
      setUsers(usersRes.data.data || []);
      setResources(resourcesRes.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error fetching admin records', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateAdminUserRole(userId, { role: newRole });
      setMessage({ text: `User role updated to ${newRole}`, type: 'success' });
      loadData();
    } catch (err) {
      setMessage({ text: 'Failed to update user role', type: 'danger' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user from the system?')) {
      try {
        await deleteAdminUser(userId);
        setMessage({ text: 'User account removed successfully', type: 'success' });
        loadData();
      } catch (err) {
        setMessage({ text: err.response?.data?.message || 'Delete user failed', type: 'danger' });
      }
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await createResource({
        ...resourceForm,
        price: Number(resourceForm.price),
        stock: Number(resourceForm.stock),
      });
      setMessage({ text: 'New product added to Agri Store!', type: 'success' });
      setShowAddResourceModal(false);
      setResourceForm(initialResourceForm);
      loadData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to add product', type: 'danger' });
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Delete this product from catalog?')) {
      try {
        await deleteResource(resourceId);
        setMessage({ text: 'Product removed from store', type: 'success' });
        loadData();
      } catch (err) {
        setMessage({ text: 'Delete failed', type: 'danger' });
      }
    }
  };

  return (
    <div className="container py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-1 rounded-pill mb-1">
            System Administration
          </span>
          <h2 className="fw-bold brand-font mb-1">AgriTech Master Control Panel</h2>
          <p className="text-muted small mb-0">
            System overview, role-based authorization, user governance, and catalog inventory.
          </p>
        </div>

        <button
          onClick={() => setShowAddResourceModal(true)}
          className="btn btn-agri d-flex align-items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Catalog Product
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 small`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* High-level system statistics cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 border-start border-4 border-success">
            <span className="text-muted small fw-semibold">Total Users</span>
            <h3 className="fw-bold mb-0 brand-font">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 border-start border-4 border-primary">
            <span className="text-muted small fw-semibold">Farms Monitored</span>
            <h3 className="fw-bold mb-0 brand-font">{stats?.totalFarms || 0}</h3>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 border-start border-4 border-warning">
            <span className="text-muted small fw-semibold">Orders Processed</span>
            <h3 className="fw-bold mb-0 brand-font">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 border-start border-4 border-info">
            <span className="text-muted small fw-semibold">Gross Agri Revenue</span>
            <h3 className="fw-bold mb-0 brand-font text-success">₹{stats?.totalRevenue || 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 border">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'users' ? 'active bg-success' : 'text-dark'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} className="me-2 inline" />
            User Roles & Access ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'inventory' ? 'active bg-success' : 'text-dark'}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={16} className="me-2 inline" />
            Marketplace Catalog ({resources.length})
          </button>
        </li>
      </ul>

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="agri-card p-4 bg-white border">
          <h5 className="fw-bold brand-font mb-3">Registered Users Management</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatar}
                          alt="avatar"
                          className="rounded-circle"
                          style={{ width: 34, height: 34, objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="d-block text-dark">{u.name}</strong>
                          <small className="text-muted">{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      {u.location?.region ? `${u.location.region}, ` : ''}
                      {u.location?.state || 'India'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'bg-danger'
                            : u.role === 'expert'
                            ? 'bg-primary'
                            : 'bg-success'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{ width: 120 }}
                      >
                        <option value="farmer">Farmer</option>
                        <option value="expert">Expert</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Catalog Management */}
      {activeTab === 'inventory' && (
        <div className="agri-card p-4 bg-white border">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold brand-font mb-0">Agri Store Catalog Products</h5>
            <button onClick={() => setShowAddResourceModal(true)} className="btn btn-sm btn-agri">
              + New Product
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Stock</th>
                  <th>Organic</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-2"
                          style={{ width: 40, height: 40, objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="d-block">{item.name}</strong>
                          <small className="text-muted">{item.manufacturer}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="fw-bold text-success">₹{item.price}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span className={`fw-bold ${item.stock < 20 ? 'text-danger' : 'text-dark'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td>
                      {item.isOrganic ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-light text-muted border">No</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteResource(item._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Resource */}
      {showAddResourceModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Add Agricultural Product to Store</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddResourceModal(false)}></button>
              </div>
              <form onSubmit={handleAddResource}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={resourceForm.name}
                        onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={resourceForm.category}
                        onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                      >
                        <option value="seeds">Seeds</option>
                        <option value="fertilizers">Fertilizers</option>
                        <option value="pesticides">Bio-Pesticides</option>
                        <option value="tools">Farming Tools</option>
                        <option value="irrigation">Irrigation / Drip</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={resourceForm.price}
                        onChange={(e) => setResourceForm({ ...resourceForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Packaging Unit</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 50 kg bag, 1 Litre"
                        value={resourceForm.unit}
                        onChange={(e) => setResourceForm({ ...resourceForm, unit: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={resourceForm.stock}
                        onChange={(e) => setResourceForm({ ...resourceForm, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Manufacturer / Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={resourceForm.manufacturer}
                        onChange={(e) => setResourceForm({ ...resourceForm, manufacturer: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={resourceForm.image}
                        onChange={(e) => setResourceForm({ ...resourceForm, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={resourceForm.description}
                        onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="adminOrganic"
                          checked={resourceForm.isOrganic}
                          onChange={(e) => setResourceForm({ ...resourceForm, isOrganic: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="adminOrganic">
                          Certified 100% Organic Input
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddResourceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    Publish Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
