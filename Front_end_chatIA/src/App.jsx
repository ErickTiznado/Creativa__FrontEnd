import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar/Navbar.jsx'
import ViewCampaignsMarketing from './layouts/ViewCampaignsMarketing/ViewCampaignsMarketing.jsx';
import ViewAssignmentsDesigner from './layouts/ViewAssignmentsDesigner/ViewAssignmentsDesigner.jsx';
import ChatPage from './pages/ChatPage';
import './App.css' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <>
              <Navbar role='Marketing' />
              <ViewCampaignsMarketing />
            </>
          }/>

        <Route path="/chat" element={<ChatPage />} /> {/* Nueva vista del chatbox */}

        <Route path="/designer" element={
            <>
              <Navbar role='Diseñador' />
              <ViewAssignmentsDesigner />
            </>
          }/>

      </Routes>
    </Router>
  )
}

export default App
