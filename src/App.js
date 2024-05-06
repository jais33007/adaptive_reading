import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './components/FrontPage';
import DocumentList from './components/DocumentList';
import Parent from './components/Parent';
import Questionnaire from './components/Questionnaire';
import Survey from './components/Survey'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/documents" element={<DocumentList />} />
        <Route path="/documents/:id" element={<Parent />} />
        <Route path="/survey" element={<Survey />} />
      </Routes>
    </Router>
  );
};

export default App;
