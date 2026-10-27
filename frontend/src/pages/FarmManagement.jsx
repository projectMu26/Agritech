import React, { useState, useEffect } from 'react';
import { getFarms, createFarm, deleteFarm, updateFarm } from '../services/api';
import { MapPin, Plus, Trash2, Edit3, Droplet, Layers, AlertCircle, CheckCircle } from 'lucide-react';

const FarmManagement = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const initialForm = {
    name: '',
    city: '',
    state: '',
    address: '',
    totalArea: '',
    soilType: 'alluvial',
    irrigationType: 'drip',
    establishedYear: new Date().getFullYear(),
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const { data } = await getFarms();
      setFarms(data.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to load farms', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleOpenAdd = () => {
    setEditingFarmId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (farm) => {
    setEditingFarmId(farm._id);
    setFormData({
      name: farm.name,
      city: farm.location?.city || '',
      state: farm.location?.state || '',
      address: farm.location?.address || '',
      totalArea: farm.totalArea,
      soilType: farm.soilType || 'alluvial',
      irrigationType: farm.irrigationType || 'drip',
      establishedYear: farm.establishedYear || 2020,
      notes: farm.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this farm profile? All related crops will also be removed.')) {
      try {
        await deleteFarm(id);
        setMessage({ text: 'Farm profile removed successfully', type: 'success' });
        loadFarms();
      } catch (err) {
        setMessage({ text: err.response?.data?.message || 'Delete failed', type: 'danger' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        location: {
          city: formData.city,
          state: formData.state,
          address: formData.address,
        },
        totalArea: Number(formData.totalArea),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        establishedYear: Number(formData.establishedYear),
        notes: formData.notes,
      };

      if (editingFarmId) {
        await updateFarm(editingFarmId, payload);
        setMessage({ text: 'Farm profile updated successfully!', type: 'success' });
      } else {
        await createFarm(payload);
        setMessage({ text: 'New farm profile registered successfully!', type: 'success' });
      }

      setShowModal(false);
      loadFarms();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Operation failed', type: 'danger' });
    }
  };

  const totalAcreage = farms.reduce((sum, f) => sum + (f.totalArea || 0), 0);

  return (
    <div className="container py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold brand-font mb-1">Farm Profile Setup & Land Management</h2>
          <p className="text-muted small mb-0">
            Maintain agricultural parcels, soil categorizations, and irrigation infrastructure.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-agri d-flex align-items-center gap-2 shadow-sm">
          <Plus size={18} /> Register New Farm Parcel
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 small`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="agri-card p-3 border-start border-4 border-success">
            <span className="text-muted small fw-semibold">Total Registered Parcels</span>
            <h3 className="fw-bold mb-0 brand-font">{farms.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="agri-card p-3 border-start border-4 border-primary">
            <span className="text-muted small fw-semibold">Cumulative Area (Acres)</span>
            <h3 className="fw-bold mb-0 brand-font">{totalAcreage.toFixed(1)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="agri-card p-3 border-start border-4 border-warning">
            <span className="text-muted small fw-semibold">Dominant Irrigation Method</span>
            <h3 className="fw-bold mb-0 brand-font text-capitalize">
              {farms[0]?.irrigationType || 'Drip Irrigation'}
            </h3>
          </div>
        </div>
      </div>

      {/* Farms List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <MapPin size={48} className="text-muted opacity-50 mb-3" />
          <h5 className="fw-bold">No Farm Parcels Registered</h5>
          <p className="small mb-3">Begin by registering your first farm land or orchard holding.</p>
          <button onClick={handleOpenAdd} className="btn btn-agri btn-sm">
            + Register Farm Now
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="agri-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0 brand-font">{farm.name}</h5>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                      {farm.totalArea} Acres
                    </span>
                  </div>

                  <p className="text-muted small d-flex align-items-center gap-1 mb-3">
                    <MapPin size={14} className="text-danger" />
                    {farm.location?.city}, {farm.location?.state || 'India'}
                  </p>

                  <div className="p-3 bg-light rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary d-flex align-items-center gap-1">
                        <Layers size={14} /> Soil Type:
                      </span>
                      <strong className="text-capitalize text-dark">{farm.soilType}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary d-flex align-items-center gap-1">
                        <Droplet size={14} /> Irrigation:
                      </span>
                      <strong className="text-capitalize text-dark">{farm.irrigationType}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Established:</span>
                      <strong className="text-dark">{farm.establishedYear || 2020}</strong>
                    </div>
                  </div>

                  {farm.notes && (
                    <p className="text-muted small fst-italic mb-3">"{farm.notes}"</p>
                  )}
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <button
                    onClick={() => handleOpenEdit(farm)}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(farm._id)}
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit Farm */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  {editingFarmId ? 'Edit Farm Profile' : 'Register New Farm Holding'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Farm Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Green Valley Farm"
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">City / District</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Ludhiana"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Punjab"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Total Area (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.totalArea}
                        onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                        placeholder="10.5"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Established Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.establishedYear}
                        onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Soil Type</label>
                      <select
                        className="form-select"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      >
                        <option value="alluvial">Alluvial Soil</option>
                        <option value="loam">Loamy Soil</option>
                        <option value="black">Black / Regur Soil</option>
                        <option value="clay">Clay Soil</option>
                        <option value="red">Red / Laterite Soil</option>
                        <option value="sandy">Sandy Soil</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Irrigation Method</label>
                      <select
                        className="form-select"
                        value={formData.irrigationType}
                        onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                      >
                        <option value="drip">Drip Irrigation</option>
                        <option value="sprinkler">Sprinkler System</option>
                        <option value="canal">Canal Network</option>
                        <option value="borewell">Borewell & Tubewell</option>
                        <option value="rainfed">Rainfed / Monsoon</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Field Notes / Observations</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Laser leveled, organic rotation, etc."
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    {editingFarmId ? 'Save Changes' : 'Save Farm Profile'}
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

export default FarmManagement;
