import React from 'react';
import { useNavigate } from 'react-router-dom'
import './DocumentList.css'; // Import the stylesheet
//import EyeTrackerWrapper from './EyeTrackerWrapper'; // Import the EyeTrackerWrapper component
import axios from 'axios'
import { useState, useEffect } from 'react';


const DocumentList = () => {
  const documents = ['1.) Introduction to Basic Mathematics',
                     '2.) Intermediate French Grammar: Verb Conjugation',
                     '3.) Advanced Quantum Mechanics: Schrödinger Equation and Wave functions'];
  const navigate = useNavigate(); // Get the history object for navigation

  const [gazeData, setGazeData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765/gaze/raw/');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGazeData(data); // Update state with gaze data
    };

    return () => {
      ws.close();
    };
  }, []);

  // Function to handle the click event on a document link
  const HandleDocumentClick = async (documentIndex) => {
    try {
      
        await axios.get('http://localhost:8765/recording/start/');
        await axios.get('http://localhost:8765/recording/capture/')
        
    } 
    catch (error) {
      console.error('API Request Error:', error);
      // Handle the error as needed (e.g., display an error message to the user)
    }
    navigate(`/documents/${documentIndex}`);
  };


return (
  <div className="document-list">
    <h1 className="document-list-title">Adaptive comprehension : Select a Document</h1>
    <ul className="document-list-items">
      {documents.map((doc, index) => (
        <li key={index} className="document-item">
          <button onClick={() => HandleDocumentClick(index)} className="document-link">
            {doc}
          </button>
        </li>
      ))}
    </ul>
    {gazeData && (
        <div className="gaze-data">
          <h2>Gaze Data</h2>
          <pre>{JSON.stringify(gazeData, null, 2)}</pre>
        </div>
      )}
  </div>
  );
};

export default DocumentList;

