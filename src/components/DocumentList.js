import React from 'react';
import { useNavigate } from 'react-router-dom'
import './DocumentList.css'; 
import axios from 'axios'

const DocumentList = () => {
  const documents = ['1.) Recent Advances in Artificial Intelligence',
                     '2.) Breakthroughs in Renewable Energy',
                     '3.) The Impact of Social Media on Mental Health',
                     '4.) An Analysis of the Gender Pay Gap',
                     '5.) A Study on the Effects of Climate Change on Biodiversity',
                     '6.) The Impact of COVID-19 on Global Economies',
                     '7.) The Future of Space Exploration',
                     '8.) A Review of Machine Learning Algorithms',
                     '9.) The Ethics of Gene Editing',
                     '10.) The Rise of Sustainable Fashion'];
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
    <h1 className="document-list-title">Adaptive Comprehension : Select a Document</h1>
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

