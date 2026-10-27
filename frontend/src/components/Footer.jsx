import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-success text-white p-2 rounded-circle">
                <Sprout size={22} />
              </div>
              <h5 className="mb-0 fw-bold brand-font text-white">AgriTech</h5>
            </div>
            <p className="text-secondary small leading-relaxed">
              AgriTech bridges traditional farming wisdom with cutting-edge digital intelligence. Empowering farmers with hyper-local weather forecasting, AI soil diagnostics, automated pest advisories, and an integrated agri-marketplace.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small mt-2">
              <ShieldCheck size={16} />
              <span>Certified Smart Agriculture Ecosystem</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Smart Tools</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/weather" className="text-decoration-none text-secondary">Weather & Pest Radar</Link></li>
              <li><Link to="/crops" className="text-decoration-none text-secondary">Soil N-P-K Diagnostics</Link></li>
              <li><Link to="/farms" className="text-decoration-none text-secondary">Farm GIS & Acreage</Link></li>
              <li><Link to="/marketplace" className="text-decoration-none text-secondary">Bio-Fertilizers & Seeds</Link></li>
              <li><Link to="/consultations" className="text-decoration-none text-secondary">Book Agronomist</Link></li>
            </ul>
          </div>

          {/* Community & Help */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Farmer Helpline</h6>
            <div className="d-flex align-items-start gap-2 mb-3">
              <PhoneCall size={20} className="text-success mt-1" />
              <div>
                <span className="text-white fw-bold d-block">Toll-Free Kisan Call Centre</span>
                <span className="text-success fw-bold">1800-180-1551</span>
                <small className="text-secondary d-block">Available 24x7 in 22 regional languages</small>
              </div>
            </div>
            <p className="text-secondary small mb-1">Emergency Pest Outbreak Desk:</p>
            <span className="badge bg-danger">support@agritech.com</span>
          </div>

          {/* GitHub & Repository Attribution */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Repository Details</h6>
            <p className="text-secondary small mb-2">
              Developed for project review & evaluation:
            </p>
            <ul className="list-unstyled text-secondary small">
              <li><strong>GitHub User:</strong> projectMu26</li>
              <li><strong>Email:</strong> astroandphyclub@gmail.com</li>
              <li><strong>Repository:</strong> <a href="https://github.com/projectMu26/Agritech" target="_blank" rel="noreferrer" className="text-success">Agritech</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} AgriTech Platform. Empowering sustainable farming everywhere.
          </p>
          <p className="mb-0 d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger inline" /> using MERN Stack & Bootstrap.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
