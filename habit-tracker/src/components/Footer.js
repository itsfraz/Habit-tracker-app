import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-white border-top">
      <div className="container text-center">
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <button className="text-secondary text-decoration-none small hover-primary border-0 bg-transparent">About</button>
          <button className="text-secondary text-decoration-none small hover-primary border-0 bg-transparent">Features</button>
          <button className="text-secondary text-decoration-none small hover-primary border-0 bg-transparent">Pricing</button>
          <button className="text-secondary text-decoration-none small hover-primary border-0 bg-transparent">Privacy</button>
          <button className="text-secondary text-decoration-none small hover-primary border-0 bg-transparent">Terms</button>
        </div>
        
        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className="text-muted opacity-50 hover-primary transition-all border-0 bg-transparent"><i className="bi bi-twitter fs-5"></i></button>
          <button className="text-muted opacity-50 hover-primary transition-all border-0 bg-transparent"><i className="bi bi-github fs-5"></i></button>
          <button className="text-muted opacity-50 hover-primary transition-all border-0 bg-transparent"><i className="bi bi-instagram fs-5"></i></button>
        </div>

        <p className="text-muted small mb-0 opacity-50" style={{ fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} Habit Tracker. Crafted with <i className="bi bi-heart-fill text-danger mx-1" style={{ fontSize: '0.6rem' }}></i> for productivity.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
