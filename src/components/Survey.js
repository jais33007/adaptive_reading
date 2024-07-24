import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import './Survey.css';

const Survey = () => {
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve document ID from URL parameters

  const surveyQuestions = [
    {
      question: "On a scale of 1 to 7, how engaged were you while reading the document?",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "Rate the overall intensity of your engagement with the document over time.",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "Rate the helpfulness of the summary in capturing the main points of the document.",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "To what extent did the summary align with the information you focused on while reading?",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "How often did you refer back to the summary while reading?",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "Rate the influence of the summary on your reading strategy and gaze behavior.",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "Rate your confidence in the system's ability to utilize your gaze data effectively for generating tailored summaries.",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    },
    {
      question: "How well do you think your gaze behavior reflects your level of interest or engagement with the document?",
      scale: ["1", "2", "3", "4", "5", "6", "7"]
    }
  ];

  const handleOptionChange = (questionIndex, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: value,
    }));
  };

  const saveResponsesAsJSON = () => {
    const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' });
    const filename = `survey_responses_${id}.json`; 
    saveAs(blob, filename);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    saveResponsesAsJSON(); // Save responses as JSON
    navigate("/documents"); // Navigate to documents page
  };

  return (
    <div className="survey-container">
      <h2>Survey Questions</h2>
      <h4>(1 = not at all, 7 = extremely)</h4>
      <form onSubmit={handleSubmit}>
        {surveyQuestions.map((questionObj, index) => (
          <div key={index} className="question">
            <p>{index + 1}. {questionObj.question}</p>
            <div className="options">
              {questionObj.scale.map((option, optionIndex) => (
                <label key={optionIndex} className="radio-label">
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option}
                    checked={responses[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="submit-button">
          <button className="styled-button" type="submit">Submit and Save</button>
        </div>
      </form>
    </div>
  );
};

export default Survey;
