
import React from 'react';

const Badges = ({ earnedBadges }) => {
  return (
    <div className="badges-grid h-100">
      {earnedBadges.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded-4 border border-dashed h-100 d-flex flex-column justify-content-center align-items-center">
          <i className="bi bi-award fs-1 mb-3 d-block opacity-50"></i>
          <p className="mb-0">No badges earned yet.</p>
          <small>Keep tracking to unlock!</small>
        </div>
      ) : (
        <div className="row row-cols-2 g-3">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="col">
              <div className="card h-100 text-center border-0 shadow-sm rounded-4 bg-white">
                <div className="card-body p-3 d-flex flex-column align-items-center">
                   <i className={`${badge.icon} fs-2 text-warning mb-2`}></i>
                   <h6 className="card-title fw-bold mb-1 small">{badge.name}</h6>
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
