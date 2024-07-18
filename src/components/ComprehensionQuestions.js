import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import questions from '../data/questions.json'
import './ComprehensionQuestions.css'
const ComprehensionQuestions = () => {
  const { id } = useParams();
  const documentQuestions = questions.find((doc) => (doc.id) === parseInt(id));  
  console.log(documentQuestions);
  const navigate = useNavigate();

  if (!documentQuestions) {
    return <div>No questions found for document with id {id}</div>;
  }

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
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="submit-button">
        <button className="styled-button" onClick={() => navigate('/survey')}>Proceed to Survey</button>
      </div>
    </div>
  );
};

export default ComprehensionQuestions;