import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container fade-in overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="position-relative py-5 py-lg-6 text-center">
        {/* Background Decorative Blobs */}
        <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100" style={{ zIndex: -1, maxWidth: '1200px', pointerEvents: 'none' }}>
           <div className="position-absolute top-0 start-0 translate-middle rounded-circle opacity-20 bg-primary blur-3xl" style={{ width: '400px', height: '400px', filter: 'blur(100px)' }}></div>
           <div className="position-absolute bottom-0 end-0 translate-middle rounded-circle opacity-20 bg-success blur-3xl" style={{ width: '300px', height: '300px', filter: 'blur(80px)' }}></div>
        </div>

        <div className="container position-relative z-1 pt-4 pb-5">
           <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white border shadow-sm mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="badge bg-primary rounded-pill">New</span>
              <span className="text-secondary small fw-medium">Smart Analytics 2.0 is here</span>
           </div>

           <h1 className="display-3 fw-bolder mb-4 animate-slide-up" style={{ letterSpacing: '-0.02em', lineHeight: '1.2', animationDelay: '0.2s' }}>
             Build habits that <br className="d-none d-md-block" />
             <span className="text-transparent bg-clip-text bg-gradient-primary" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
               actually stick.
             </span>
           </h1>
           
           <p className="lead text-muted mx-auto mb-5 animate-slide-up" style={{ maxWidth: '600px', animationDelay: '0.3s' }}>
             Your personal command center for self-improvement. Track daily goals, visualize progress, and achieve your potential with a beautifully designed companion.
           </p>

           <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg hover-scale transition-all">
                 Start Tracking Free
                 <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill fw-bold bg-white text-dark border hover-scale transition-all">
                 Login
              </Link>
           </div>
           
           {/* Hero Image Mockup Area */}
           <div className="mt-5 pt-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
               <div className="mx-auto modern-card p-2 rounded-4 shadow-lg border-0" style={{ maxWidth: '900px', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
                   <div className="bg-light rounded-4 overflow-hidden position-relative" style={{ height: '300px' }}>
                       {/* Abstract UI Representation */}
                       <div className="position-absolute top-50 start-50 translate-middle w-75">
                          <div className="row g-3">
                             <div className="col-8">
                                <div className="bg-white p-3 rounded-3 shadow-sm mb-3 h-100">
                                   <div className="d-flex gap-2 mb-2">
                                      <div className="bg-light rounded-circle" style={{width: 20, height: 20}}></div>
                                      <div className="bg-light rounded-pill w-50" style={{height: 20}}></div>
                                   </div>
                                   <div className="bg-light rounded w-100" style={{height: 60}}></div>
                                </div>
                             </div>
                             <div className="col-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3 h-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-pie-chart-fill text-primary display-4 opacity-50"></i>
                                </div>
                             </div>
                             <div className="col-12">
                                <div className="d-flex gap-3">
                                   <div className="bg-white p-3 rounded-3 shadow-sm flex-fill"></div>
                                   <div className="bg-white p-3 rounded-3 shadow-sm flex-fill"></div>
                                   <div className="bg-white p-3 rounded-3 shadow-sm flex-fill"></div>
                                </div>
                             </div>
                          </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="border-top border-bottom bg-white py-4 mb-5">
        <div className="container">
           <div className="row text-center g-4">
               <div className="col-md-4">
                   <h3 className="fw-bolder mb-0 text-dark">10k+</h3>
                   <span className="text-muted small text-uppercase fw-bold tracking-wide">Active Users</span>
               </div>
               <div className="col-md-4">
                   <h3 className="fw-bolder mb-0 text-dark">500k+</h3>
                   <span className="text-muted small text-uppercase fw-bold tracking-wide">Habits Tracked</span>
               </div>
               <div className="col-md-4">
                   <h3 className="fw-bolder mb-0 text-dark">4.9/5</h3>
                   <span className="text-muted small text-uppercase fw-bold tracking-wide">User Rating</span>
               </div>
           </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="container py-5 mb-5">
         <div className="text-center mb-5 mw-md mx-auto" style={{maxWidth: '700px'}}>
             <h2 className="display-6 fw-bold mb-3 text-dark">Everything you need to grow</h2>
             <p className="text-muted lead fs-6">Powerful tools minimalist design. We make tracking your life simple yet profound.</p>
         </div>
         
         <div className="row g-4">
             {/* Feature 1 */}
             <div className="col-md-4">
                <div className="modern-card p-4 h-100 rounded-4 card-hover-effect border-0 bg-white">
                    <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-inline-block mb-3">
                        <i className="bi bi-bar-chart-line-fill fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-3 text-dark">Visualize Progress</h4>
                    <p className="text-muted mb-0">See your growth with beautiful, interactive charts. Spot trends and optimize your daily routine.</p>
                </div>
             </div>

             {/* Feature 2 */}
             <div className="col-md-4">
                <div className="modern-card p-4 h-100 rounded-4 card-hover-effect border-0 bg-white">
                    <div className="icon-box bg-success bg-opacity-10 text-success rounded-circle p-3 d-inline-block mb-3">
                        <i className="bi bi-lightning-charge-fill fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-3 text-dark">Stay Consistent</h4>
                    <p className="text-muted mb-0">Gamify your life with streaks, levels, and XP. Motivation automated to keep you going.</p>
                </div>
             </div>

             {/* Feature 3 */}
             <div className="col-md-4">
                <div className="modern-card p-4 h-100 rounded-4 card-hover-effect border-0 bg-white">
                    <div className="icon-box bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-inline-block mb-3">
                        <i className="bi bi-gear-wide-connected fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-3 text-dark">Total Control</h4>
                    <p className="text-muted mb-0">Flexible scheduling, smart reminders, and detailed data exports. You own your data.</p>
                </div>
             </div>
         </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="container py-5 mb-5">
         <div className="bg-dark rounded-5 p-5 text-center text-white position-relative overflow-hidden shadow-lg">
             <div className="position-absolute top-0 end-0 p-5 opacity-10">
                 <i className="bi bi-check-circle-fill display-1"></i>
             </div>
             
             <div className="position-relative z-1 py-4">
                 <h2 className="display-5 fw-bold mb-3 text-white">Ready to change your life?</h2>
                 <p className="text-white-50 lead mb-5 mx-auto" style={{maxWidth: '600px'}}>Join thousands of others who are building better habits today. No credit card required.</p>
                 <Link to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold shadow hover-scale text-primary">
                    Get Started Now
                 </Link>
             </div>
         </div>
      </section>

    </div>
  );
};

export default HomePage;
