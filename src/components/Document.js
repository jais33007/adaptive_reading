import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Document.css';
import axios from 'axios'; // For potential future external API interaction (optional)
import { summarizeParagraph } from '../services/summarizationAPI'; // Import for backend API calls
import { GazeView } from '../services/gaze_view'

const Document = ({ engagementScore, eyeTrackingEnabled, toggleEyeTracking, updateEngagementScore }) => {
  const { id } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  // const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [paragraphSummary, setParagraphSummary] = useState(''); // State to store paragraph summary

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

  const handleParagraphClick = (paragraph) => {
    setSelectedParagraph(paragraph);
  };

  const handleProceedToQuestionnaire = async () => {
    try {
      await axios.get('http://localhost:8765/recording/capture/'); // Replace with your recording API if needed
      await axios.get('http://localhost:8765/recording/stop/'); // Replace with your recording API if needed

      // Navigate to the questionnaire page
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
      if (selectedParagraph) {
        try {

          const summary = await summarizeParagraph(selectedParagraph);
          setParagraphSummary(summary);
        } catch (error) {
          console.error('Error summarizing paragraph:', error);
        }
      }
    };

    summarizeSelectedParagraph();
  }, [selectedParagraph, summarizeParagraph]); 
  
  return (
    <>
      <div className="document-container">
        {/* <div className="document-content">
          <ReactMarkdown>{documentContent}</ReactMarkdown>
        </div> */}
        <div className="paragraph-summaries">
          {documentContent.split('\n').map((paragraph, index) => (
            <p key={index} onClick={() => handleParagraphClick(paragraph)}>
              {paragraph}
            </p>
          ))}
        </div>
        <button className={`eye-tracking-button ${eyeTrackingEnabled ? 'enabled' : 'disabled'}`} onClick={toggleEyeTracking}>
          {eyeTrackingEnabled ? 'Disable Eye Tracking' : 'Enable Eye Tracking'}
        </button>
        <Link to={`/survey/`} className="proceed-button" onClick={handleProceedToQuestionnaire}>
          Proceed to Survey
        </Link>
      </div>
      {selectedParagraph && (
        <div className="paragraph-summary">
          <h3>Summary</h3>
          <p>{paragraphSummary}</p>
        </div>
      )}
      {eyeTrackingEnabled && <GazeView updateEngagementScore={updateEngagementScore} />}
    </>
  );
};

export default Document;
