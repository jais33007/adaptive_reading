import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Document.css';
import axios from 'axios'; // For potential future external API interaction (optional)
import { summarizeParagraph } from '../services/summarizationAPI'; // Import for backend API calls
import { GazeView } from '../services/gaze_view';
import EngagementDashboard from './EngagementDashboard';

const Document = ({ engagementScore, eyeTrackingEnabled, toggleEyeTracking, updateEngagementScore }) => {
  const { id } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const [selectedParagraph, setSelectedParagraph] = useState({ text: null, top: 0 });
  const [paragraphSummary, setParagraphSummary] = useState(''); // State to store paragraph summary
  const [score, setScore] = useState(0); // State for engagement score
  // const containerRef = useRef(null);
  const navigate = useNavigate();

  const fetchMarkdownContent = async (id) => {
    try {
      const response = await fetch(`/document${id}.md`);
      const markdownContent = await response.text();
      return markdownContent;
    } catch (error) {
      console.error('Error fetching Markdown content', error);
      return '';
    }
  };

  const handleParagraphClick = (paragraph, top) => {
    setSelectedParagraph({ text: paragraph, top });
  };

  const handleProceedToQuestionnaire = async () => {
    try {
      await axios.get('http://localhost:8765/recording/capture/'); // Replace with your recording API if needed
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1 second delay
      await axios.get('http://localhost:8765/recording/stop/'); // Replace with your recording API if needed

      navigate(`/documents/${id}/questions`);
    } catch (error) {
      console.error('Proceed to Questionnaire Error:', error);
    }
  };

  useEffect(() => {
    const fetchDocumentContent = async () => {
      const content = await fetchMarkdownContent(id);
      if (typeof content === 'string') {
        setDocumentContent(content);
      } else {
        console.error('Content is not a string:', content);
      }
    };

    fetchDocumentContent();
  }, [id]);

  // Call the API to summarize the selected paragraph when it changes
  useEffect(() => {
    const summarizeSelectedParagraph = async () => {
      if (selectedParagraph.text) {
        try {
          const summary = await summarizeParagraph(selectedParagraph.text);
          setParagraphSummary(summary);
        } catch (error) {
          console.error('Error summarizing paragraph:', error);
        }
      }
    };

    summarizeSelectedParagraph();
  }, [selectedParagraph.text]);

  // useLayoutEffect(() => {
  //   if (containerRef.current) {
  //     const rect = containerRef.current.getBoundingClientRect();
  //     const coordinates = {
  //       topLeft: { x: rect.left, y: rect.top },
  //       topRight: { x: rect.right, y: rect.top },
  //       bottomLeft: { x: rect.left, y: rect.bottom },
  //       bottomRight: { x: rect.right, y: rect.bottom }
  //     };
  
  //     //  console.log('Coordinates:', coordinates);
  //   }
  // }, [containerRef]);

  useEffect(() => {
    // This effect will update the score state whenever the engagementScore prop changes
    setScore(engagementScore);
  }, [engagementScore]);
  

  return (
    <>
      <EngagementDashboard score={score} />
      <div className="document-container">
          {documentContent.split('\n').map((paragraph, index) => (
            <p
              key={index}
              onClick={(e) => handleParagraphClick(paragraph, e.target.offsetTop)}
            >
              {paragraph}
              {index === 0 && <img src={`/images/${id}.png`} alt={`Image ${id}`} width="700" height="450" />}
            </p>
          ))}
        <button className={`eye-tracking-button ${eyeTrackingEnabled ? 'enabled' : 'disabled'}`} onClick={toggleEyeTracking}>
          {eyeTrackingEnabled ? 'Disable Eye Tracking' : 'Enable Eye Tracking'}
        </button>
        <Link to='#' className="proceed-button" onClick={handleProceedToQuestionnaire}>
          Proceed to Questionnaires
        </Link>
      </div>
      {selectedParagraph.text && engagementScore === 0 && (
        <div
          className="paragraph-summary"
          style={{ top: selectedParagraph.top, 
                  position: 'absolute', 
                  left: '70%',
                  backgroundColor: '#7ea57c',
                  padding: '5px',
                  borderRadius: '30px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                 }} // Adjust position as needed
        >
          <h3>Summary</h3>
          <p>{paragraphSummary}</p>
        </div>
      )}
      {eyeTrackingEnabled && <GazeView updateEngagementScore={updateEngagementScore} />}
    </>
  );
};

export default Document;

