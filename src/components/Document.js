// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import ReactMarkdown from 'react-markdown';
// import './Document.css';
// import axios from 'axios'; // For potential future external API interaction (optional)
// import { summarizeParagraph } from '../services/summarizationAPI'; // Import for backend API calls
// import { GazeView } from '../services/gaze_view'
// import { useNavigate } from 'react-router-dom';


// const Document = ({ engagementScore, eyeTrackingEnabled, toggleEyeTracking, updateEngagementScore }) => {
//   const { id } = useParams();
//   const [documentContent, setDocumentContent] = useState('');
//   // const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);
//   const [selectedParagraph, setSelectedParagraph] = useState(null);
//   const [paragraphSummary, setParagraphSummary] = useState(''); // State to store paragraph summary
//   const navigate = useNavigate();
  
//   const fetchMarkdownContent = async (id) => {
//     try {
//       const response = await fetch(`/document${id}.md`);
//       const markdownContent = await response.text();
//       return markdownContent;
//     } catch (error) {
//       console.error('Error fetching Markdown content', error);
//       return '';
//     }
//   };

//   const handleParagraphClick = (paragraph) => {
//     setSelectedParagraph(paragraph);
//   };

//   const handleProceedToQuestionnaire = async () => {
//     try {
//       await axios.get('http://localhost:8765/recording/capture/'); // Replace with your recording API if needed
//       await axios.get('http://localhost:8765/recording/stop/'); // Replace with your recording API if needed


//     } catch (error) {
//       console.error('Proceed to Questionnaire Error:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchDocumentContent = async () => {
//       const content = await fetchMarkdownContent(id);
//       if (typeof content === 'string') {
//         setDocumentContent(content);
//       } else {
//         console.error('Content is not a string:', content);
//       }
//     };

//     fetchDocumentContent();
//   }, [id]);

//   // Call the API to summarize the selected paragraph when it changes
//   useEffect(() => {
//     const summarizeSelectedParagraph = async () => {
//       if (selectedParagraph) {
//         try {
//  
//           const summary = await summarizeParagraph(selectedParagraph);
//           setParagraphSummary(summary);
//         } catch (error) {
//           console.error('Error summarizing paragraph:', error);
//         }
//       }
//     };

//     summarizeSelectedParagraph();
//   }, [selectedParagraph, summarizeParagraph]); 
  
//   return (
//     <>
//       <div className="document-container">
//         <div className="paragraph-summaries">
//           {documentContent.split('\n').map((paragraph, index) => (
//             <p key={index} onClick={() => handleParagraphClick(paragraph)}>
//               {paragraph}
//                 {index==0 && <img src={`/images/${id}.png`} alt={`Image ${id}`} width="700" height="450" />}
//             </p>
//           ))}
//         </div>
//         <button className={`eye-tracking-button ${eyeTrackingEnabled ? 'enabled' : 'disabled'}`} onClick={toggleEyeTracking}>
//           {eyeTrackingEnabled ? 'Disable Eye Tracking' : 'Enable Eye Tracking'}
//         </button>
//         <Link to={`/documents/${id}/questions`} className="proceed-button" onClick={handleProceedToQuestionnaire}>
//           Proceed to Questionnaires
//         </Link>
//       </div>
//       {selectedParagraph && engagementScore===0 &&(
//         <div className="paragraph-summary">
//           <h3>Summary</h3>
//           <p>{paragraphSummary}</p>
//         </div>
//       )}
//       {eyeTrackingEnabled && <GazeView updateEngagementScore={updateEngagementScore} />}
//     </>
//   );
// };

// export default Document;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Document.css';
import axios from 'axios'; // For potential future external API interaction (optional)
import { summarizeParagraph } from '../services/summarizationAPI'; // Import for backend API calls
import { GazeView } from '../services/gaze_view';
import { useNavigate } from 'react-router-dom';

const Document = ({ engagementScore, eyeTrackingEnabled, toggleEyeTracking, updateEngagementScore }) => {
  const { id } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const [selectedParagraph, setSelectedParagraph] = useState({ text: null, top: 0 });
  const [paragraphSummary, setParagraphSummary] = useState(''); // State to store paragraph summary
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
      await axios.get('http://localhost:8765/recording/stop/'); // Replace with your recording API if needed
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

  return (
    <>
      <div className="document-container">
        <div className="paragraph-summaries">
          {documentContent.split('\n').map((paragraph, index) => (
            <p
              key={index}
              onClick={(e) => handleParagraphClick(paragraph, e.target.offsetTop)}
            >
              {paragraph}
              {index === 0 && <img src={`/images/${id}.png`} alt={`Image ${id}`} width="700" height="450" />}
            </p>
          ))}
        </div>
        <button className={`eye-tracking-button ${eyeTrackingEnabled ? 'enabled' : 'disabled'}`} onClick={toggleEyeTracking}>
          {eyeTrackingEnabled ? 'Disable Eye Tracking' : 'Enable Eye Tracking'}
        </button>
        <Link to={`/documents/${id}/questions`} className="proceed-button" onClick={handleProceedToQuestionnaire}>
          Proceed to Questionnaires
        </Link>
      </div>
      {selectedParagraph.text && engagementScore === 0 && (
        <div
          className="paragraph-summary"
          style={{ top: selectedParagraph.top, 
                  position: 'absolute', 
                  left: '60%',
                  backgroundColor: '#7ea57c',
                  padding: '20px',
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

