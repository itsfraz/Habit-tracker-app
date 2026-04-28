import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Moon, 
  Sun, 
  Wind, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  UserCircle2 
} from 'lucide-react';

const Navbar = ({ currentUser, logOut, toggleTheme, theme, lowMotion, toggleLowMotion }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/tracker');
    } else {
      navigate('/');
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={!lowMotion ? navVariants : {}}
      className={`navbar navbar-expand-lg sticky-top mb-4 transition-all duration-300 ${
        isScrolled ? 'modern-header-scrolled py-2 shadow-sm' : 'modern-header py-3'
      } ${theme === 'dark' ? 'navbar-dark bg-dark-glass' : 'navbar-light bg-light-glass'}`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        zIndex: 1030
      }}
    >
      <div className="container">
        <a 
          className="navbar-brand d-flex align-items-center fw-bold fs-4" 
          href="/" 
          onClick={handleBrandClick}
          style={{ letterSpacing: '-0.5px' }}
        >
          <motion.div 
            whileHover={!lowMotion ? { rotate: 180 } : {}} 
            transition={{ duration: 0.3 }}
            className="me-2 text-primary d-flex"
          >
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </motion.div>
          <span className="brand-text bg-gradient-text">HabitTrackr</span> ✨
        </a>
        
        {/* Mobile menu toggle */}
        <button 
          className="navbar-toggler border-0 shadow-none p-2 rounded-circle" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <motion.button 
                whileHover={!lowMotion ? { scale: 1.05 } : {}}
                whileTap={!lowMotion ? { scale: 0.95 } : {}}
                className={`btn btn-link nav-link p-0 d-flex align-items-center header-icon-btn ${theme === 'light' ? 'text-warning' : 'text-light'}`} 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className="icon-wrapper p-2 rounded-circle d-flex align-items-center justify-content-center">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
              </motion.button>
            </li>

            <li className="nav-item">
              <motion.button 
                whileHover={!lowMotion ? { scale: 1.05 } : {}}
                whileTap={!lowMotion ? { scale: 0.95 } : {}}
                className="btn btn-link nav-link p-0 d-flex align-items-center header-icon-btn text-info" 
                onClick={toggleLowMotion}
                title={`Toggle Reduced Motion`}
              >
                <div className={`icon-wrapper p-2 rounded-circle d-flex align-items-center justify-content-center ${lowMotion ? 'bg-info bg-opacity-25' : ''}`}>
                  <Wind size={20} className={lowMotion ? 'opacity-100' : 'opacity-50'} />
                </div>
              </motion.button>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item ms-2">
                  <div className="nav-link fw-medium d-flex align-items-center px-3 py-2 rounded-pill user-badge" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                    <UserCircle2 size={20} className="me-2 text-primary" />
                    <span>Hello, <span className="text-primary fw-bold">{currentUser.username}</span> 🔥</span>
                  </div>
                </li>
                <li className="nav-item ms-2">
                  <motion.button 
                    whileHover={!lowMotion ? { scale: 1.05, backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' } : {}}
                    whileTap={!lowMotion ? { scale: 0.95 } : {}}
                    className="btn btn-outline-danger btn-sm px-4 py-2 rounded-pill d-flex align-items-center fw-medium border-2" 
                    onClick={logOut}
                  >
                    <LogOut size={16} className="me-2" />
                    Logout
                  </motion.button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-2">
                <Link 
                  to="/login" 
                  className="text-decoration-none"
                >
                  <motion.button
                    whileHover={!lowMotion ? { scale: 1.05 } : {}}
                    whileTap={!lowMotion ? { scale: 0.95 } : {}}
                    className={`btn px-4 py-2 rounded-pill d-flex align-items-center fw-medium ${location.pathname === '/login' ? 'btn-primary shadow-sm' : 'btn-outline-primary border-2'}`}
                  >
                    <LogIn size={16} className="me-2" />
                    Login 🎯
                  </motion.button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={!lowMotion ? mobileMenuVariants : {}}
            className="d-lg-none w-100 position-absolute start-0 top-100 overflow-hidden"
            style={{ 
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="container py-3">
              <ul className="navbar-nav d-flex flex-column gap-3">
                {currentUser && (
                  <li className="nav-item">
                    <div className="d-flex align-items-center p-2 rounded-3" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                      <UserCircle2 size={24} className="me-3 text-primary" />
                      <div className="d-flex flex-column">
                        <span className="small text-muted mb-0">Logged in as</span>
                        <span className="fw-bold">{currentUser.username} 🔥</span>
                      </div>
                    </div>
                  </li>
                )}
                
                <li className="nav-item d-flex justify-content-between align-items-center px-2">
                  <span className="fw-medium">Theme Options</span>
                  <div className="d-flex gap-2">
                    <button 
                      className={`btn btn-sm rounded-circle p-2 d-flex ${theme === 'light' ? 'bg-warning text-white border-0' : 'bg-secondary text-white border-0'}`} 
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button 
                      className={`btn btn-sm rounded-circle p-2 d-flex ${lowMotion ? 'bg-info text-white border-0' : 'bg-secondary text-white border-0'}`} 
                      onClick={toggleLowMotion}
                    >
                      <Wind size={18} />
                    </button>
                  </div>
                </li>

                <hr className="my-2 opacity-25" />

                {currentUser ? (
                  <li className="nav-item">
                    <button 
                      className="btn btn-danger w-100 rounded-pill d-flex justify-content-center align-items-center py-2 border-0 shadow-sm" 
                      onClick={() => { logOut(); closeMobileMenu(); }}
                    >
                      <LogOut size={18} className="me-2" />
                      Logout
                    </button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <button 
                      className="btn btn-primary w-100 rounded-pill d-flex justify-content-center align-items-center py-2 border-0 shadow-sm" 
                      onClick={() => { navigate('/login'); closeMobileMenu(); }}
                    >
                      <LogIn size={18} className="me-2" />
                      Login 🎯
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
