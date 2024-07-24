import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questions from '../data/questions.json';
import { saveAs } from 'file-saver';
import './ComprehensionQuestions.css';

const ComprehensionQuestions = () => {
  const { id } = useParams();
  const documentQuestions = questions.find((doc) => doc.id === parseInt(id));
  const navigate = useNavigate();

  const [responses, setResponses] = useState({});

  if (!documentQuestions) {
    return <div>No questions found for document with id {id}</div>;
  }

  const handleOptionChange = (questionIndex, option) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: option,
    }));
  };

  const handleProceedToSurvey = () => {
    const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' });
    const filename = `ques_responses_${id}.json`;
    saveAs(blob, filename);

    navigate(`/survey/${id}`);
  };

  return (
    <div className="comprehension-container">
      <h2>Comprehension Questions</h2>
      {documentQuestions.questions.map((question, index) => (
        <div key={index} className="question">
          <p>{index + 1}. {question.question}</p>
          <div className="q_options">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="radio-label">
                <input
                  type="radio"
                  name={`question_${index}`}
                  value={option}
                  onChange={() => handleOptionChange(index, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="submit-button">
        <button className="styled-button" onClick={handleProceedToSurvey}>
          Proceed to Survey
        </button>
      </div>
    </div>
  );
};

export default ComprehensionQuestions;
