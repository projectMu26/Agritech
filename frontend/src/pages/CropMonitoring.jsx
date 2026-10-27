import React, { useState, useEffect } from 'react';
import { getCrops, getFarms, createCrop, updateCrop, deleteCrop } from '../services/api';
import {
  Sprout,
  Plus,
  Activity,
  Droplet,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FlaskConical,
  Edit
} from 'lucide-react';

const CropMonitoring = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const initialCropForm = {
    farmId: '',
    cropName: 'Wheat',
    variety: '',
    areaPlanted: '',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    stage: 'Vegetative',
    healthStatus: 'Good',
    soilMetrics: {
      ph: 6.8,
      moisture: 45,
      nitrogen: 120,
      phosphorus: 35,
      potassium: 180,
      organicCarbon: 0.75,
    },
    notes: '',
  };

  const [formData, setFormData] = useState(initialCropForm);
  const [soilUpdateData, setSoilUpdateData] = useState({
    ph: 6.8,
    moisture: 45,
    nitrogen: 120,
    phosphorus: 35,
    potassium: 180,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cropsRes, farmsRes] = await Promise.all([getCrops(), getFarms()]);
      const fetchedCrops = cropsRes.data.data || [];
      setCrops(fetchedCrops);
      setFarms(farmsRes.data.data || []);
      if (fetchedCrops.length > 0 && !selectedCrop) {
        setSelectedCrop(fetchedCrops[0]);
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error loading crops & soil reports', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    if (!formData.farmId) {
      setMessage({ text: 'Please select a registered farm parcel', type: 'danger' });
      return;
    }

    try {
      await createCrop(formData);
      setMessage({ text: 'Crop season registered successfully!', type: 'success' });
      setShowAddModal(false);
      loadData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to add crop', type: 'danger' });
    }
  };

  const handleOpenSoilUpdate = (crop) => {
    setSelectedCrop(crop);
    setSoilUpdateData({
      ph: crop.soilMetrics?.ph || 6.8,
      moisture: crop.soilMetrics?.moisture || 45,
      nitrogen: crop.soilMetrics?.nitrogen || 120,
      phosphorus: crop.soilMetrics?.phosphorus || 35,
      potassium: crop.soilMetrics?.potassium || 180,
    });
    setShowSoilModal(true);
  };

  const handleUpdateSoilMetrics = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateCrop(selectedCrop._id, {
        soilMetrics: soilUpdateData,
      });
      setMessage({ text: 'Soil parameters updated and re-analyzed!', type: 'success' });
      setShowSoilModal(false);
      setSelectedCrop(data.data);
      loadData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', type: 'danger' });
    }
  };

  const handleStageChange = async (cropId, newStage) => {
    try {
      const { data } = await updateCrop(cropId, { stage: newStage });
      setMessage({ text: `Growth stage updated to ${newStage}`, type: 'success' });
      if (selectedCrop?._id === cropId) setSelectedCrop(data.data);
      loadData();
    } catch (err) {
      setMessage({ text: 'Failed to update stage', type: 'danger' });
    }
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm('Delete this crop monitoring record?')) {
      try {
        await deleteCrop(id);
        setMessage({ text: 'Crop record deleted', type: 'success' });
        setSelectedCrop(null);
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
          <h2 className="fw-bold brand-font mb-1">Crop Phenology & Soil Health Analysis</h2>
          <p className="text-muted small mb-0">
            Real-time NPK telemetry, moisture balancing, and agronomic prescriptions.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...initialCropForm, farmId: farms[0]?._id || '' });
            setShowAddModal(true);
          }}
          className="btn btn-agri d-flex align-items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Register Crop Season
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 small`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : crops.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <Sprout size={48} className="text-muted opacity-50 mb-3" />
          <h5 className="fw-bold">No Crops Under Active Monitoring</h5>
          <p className="small mb-3">Add your first sowing season to track soil nutrients and stages.</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-agri btn-sm">
            + Add Crop Now
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Column: Crop List */}
          <div className="col-lg-5">
            <h5 className="fw-bold mb-3 brand-font">Monitored Crops ({crops.length})</h5>
            <div className="d-flex flex-column gap-3">
              {crops.map((crop) => {
                const isSelected = selectedCrop?._id === crop._id;
                return (
                  <div
                    key={crop._id}
                    onClick={() => setSelectedCrop(crop)}
                    className={`agri-card p-3 cursor-pointer transition ${
                      isSelected ? 'border-success border-2 shadow-sm bg-success bg-opacity-10' : 'bg-white'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="fw-bold mb-0 brand-font text-dark">{crop.cropName}</h5>
                        <small className="text-muted">
                          {crop.variety} &bull; {crop.areaPlanted} Acres
                        </small>
                      </div>
                      <span
                        className={`badge ${
                          crop.healthStatus === 'Excellent'
                            ? 'bg-success'
                            : crop.healthStatus === 'Good'
                            ? 'bg-primary'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {crop.healthStatus}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center small text-secondary mt-2">
                      <span>Farm: <strong>{crop.farm?.name || 'Local Farm'}</strong></span>
                      <span>Stage: <strong className="text-dark">{crop.stage}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: In-depth Diagnostics of Selected Crop */}
          {selectedCrop && (
            <div className="col-lg-7">
              <div className="agri-card p-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3 pb-3 border-bottom">
                  <div>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mb-1">
                      Detailed Agro Diagnostic
                    </span>
                    <h3 className="fw-bold mb-0 brand-font">
                      {selectedCrop.cropName} - {selectedCrop.variety}
                    </h3>
                    <small className="text-muted">
                      Planted on {new Date(selectedCrop.plantingDate).toLocaleDateString()} &bull;{' '}
                      {selectedCrop.areaPlanted} Acres
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleOpenSoilUpdate(selectedCrop)}
                      className="btn btn-outline-agri btn-sm d-flex align-items-center gap-1"
                    >
                      <FlaskConical size={15} /> Update Soil Test
                    </button>
                    <button
                      onClick={() => handleDeleteCrop(selectedCrop._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Stage Progression Selector */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>
                    Phenological Growth Stage:
                  </label>
                  <div className="d-flex flex-wrap gap-1">
                    {['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvested'].map((stg) => (
                      <button
                        key={stg}
                        onClick={() => handleStageChange(selectedCrop._id, stg)}
                        className={`btn btn-sm ${
                          selectedCrop.stage === stg ? 'btn-success fw-bold' : 'btn-light border text-secondary'
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soil N-P-K & Physical Parameter Telemetry */}
                <h6 className="fw-bold brand-font mb-3 d-flex align-items-center gap-2">
                  <Activity size={18} className="text-success" />
                  Soil Chemistry & Root-Zone Moisture
                </h6>

                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <span className="text-muted small d-block">Soil pH</span>
                      <h4 className={`fw-bold mb-0 ${selectedCrop.soilMetrics?.ph < 6.0 || selectedCrop.soilMetrics?.ph > 7.8 ? 'text-danger' : 'text-success'}`}>
                        {selectedCrop.soilMetrics?.ph || 6.8}
                      </h4>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {selectedCrop.soilMetrics?.ph < 6.0 ? 'Acidic' : selectedCrop.soilMetrics?.ph > 7.8 ? 'Alkaline' : 'Optimal'}
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <span className="text-muted small d-block">Moisture</span>
                      <h4 className={`fw-bold mb-0 ${selectedCrop.soilMetrics?.moisture < 35 ? 'text-warning' : 'text-primary'}`}>
                        {selectedCrop.soilMetrics?.moisture || 45}%
                      </h4>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {selectedCrop.soilMetrics?.moisture < 35 ? 'Irrigate Soon' : 'Adequate'}
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <span className="text-muted small d-block">Org. Carbon</span>
                      <h4 className="fw-bold mb-0 text-dark">
                        {selectedCrop.soilMetrics?.organicCarbon || 0.65}%
                      </h4>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Healthy Range</small>
                    </div>
                  </div>

                  {/* N-P-K Breakdown */}
                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white text-center">
                      <span className="text-muted small d-block">Nitrogen (N)</span>
                      <span className="fw-bold text-dark">{selectedCrop.soilMetrics?.nitrogen || 120} kg/ha</span>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white text-center">
                      <span className="text-muted small d-block">Phosphorus (P)</span>
                      <span className="fw-bold text-dark">{selectedCrop.soilMetrics?.phosphorus || 35} kg/ha</span>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white text-center">
                      <span className="text-muted small d-block">Potassium (K)</span>
                      <span className="fw-bold text-dark">{selectedCrop.soilMetrics?.potassium || 180} kg/ha</span>
                    </div>
                  </div>
                </div>

                {/* AI / Scientific Agronomic Recommendations */}
                <h6 className="fw-bold brand-font mb-3 d-flex align-items-center gap-2">
                  <CheckCircle size={18} className="text-primary" />
                  Prescribed Agronomic Amendments
                </h6>

                {selectedCrop.recommendations && selectedCrop.recommendations.length > 0 ? (
                  <div className="d-flex flex-column gap-2 mb-3">
                    {selectedCrop.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-3 border-start border-4 ${
                          rec.severity === 'urgent'
                            ? 'border-danger bg-danger bg-opacity-10'
                            : rec.severity === 'warning'
                            ? 'border-warning bg-warning bg-opacity-10'
                            : 'border-success bg-success bg-opacity-10'
                        }`}
                      >
                        <strong className="d-block small text-dark mb-1">{rec.category}</strong>
                        <p className="mb-0 small text-dark leading-normal">{rec.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light border small text-muted">
                    No nutrient stress detected. Continue standard agronomic schedule.
                  </div>
                )}

                {selectedCrop.notes && (
                  <div className="p-3 bg-light rounded-3 small">
                    <strong>Farmer Notes: </strong>
                    <span className="text-secondary">{selectedCrop.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Crop */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Register New Crop Season</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateCrop}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Select Farm Parcel</label>
                      <select
                        className="form-select"
                        value={formData.farmId}
                        onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                        required
                      >
                        <option value="">-- Choose Farm --</option>
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.name} ({f.totalArea} Acres - {f.location?.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                        placeholder="e.g. Wheat, Rice, Tomato, Corn"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Seed Variety</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                        placeholder="e.g. HD-2967, Pusa Basmati"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Area Planted (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.areaPlanted}
                        onChange={(e) => setFormData({ ...formData, areaPlanted: e.target.value })}
                        placeholder="e.g. 5.0"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Planting Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.plantingDate}
                        onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Growth Stage</label>
                      <select
                        className="form-select"
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      >
                        <option value="Sowing">Sowing</option>
                        <option value="Germination">Germination</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Grain Filling">Grain Filling</option>
                        <option value="Maturity">Maturity</option>
                      </select>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-2 small text-uppercase text-secondary">Initial Soil Test Telemetry</h6>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small">pH Level</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-sm"
                        value={formData.soilMetrics.ph}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            soilMetrics: { ...formData.soilMetrics, ph: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Moisture (%)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.soilMetrics.moisture}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            soilMetrics: { ...formData.soilMetrics, moisture: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Nitrogen (kg/ha)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.soilMetrics.nitrogen}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            soilMetrics: { ...formData.soilMetrics, nitrogen: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    Register Crop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Soil Test */}
      {showSoilModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Update Soil Test & Recalculate Prescriptions</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSoilModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateSoilMetrics}>
                <div className="modal-body p-4">
                  <p className="small text-muted mb-3">
                    Input current lab or probe test readings. The AgriTech engine will automatically update nutrient recommendations.
                  </p>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Soil pH ({soilUpdateData.ph})</label>
                    <input
                      type="range"
                      min="4.5"
                      max="9.0"
                      step="0.1"
                      className="form-range"
                      value={soilUpdateData.ph}
                      onChange={(e) => setSoilUpdateData({ ...soilUpdateData, ph: Number(e.target.value) })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Root-Zone Moisture: {soilUpdateData.moisture}%</label>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      step="1"
                      className="form-range"
                      value={soilUpdateData.moisture}
                      onChange={(e) => setSoilUpdateData({ ...soilUpdateData, moisture: Number(e.target.value) })}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label small">Nitrogen (N)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={soilUpdateData.nitrogen}
                        onChange={(e) => setSoilUpdateData({ ...soilUpdateData, nitrogen: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Phosphorus (P)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={soilUpdateData.phosphorus}
                        onChange={(e) => setSoilUpdateData({ ...soilUpdateData, phosphorus: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small">Potassium (K)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={soilUpdateData.potassium}
                        onChange={(e) => setSoilUpdateData({ ...soilUpdateData, potassium: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowSoilModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    Re-Analyze & Save
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

export default CropMonitoring;
