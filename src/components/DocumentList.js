import React from 'react';
import { useNavigate } from 'react-router-dom'
import './DocumentList.css'; 
import axios from 'axios'

const DocumentList = () => {
  const documents = ['1.) Introduction to Basic Mathematics',
                     '2.) Intermediate French Grammar: Verb Conjugation',
                     '3.) Advanced Quantum Mechanics: Schrödinger Equation and Wave functions',
                     '4.) Quantum Entanglement in Non-Euclidean Spacetime Metrics',
                     '5.) Bayesian Inference for Complex Dynamical Systems with Sparse Observations',
                     '6.) The Science of Sleep',
                     '7.) Quantum Gravity: Unifying General Relativity and Quantum Mechanics',
                     '8.) The Psychology of Decision Making',
                     '9.) The Impact of Social Media on Mental Health',
                     '10.) The Importance of Biodiversity in Ecosystems'];
  const navigate = useNavigate(); 

  const HandleDocumentClick = async (documentIndex) => {
    try {
      
        await axios.get('http://localhost:8765/recording/start/');
        await axios.get('http://localhost:8765/recording/capture/')

        console.log('Recording started');
        
    } 
    catch (error) {
      console.error('API Request Error:', error);
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
  </div>
  );
};

export default DocumentList;

