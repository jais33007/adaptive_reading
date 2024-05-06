import React, { useState } from 'react';
import Document from './Document';
import { GazeView } from '../services/gaze_view';

const Parent = () => {
  const [engagementScore, setEngagementScore] = useState(0);
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);

  const handleToggleEyeTracking = () => {
    setEyeTrackingEnabled(!eyeTrackingEnabled);
  };

  const updateEngagementScore = (score) => {
    console.log("Defining updateEngagementScore function");
    console.log("Updating engagement score in Parent:", score);
    setEngagementScore(score);
  };

  console.log("Rendering Parent component");

  return (
    <>
      <Document engagementScore={engagementScore} eyeTrackingEnabled={eyeTrackingEnabled} toggleEyeTracking={handleToggleEyeTracking} updateEngagementScore={updateEngagementScore} />
      {eyeTrackingEnabled && <GazeView updateEngagementScore={updateEngagementScore} />}
    </>
  );
};

export default Parent;
