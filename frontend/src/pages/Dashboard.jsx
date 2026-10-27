import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFarms, getCrops, getWeather } from '../services/api';
import {
  Sprout,
  MapPin,
  CloudSun,
  Activity,
  Bug,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Droplet,
  Wind,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, cropsRes, weatherRes] = await Promise.allSettled([
          getFarms(),
          getCrops(),
          getWeather(user?.location?.region || 'Punjab'),
        ]);

        if (farmsRes.status === 'fulfilled') setFarms(farmsRes.value.data.data || []);
        if (cropsRes.status === 'fulfilled') setCrops(cropsRes.value.data.data || []);
        if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value.data);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const totalAcreage = farms.reduce((acc, f) => acc + (f.totalArea || 0), 0);
  const healthyCropsCount = crops.filter((c) => c.healthStatus === 'Excellent' || c.healthStatus === 'Good').length;
  const warningCropsCount = crops.filter((c) => c.healthStatus === 'Warning' || c.healthStatus === 'Critical').length;

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-success my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 my-2">
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 p-4 rounded-4 bg-white border shadow-sm">
        <div>
          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mb-2">
            🌱 Farmer Command Center
          </span>
          <h2 className="fw-bold brand-font mb-1">
            {t('dashboard.welcome')} {user?.name}!
          </h2>
          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
            <MapPin size={14} className="text-danger" />
            <span>
              {user?.location?.region ? `${user?.location?.region}, ` : ''}
              {user?.location?.state || 'India'}
            </span>
            &bull;
            <span>Role: <strong className="text-capitalize text-success">{user?.role}</strong></span>
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/crops" className="btn btn-outline-agri btn-sm d-flex align-items-center gap-1">
            <PlusCircle size={16} /> {t('dashboard.addCropBtn')}
          </Link>
          <Link to="/farms" className="btn btn-agri btn-sm d-flex align-items-center gap-1 shadow-sm">
            <PlusCircle size={16} /> {t('dashboard.addFarmBtn')}
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="agri-card p-3 border-start border-4 border-success h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">{t('dashboard.activeFarms')}</span>
              <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                <MapPin size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 brand-font">{farms.length}</h3>
            <small className="text-muted">Registered profiles</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 border-start border-4 border-primary h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">{t('dashboard.totalAcreage')}</span>
              <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-circle">
                <TrendingUp size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 brand-font">{totalAcreage.toFixed(1)}</h3>
            <small className="text-muted">Acres under management</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 border-start border-4 border-warning h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">{t('dashboard.cropsMonitored')}</span>
              <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle">
                <Sprout size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 brand-font">{crops.length}</h3>
            <small className="text-muted">
              <span className="text-success fw-bold">{healthyCropsCount} optimal</span>
              {warningCropsCount > 0 && <span className="text-danger fw-bold ms-1">&bull; {warningCropsCount} alert</span>}
            </small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="agri-card p-3 border-start border-4 border-info h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small fw-semibold">{t('dashboard.weatherCondition')}</span>
              <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
                <CloudSun size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 brand-font">
              {weather?.current?.temperature || 28}&deg;C
            </h3>
            <small className="text-muted">{weather?.current?.condition || 'Clear & Sunny'}</small>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Left Column: Live Agro-Weather & Advisory */}
        <div className="col-lg-6">
          <div className="agri-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <CloudSun className="text-warning" size={22} />
                Live Farm Microclimate & Radar
              </h5>
              <Link to="/weather" className="text-success small fw-bold text-decoration-none">
                Detailed Forecast &rarr;
              </Link>
            </div>

            {weather?.current ? (
              <div>
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light mb-3">
                  <div>
                    <h2 className="display-6 fw-bold mb-0 brand-font">
                      {weather.current.temperature}&deg;C
                    </h2>
                    <span className="text-muted small">Feels like {weather.current.feelsLike}&deg;C &bull; {weather.current.condition}</span>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 mb-1 d-block">
                      {weather.current.city}
                    </span>
                    <small className="text-muted d-block">Updated live</small>
                  </div>
                </div>

                <div className="row g-2 text-center mb-3">
                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white">
                      <div className="d-flex align-items-center justify-content-center gap-1 text-primary small mb-1">
                        <Droplet size={14} /> Humidity
                      </div>
                      <span className="fw-bold">{weather.current.humidity}%</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white">
                      <div className="d-flex align-items-center justify-content-center gap-1 text-secondary small mb-1">
                        <Wind size={14} /> Wind Speed
                      </div>
                      <span className="fw-bold">{weather.current.windSpeed} km/h</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 border rounded-2 bg-white">
                      <div className="d-flex align-items-center justify-content-center gap-1 text-success small mb-1">
                        <Activity size={14} /> Spray Suitability
                      </div>
                      <span className="fw-bold text-success">{weather.agroAdvisory?.spraySuitability || 'Ideal'}</span>
                    </div>
                  </div>
                </div>

                <div className="alert alert-success bg-opacity-10 border-success border-opacity-25 d-flex align-items-start gap-2 mb-0 py-2">
                  <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                  <small className="text-dark leading-normal">
                    <strong>Agro Advisory: </strong>
                    {weather.agroAdvisory?.advisoryMessage || 'Conditions are favorable for farm operations and nutrient applications.'}
                  </small>
                </div>
              </div>
            ) : (
              <p className="text-muted small">Weather telemetry currently synchronizing...</p>
            )}
          </div>
        </div>

        {/* Right Column: Crop Health & Soil Overview */}
        <div className="col-lg-6">
          <div className="agri-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Sprout className="text-success" size={22} />
                Monitored Crops Health & Stages
              </h5>
              <Link to="/crops" className="text-success small fw-bold text-decoration-none">
                Manage Crops &rarr;
              </Link>
            </div>

            {crops.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {crops.slice(0, 3).map((crop) => (
                  <div key={crop._id} className="p-3 border rounded-3 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-0">{crop.cropName} ({crop.variety})</h6>
                        <small className="text-muted">
                          {crop.farm?.name || 'Registered Farm'} &bull; {crop.areaPlanted} Acres
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

                    <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                      <span>Growth Stage: <strong className="text-dark">{crop.stage}</strong></span>
                      <span>Soil pH: <strong className="text-dark">{crop.soilMetrics?.ph || 6.8}</strong></span>
                      <span>Moisture: <strong className="text-dark">{crop.soilMetrics?.moisture || 45}%</strong></span>
                    </div>

                    {crop.recommendations && crop.recommendations.length > 0 && (
                      <div className="p-2 rounded bg-light small text-secondary">
                        <strong className="text-dark">Latest Recommendation: </strong>
                        {crop.recommendations[0]?.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <Sprout size={36} className="text-muted opacity-50 mb-2" />
                <p className="small mb-3">No active crops registered yet.</p>
                <Link to="/crops" className="btn btn-outline-agri btn-sm">
                  + Add First Crop
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h5 className="fw-bold brand-font mb-3">Quick Agricultural Workflows</h5>
      <div className="row g-3">
        <div className="col-md-3 col-sm-6">
          <Link to="/marketplace" className="agri-card p-3 d-flex align-items-center gap-3 text-decoration-none text-dark h-100">
            <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">Agri Supplies Store</h6>
              <small className="text-muted">Order hybrid seeds & bio-inputs</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3 col-sm-6">
          <Link to="/consultations" className="agri-card p-3 d-flex align-items-center gap-3 text-decoration-none text-dark h-100">
            <div className="p-3 bg-info bg-opacity-10 text-info rounded-circle">
              <Activity size={22} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">Book Agronomist</h6>
              <small className="text-muted">Schedule 1-on-1 scientific advisory</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3 col-sm-6">
          <Link to="/forum" className="agri-card p-3 d-flex align-items-center gap-3 text-decoration-none text-dark h-100">
            <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
              <MessageSquare size={22} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">Kisan Community</h6>
              <small className="text-muted">Exchange tips with local growers</small>
            </div>
          </Link>
        </div>

        <div className="col-md-3 col-sm-6">
          <Link to="/orders" className="agri-card p-3 d-flex align-items-center gap-3 text-decoration-none text-dark h-100">
            <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
              <TrendingUp size={22} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">Order History</h6>
              <small className="text-muted">Track deliveries & invoices</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
