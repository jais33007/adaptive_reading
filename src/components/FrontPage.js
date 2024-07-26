import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.css';
import EyeTrackerWrapper from './EyeTrackerWrapper';
import axios from 'axios'


const FrontPage = () => {
  const handleStartExperiment = async () => {
    try {
      
      await axios.get('http://localhost:8765/tobii_pro/connect/')
      console.log('Connection successful')
  } 
  catch (error) {
    console.error('Connection unsuccesful', error);
    // Handle the error as needed (e.g., display an error message to the user)
  }
};

  return (
    <div className="frontpage-container">
      <h1 className="frontpage-title">Passage Reading Experiment</h1>
      <p className="frontpage-instructions">This experiment involves tracking the real-time gaze data to predict your engagement levels and summarizing the text based on your engagement level</p>
      <Link to="/documents" className="frontpage-button-link">
        <button onClick={handleStartExperiment}className="frontpage-button">Start Experiment</button>
      </Link>
    </div>
  );
};

export default FrontPage;
