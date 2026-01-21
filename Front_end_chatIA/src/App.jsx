import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar/Navbar.jsx'
import ViewCampaignsMarketing from './layouts/ViewCampaignsMarketing/ViewCampaignsMarketing.jsx';
import ViewAssignmentsDesigner from './layouts/ViewAssignmentsDesigner/ViewAssignmentsDesigner.jsx';
import CampaignWorkspace from './layouts/CampaignWorkspace/CampaignWorkspace.jsx';
import ChatPage from './pages/ChatPage';
import Login from './components/Login/login.jsx';
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
        <Route path="/login" element={<Login />} /> {/* Nueva vista del login */}

        <Route path="/designer" element={
            <>
              <Navbar role='Diseñador' />
              <ViewAssignmentsDesigner />
            </>
          }/>

        <Route path="/designer/repository" element={
          <>
            <Navbar role='Diseñador' />
            <CampaignWorkspace />
          </>
        }/>

      </Routes>
    </Router>
  )
}

export default App
