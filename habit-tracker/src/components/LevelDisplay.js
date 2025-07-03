
import React from 'react';

const LevelDisplay = ({ level, xp, XP_PER_LEVEL }) => {
  const progress = (xp / XP_PER_LEVEL) * 100;

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body text-center">
        <h5 className="card-title text-primary">Level: {level}</h5>
        <p className="card-text">XP: {xp} / {XP_PER_LEVEL}</p>
        <div className="progress" style={{ height: '20px' }}>
          <div
            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {xp} XP
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelDisplay;
