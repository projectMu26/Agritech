import React, { useState, useEffect } from 'react';
import { getWeather, getPestAlerts } from '../services/api';
import {
  CloudSun,
  Search,
  Droplet,
  Wind,
  Compass,
  AlertTriangle,
  Bug,
  ShieldCheck,
  Calendar,
  Thermometer,
  Sprout,
  CheckCircle
} from 'lucide-react';

const WeatherAlerts = () => {
  const [city, setCity] = useState('Punjab');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pest Simulator state
  const [simCrop, setSimCrop] = useState('Wheat');
  const [simTemp, setSimTemp] = useState(25);
  const [simHumidity, setSimHumidity] = useState(78);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [pestLoading, setPestLoading] = useState(false);

  const fetchWeather = async (targetCity) => {
    try {
      setLoading(true);
      const { data } = await getWeather(targetCity);
      setWeatherData(data);
      if (data.current) {
        setSimTemp(data.current.temperature);
        setSimHumidity(data.current.humidity);
        triggerPestAnalysis(simCrop, data.current.temperature, data.current.humidity);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerPestAnalysis = async (crop, temp, hum) => {
    try {
      setPestLoading(true);
      const { data } = await getPestAlerts({
        cropName: crop,
        temperature: temp,
        humidity: hum,
      });
      setPestAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPestLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    triggerPestAnalysis(simCrop, simTemp, simHumidity);
  };

  return (
    <div className="container py-4 my-2">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold brand-font mb-1">Agro-Meteorology & Pest Surveillance Radar</h2>
          <p className="text-muted small mb-0">
            Real-time hyper-local climate tracking and automated pest disease forecasting.
          </p>
        </div>

        {/* City Search Form */}
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter agricultural region (e.g. Punjab, Nashik, Karnal)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-agri">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Current Weather Card */}
          <div className="agri-card p-4 mb-4 bg-white border">
            <div className="row align-items-center g-4">
              <div className="col-lg-4 border-end">
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill mb-2">
                  Live Farm Telemetry
                </span>
                <h1 className="display-4 fw-extrabold mb-0 brand-font">
                  {weatherData?.current?.temperature}&deg;C
                </h1>
                <p className="text-muted mb-2">
                  Feels like {weatherData?.current?.feelsLike}&deg;C &bull; {weatherData?.current?.condition}
                </p>
                <h5 className="fw-bold text-dark mb-0">
                  {weatherData?.current?.city}, {weatherData?.current?.country}
                </h5>
                <small className="text-secondary">{weatherData?.current?.description}</small>
              </div>

              <div className="col-lg-8">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <div className="d-flex align-items-center justify-content-center text-primary mb-1">
                        <Droplet size={18} />
                      </div>
                      <span className="text-muted small d-block">Humidity</span>
                      <h5 className="fw-bold mb-0">{weatherData?.current?.humidity}%</h5>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <div className="d-flex align-items-center justify-content-center text-secondary mb-1">
                        <Wind size={18} />
                      </div>
                      <span className="text-muted small d-block">Wind Speed</span>
                      <h5 className="fw-bold mb-0">{weatherData?.current?.windSpeed} km/h</h5>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <div className="d-flex align-items-center justify-content-center text-success mb-1">
                        <CheckCircle size={18} />
                      </div>
                      <span className="text-muted small d-block">Spray Suitability</span>
                      <h6 className="fw-bold mb-0 text-success">
                        {weatherData?.agroAdvisory?.spraySuitability || 'Ideal'}
                      </h6>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded-3 bg-light border text-center">
                      <div className="d-flex align-items-center justify-content-center text-warning mb-1">
                        <Thermometer size={18} />
                      </div>
                      <span className="text-muted small d-block">Irrigation Need</span>
                      <h6 className="fw-bold mb-0 text-warning">
                        {weatherData?.agroAdvisory?.irrigationNeed || 'Moderate'}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Agro Advisory Banner */}
                <div className="mt-3 p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex align-items-start gap-2">
                  <ShieldCheck size={20} className="text-success flex-shrink-0 mt-1" />
                  <p className="mb-0 small text-dark leading-normal">
                    <strong>Agro-Meteorological Advisory: </strong>
                    {weatherData?.agroAdvisory?.advisoryMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Farm Forecast Strip */}
          <h5 className="fw-bold brand-font mb-3 d-flex align-items-center gap-2">
            <Calendar size={18} className="text-success" />
            7-Day Agricultural Microclimate Forecast
          </h5>
          <div className="row g-2 mb-4">
            {weatherData?.forecast?.map((day, idx) => (
              <div key={idx} className="col">
                <div className="agri-card p-3 text-center h-100 bg-white">
                  <span className="fw-bold d-block small mb-1">{day.day}</span>
                  <div className="fs-5 fw-bold text-dark my-1">{day.maxTemp}&deg;</div>
                  <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Min: {day.minTemp}&deg;</small>
                  <span className="badge bg-light text-dark border my-1 d-block" style={{ fontSize: '0.68rem' }}>
                    {day.condition}
                  </span>
                  <small className="text-primary d-block" style={{ fontSize: '0.7rem' }}>
                    <Droplet size={11} className="inline" /> {day.rainProbability}% rain
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Dynamic Pest Outbreak Simulator */}
          <div className="agri-card p-4 bg-white border">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
              <div>
                <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-1 rounded-pill mb-1">
                  Predictive Biosecurity Engine
                </span>
                <h4 className="fw-bold mb-0 brand-font">Dynamic Pest & Blight Outbreak Simulator</h4>
                <small className="text-muted">
                  Simulate temperature and humidity fluctuations to test crop susceptibility against pathogens.
                </small>
              </div>
            </div>

            {/* Simulator Controls */}
            <form onSubmit={handleSimulate} className="p-3 bg-light rounded-3 mb-4 border">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Target Crop</label>
                  <select
                    className="form-select form-select-sm"
                    value={simCrop}
                    onChange={(e) => setSimCrop(e.target.value)}
                  >
                    <option value="Wheat">Wheat (Late Sown / Timely)</option>
                    <option value="Rice">Rice / Paddy</option>
                    <option value="Tomato">Tomato / Solanaceous</option>
                    <option value="Potato">Potato</option>
                    <option value="Maize">Maize / Corn</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Ambient Temperature: {simTemp}&deg;C</label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    className="form-range"
                    value={simTemp}
                    onChange={(e) => setSimTemp(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Relative Humidity: {simHumidity}%</label>
                  <input
                    type="range"
                    min="20"
                    max="98"
                    className="form-range"
                    value={simHumidity}
                    onChange={(e) => setSimHumidity(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-3">
                  <button type="submit" disabled={pestLoading} className="btn btn-danger btn-sm w-100 fw-bold py-2">
                    {pestLoading ? 'Simulating...' : '🚨 Run Risk Analysis'}
                  </button>
                </div>
              </div>
            </form>

            {/* Pest Alerts Results */}
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Bug size={18} className="text-danger" />
              Pathogen & Insect Vulnerability Diagnosis
            </h6>

            {pestAlerts.length > 0 ? (
              <div className="row g-3">
                {pestAlerts.map((alert, idx) => (
                  <div key={idx} className="col-md-6">
                    <div
                      className={`p-4 rounded-3 h-100 border-start border-4 ${
                        alert.riskLevel === 'Critical'
                          ? 'border-danger bg-danger bg-opacity-10'
                          : alert.riskLevel === 'High'
                          ? 'border-warning bg-warning bg-opacity-10'
                          : alert.riskLevel === 'Moderate'
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-success bg-success bg-opacity-10'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0 text-dark">{alert.pestName}</h6>
                        <span
                          className={`badge ${
                            alert.riskLevel === 'Critical'
                              ? 'bg-danger'
                              : alert.riskLevel === 'High'
                              ? 'bg-warning text-dark'
                              : alert.riskLevel === 'Moderate'
                              ? 'bg-primary'
                              : 'bg-success'
                          }`}
                        >
                          Risk: {alert.riskLevel}
                        </span>
                      </div>

                      <p className="small text-secondary mb-2">
                        <strong>Symptoms: </strong> {alert.symptoms}
                      </p>

                      <div className="p-2 bg-white rounded-2 small mb-2 border">
                        <strong className="text-success d-block mb-1">🌿 Organic & Biological Remedy:</strong>
                        <span>{alert.organicTreatment}</span>
                      </div>

                      <div className="p-2 bg-white rounded-2 small mb-2 border">
                        <strong className="text-danger d-block mb-1">🧪 Chemical Treatment (Precise Dosage):</strong>
                        <span>{alert.chemicalTreatment}</span>
                      </div>

                      <small className="text-muted d-block">
                        <strong>Prevention: </strong> {alert.preventativeMeasure}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small">No active warnings under selected climate conditions.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherAlerts;
