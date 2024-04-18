import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './components/FrontPage';
import DocumentList from './components/DocumentList';
import Document from './components/Document';
import Questionnaire from './components/Questionnaire';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/documents" element={<DocumentList />} />
        <Route path="/documents/:id" element={<Document />} />
        <Route path="/questionnaire/:id" element={<Questionnaire />} />
      </Routes>
    </Router>
  );
};

export default App;
