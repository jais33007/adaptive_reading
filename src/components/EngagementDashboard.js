import React from 'react';
import './EngagementDashboard.css'; // Create and import CSS file for styling

const EngagementDashboard = ({ score }) => {
  return (
    <div className="dashboard-container">
      <h3>Engagement Level</h3>
      <div className={`score-display ${score === 0 ? 'low' : 'high'}`}>
        {score === 0 ? 'Low' : 'High'}
      </div>
    </div>
  );
};

export default EngagementDashboard;
