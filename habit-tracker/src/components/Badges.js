
import React from 'react';

const Badges = ({ earnedBadges }) => {
  return (
    <div className="modern-card p-4 rounded-4 mb-4">
      <h3 className="section-title mb-4">Your Badges</h3>
      
      {earnedBadges.length === 0 ? (
        <div className="text-center py-5 text-muted bg-light rounded-4 border-dashed">
          <i className="bi bi-award fs-1 mb-3 d-block opacity-50"></i>
          <p>No badges earned yet. Keep tracking your habits to unlock achievements!</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="col">
              <div className="card h-100 text-center border-0 shadow-sm rounded-4 card-hover-effect">
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                  <div className="badge-icon-bg bg-light-warning rounded-circle p-3 mb-3">
                     <i className={`${badge.icon} fs-1 text-warning`}></i>
                  </div>
                  <h5 className="card-title fw-bold mb-2">{badge.name}</h5>
                  <p className="card-text text-muted small">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Badges;
