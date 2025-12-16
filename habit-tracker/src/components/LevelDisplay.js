import React from 'react';

const LevelDisplay = ({ level, xp, XP_PER_LEVEL }) => {
  const progress = Math.min((xp / XP_PER_LEVEL) * 100, 100);
  const remainingXp = XP_PER_LEVEL - xp;

  return (
    <div className="modern-card p-4 rounded-4 mb-4 bg-primary bg-gradient text-white position-relative overflow-hidden fade-in">
      <div className="position-absolute top-0 end-0 opacity-10 p-3">
        <i className="bi bi-trophy-fill" style={{ fontSize: '8rem', transform: 'rotate(15deg)' }}></i>
      </div>
      
      <div className="d-flex align-items-center position-relative z-1">
         <div className="me-4 text-center">
             <div className="display-4 fw-bold mb-0">{level}</div>
             <div className="small text-white-50 fw-bold text-uppercase tracking-wide">Level</div>
         </div>
         
         <div className="flex-grow-1">
            <h4 className="fw-bold mb-2">Keep going! You're doing great.</h4>
            <p className="mb-3 text-white-50 small">
              Earn <strong>{remainingXp} XP</strong> more to reach Level {level + 1}. 
              Complete habits to gain XP!
            </p>
            
            <div className="progress bg-white bg-opacity-25 rounded-pill" style={{ height: '12px' }}>
              <div 
                className="progress-bar bg-white rounded-pill" 
                role="progressbar" 
                style={{ width: `${progress}%` }}
                aria-valuenow={progress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            
            <div className="d-flex justify-content-between mt-2 small text-white-50 fw-bold">
               <span>{xp} XP</span>
               <span>{XP_PER_LEVEL} XP</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LevelDisplay;
