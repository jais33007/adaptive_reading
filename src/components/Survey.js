import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Survey.css'

const Survey = () => {
  const [responses, setResponses] = useState([]);

  const surveyQuestions = [
    {
      question: "On a scale of 1 to 3, how engaged were you while reading the document?",
      scale: ["1", "2", "3"]
    },
    {
      question: "Rate the overall intensity of your engagement with the document over time.",
      scale: ["1", "2", "3"]
    },
    {
      question: "Rate the helpfulness of the summary in capturing the main points of the document.",
      scale: ["1", "2", "3"]
    },
    {
      question: "To what extent did the summary align with the information you focused on while reading?",
      scale: ["1", "2", "3"]
    },
    {
      question: "How often did you refer back to the summary while reading?",
      scale: ["1", "2", "3"]
    },
    {
      question: "Rate the influence of the summary on your reading strategy and gaze behavior.",
      scale: ["1", "2", "3"]
    },
    {
      question: "Rate your confidence in the system's ability to utilize your gaze data effectively for generating tailored summaries.",
      scale: ["1", "2", "3"]
    },
    {
      question: "How well do you think your gaze behavior reflects your level of interest or engagement with the document?",
      scale: ["1", "2", "3"]
    }
  ];

  const handleOptionChange = (questionIndex, value) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = value;
    setResponses(updatedResponses);
  };

  return (
    <div className="survey-container">
      <h2>Survey Questions</h2>
      <form>
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
          <Link to="/documents">Submit</Link>
        </div>
      </form>
    </div>
  );
};

export default Survey;
