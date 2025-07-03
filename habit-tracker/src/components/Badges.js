
import React from 'react';

const Badges = ({ earnedBadges }) => {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-info text-white">
        <h3 className="mb-0">Your Badges</h3>
      </div>
      <div className="card-body">
        {earnedBadges.length === 0 ? (
          <p className="text-muted">No badges earned yet. Keep tracking your habits!</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="col">
                <div className="card h-100 text-center bg-light">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <i className={`${badge.icon} display-4 text-warning mb-3`}></i>
                    <h5 className="card-title">{badge.name}</h5>
                    <p className="card-text text-muted">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Badges;
