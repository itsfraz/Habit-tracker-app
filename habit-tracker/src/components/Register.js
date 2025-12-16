import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await authService.register({ username: name, email, password });
      // Enhance UX: Maybe show success message briefly or redirect
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Failed to register. Please try again.';
      setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5 fade-in bg-light">
       <div className="row w-100 justify-content-center align-items-stretch g-0 rounded-4 overflow-hidden shadow-lg mx-auto" style={{ maxWidth: '1000px', minHeight: '600px' }}>
         
         {/* Left Side - Visual / Brand */}
         <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center bg-primary p-5 text-white position-relative overflow-hidden">
             {/* Decorative Background Elements */}
             <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)' }}></div>
             <div className="position-absolute bottom-0 end-0 translate-middle pointer-events-none">
                 <i className="bi bi-stars" style={{ fontSize: '15rem', opacity: '0.1' }}></i>
             </div>

             <div className="position-relative z-1 text-center">
                 <div className="mb-4 d-inline-block bg-white bg-opacity-25 p-3 rounded-circle backdrop-blur">
                    <i className="bi bi-trophy-fill fs-1 text-white"></i>
                 </div>
                 <h2 className="display-6 fw-bold mb-3">Join the Movement</h2>
                 <p className="lead fw-light opacity-75 mb-4">
                     "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                 </p>
                 <div className="d-flex gap-2 justify-content-center opacity-50">
                     <span className="d-block bg-white rounded-circle" style={{width: '8px', height: '8px'}}></span>
                     <span className="d-block bg-white rounded-circle" style={{width: '8px', height: '8px'}}></span>
                     <span className="d-block bg-white rounded-circle" style={{width: '8px', height: '8px'}}></span>
                 </div>
             </div>
         </div>

         {/* Right Side - Form */}
         <div className="col-lg-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center">
             <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
                 <div className="text-center mb-5">
                     <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-inline-flex mb-3 d-lg-none">
                        <i className="bi bi-person-plus-fill fs-4"></i>
                     </div>
                     <h2 className="fw-bold mb-1 text-dark">Create Account</h2>
                     <p className="text-muted small">Start your journey to a better you.</p>
                 </div>

                 {error && (
                    <div className="alert alert-danger d-flex align-items-center p-2 small mb-4 rounded-3 border-danger bg-danger bg-opacity-10 text-danger" role="alert">
                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                        {error}
                    </div>
                 )}

                 <form onSubmit={onSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control bg-light border-0"
                            id="floatingName"
                            placeholder="John Doe"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                        <label htmlFor="floatingName" className="text-muted">Full Name</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control bg-light border-0"
                            id="floatingEmail"
                            placeholder="name@example.com"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                        <label htmlFor="floatingEmail" className="text-muted">Email Address</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control bg-light border-0"
                            id="floatingPassword"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                        <label htmlFor="floatingPassword" className="text-muted">Password</label>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 position-relative overflow-hidden"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                            <>Get Started <i className="bi bi-arrow-right-short ms-1"></i></>
                        )}
                    </button>
                    
                    <div className="text-center">
                        <p className="text-muted small mb-0">
                            Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in</Link>
                        </p>
                    </div>
                 </form>
             </div>
         </div>
       </div>
    </div>
  );
};

export default Register;
