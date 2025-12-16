import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-white border-top">
      <div className="container text-center">
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <a href="#" className="text-secondary text-decoration-none small hover-primary">About</a>
          <a href="#" className="text-secondary text-decoration-none small hover-primary">Features</a>
          <a href="#" className="text-secondary text-decoration-none small hover-primary">Pricing</a>
          <a href="#" className="text-secondary text-decoration-none small hover-primary">Privacy</a>
          <a href="#" className="text-secondary text-decoration-none small hover-primary">Terms</a>
        </div>
        
        <div className="d-flex justify-content-center gap-3 mb-3">
          <a href="#" className="text-muted opacity-50 hover-primary transition-all"><i className="bi bi-twitter fs-5"></i></a>
          <a href="#" className="text-muted opacity-50 hover-primary transition-all"><i className="bi bi-github fs-5"></i></a>
          <a href="#" className="text-muted opacity-50 hover-primary transition-all"><i className="bi bi-instagram fs-5"></i></a>
        </div>

        <p className="text-muted small mb-0 opacity-50" style={{ fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} Habit Tracker. Crafted with <i className="bi bi-heart-fill text-danger mx-1" style={{ fontSize: '0.6rem' }}></i> for productivity.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
