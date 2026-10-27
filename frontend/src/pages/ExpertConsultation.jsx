import React, { useState, useEffect } from 'react';
import {
  getMyConsultations,
  getAllConsultations,
  requestConsultation,
  updateConsultation
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Calendar,
  Video,
  Phone,
  Clock,
  CheckCircle,
  Plus,
  FileText,
  UserCheck,
  Award
} from 'lucide-react';

const ExpertConsultation = () => {
  const { user, isExpert, isAdmin } = useAuth();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [advisoryNoteInput, setAdvisoryNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState('Completed');
  const [message, setMessage] = useState({ text: '', type: '' });

  const initialBookForm = {
    expertType: 'Agronomist',
    cropConcerned: 'Wheat',
    topic: 'Yellow rust prevention and micro-nutrient foliar spray',
    description: '',
    preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredTimeSlot: '11:00 AM - 01:00 PM',
    consultationMode: 'Video Call',
  };

  const [formData, setFormData] = useState(initialBookForm);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const res = isExpert || isAdmin ? await getAllConsultations() : await getMyConsultations();
      setConsultations(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [user, isExpert, isAdmin]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestConsultation(formData);
      setMessage({ text: 'Consultation session booked successfully!', type: 'success' });
      setShowBookModal(false);
      loadConsultations();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Booking failed', type: 'danger' });
    }
  };

  const handleUpdateConsultation = async (e) => {
    e.preventDefault();
    try {
      await updateConsultation(selectedConsult._id, {
        status: statusInput,
        advisoryNotes: advisoryNoteInput,
        assignedExpertName: user.name,
      });
      setMessage({ text: 'Advisory notes and status updated!', type: 'success' });
      setShowUpdateModal(false);
      loadConsultations();
    } catch (err) {
      setMessage({ text: 'Update failed', type: 'danger' });
    }
  };

  return (
    <div className="container py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1 rounded-pill mb-1">
            ICAR & SAU Certified Agronomy Desk
          </span>
          <h2 className="fw-bold brand-font mb-1">Expert Agricultural Consultations</h2>
          <p className="text-muted small mb-0">
            Get personalized agronomic guidance from university researchers, plant pathologists, and soil chemists.
          </p>
        </div>

        <button onClick={() => setShowBookModal(true)} className="btn btn-agri d-flex align-items-center gap-2 shadow-sm">
          <Plus size={18} /> Book Expert Advisory
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show py-2 small`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Expert Panel Showcase Banner */}
      <div className="agri-card p-4 mb-4 bg-white border">
        <h5 className="fw-bold brand-font mb-3 d-flex align-items-center gap-2">
          <Award size={20} className="text-warning" />
          Featured Agricultural Specialists Available Online
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Dr. Sunita"
                className="rounded-circle"
                style={{ width: 50, height: 50, objectFit: 'cover' }}
              />
              <div>
                <strong className="d-block text-dark">Dr. Sunita Deshmukh</strong>
                <small className="text-primary d-block">Senior Soil Scientist</small>
                <small className="text-muted">Ph.D. IARI (16+ yrs experience)</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Dr. Ramesh"
                className="rounded-circle"
                style={{ width: 50, height: 50, objectFit: 'cover' }}
              />
              <div>
                <strong className="d-block text-dark">Dr. Ramesh Sharma</strong>
                <small className="text-success d-block">Chief Agronomist</small>
                <small className="text-muted">PAU Ludhiana (Wheat & Paddy specialist)</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Dr. Alok"
                className="rounded-circle"
                style={{ width: 50, height: 50, objectFit: 'cover' }}
              />
              <div>
                <strong className="d-block text-dark">Dr. Alok Verma</strong>
                <small className="text-danger d-block">Plant Pathologist</small>
                <small className="text-muted">Bio-Pesticide & Disease Specialist</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <h5 className="fw-bold brand-font mb-3">
        {isExpert || isAdmin ? 'All Farmer Consultation Bookings' : 'My Booked Consultation Sessions'}
      </h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : consultations.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <Users size={48} className="opacity-50 mb-3" />
          <h5 className="fw-bold">No Consultations Scheduled</h5>
          <p className="small mb-3">Book your first session with an agronomist or soil scientist.</p>
          <button onClick={() => setShowBookModal(true)} className="btn btn-agri btn-sm">
            Book Session Now
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {consultations.map((c) => (
            <div key={c._id} className="col-lg-6">
              <div className="agri-card p-4 h-100 bg-white border d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-bold me-2">
                        {c.expertType}
                      </span>
                      <span className="badge bg-light text-secondary border">
                        {c.consultationMode}
                      </span>
                    </div>
                    <span
                      className={`badge ${
                        c.status === 'Completed'
                          ? 'bg-success'
                          : c.status === 'In Progress'
                          ? 'bg-warning text-dark'
                          : 'bg-info'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h5 className="fw-bold brand-font text-dark mb-1">{c.topic}</h5>
                  <p className="text-muted small mb-2">
                    Crop: <strong>{c.cropConcerned}</strong> &bull; Assigned: <strong>{c.assignedExpertName}</strong>
                  </p>
                  <p className="small text-secondary mb-3">{c.description}</p>

                  <div className="p-2 bg-light rounded-2 small mb-3 d-flex align-items-center justify-content-between">
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={14} className="text-success" />
                      {new Date(c.preferredDate).toLocaleDateString()}
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={14} className="text-primary" />
                      {c.preferredTimeSlot}
                    </span>
                  </div>

                  {c.advisoryNotes && (
                    <div className="p-3 bg-success bg-opacity-10 rounded-3 small border border-success border-opacity-25">
                      <strong className="text-success d-block mb-1">
                        🌿 Expert Agronomic Prescription:
                      </strong>
                      <span className="text-dark">{c.advisoryNotes}</span>
                    </div>
                  )}
                </div>

                {(isExpert || isAdmin) && (
                  <div className="border-top pt-3 mt-3 d-flex justify-content-end">
                    <button
                      onClick={() => {
                        setSelectedConsult(c);
                        setAdvisoryNoteInput(c.advisoryNotes || '');
                        setStatusInput(c.status || 'Completed');
                        setShowUpdateModal(true);
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Update Advisory Notes & Status
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Book Session */}
      {showBookModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Book 1-on-1 Agronomist Consultation</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBookModal(false)}></button>
              </div>
              <form onSubmit={handleBookSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Specialist Domain</label>
                      <select
                        className="form-select"
                        value={formData.expertType}
                        onChange={(e) => setFormData({ ...formData, expertType: e.target.value })}
                      >
                        <option value="Agronomist">Agronomist (Crop Management)</option>
                        <option value="Soil Scientist">Soil Scientist (Fertility & pH)</option>
                        <option value="Plant Pathologist">Plant Pathologist (Fungi & Diseases)</option>
                        <option value="Organic Farming Specialist">Organic Farming Specialist</option>
                        <option value="Irrigation Engineer">Irrigation & Water Engineer</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Concerned</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Basmati Rice, Tomato"
                        value={formData.cropConcerned}
                        onChange={(e) => setFormData({ ...formData, cropConcerned: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Advisory Topic</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Blossom end rot management and foliar calcium spray"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Problem Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Provide details about symptoms, soil condition, previous spray, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Preferred Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Time Slot</label>
                      <select
                        className="form-select"
                        value={formData.preferredTimeSlot}
                        onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                      >
                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Mode</label>
                      <select
                        className="form-select"
                        value={formData.consultationMode}
                        onChange={(e) => setFormData({ ...formData, consultationMode: e.target.value })}
                      >
                        <option value="Video Call">Video Call</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Chat / In-App Advisory">Chat / In-App Advisory</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowBookModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Expert Update */}
      {showUpdateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Update Agronomic Advisory</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowUpdateModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateConsultation}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Session Status</label>
                    <select
                      className="form-select"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Prescribed Advisory Notes</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={advisoryNoteInput}
                      onChange={(e) => setAdvisoryNoteInput(e.target.value)}
                      placeholder="Input dosage, fertilizer amendments, or spray guidance for the farmer..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowUpdateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Advisory
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

export default ExpertConsultation;
