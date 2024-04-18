// Questionnaire.js

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Questionnaire.css'; // Import the stylesheet

const Questionnaire = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Simulate fetching questions based on the document content
    const fetchQuestions = async () => {
      // Replace this with your logic to fetch questions based on the document content
      const questionsData = await fetch(`/questions/document${id}.json`);
      const questionsJson = await questionsData.json();
      setQuestions(questionsJson);
    };

    fetchQuestions();
  }, [id]);

  const handleInputChange = (questionId, optionId, value) => {
    // Handle the user's response (e.g., save it in state or send to a server)
    console.log(`User selected option ${value} for question ${questionId}, option ${optionId}`);
  };

  return (
    <div className="questionnaire-container">
      <h2>Questionnaire for Document {id}</h2>
      <form>
        {questions.map((question) => (
          <div key={question.id} className="question">
            <label>{question.text}</label>
            <div className="options">
              {question.options.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option.id}
                    onChange={(e) => handleInputChange(question.id, option.id, e.target.value)}
                  />
                  {option.text}
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

export default Questionnaire;
