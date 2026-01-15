import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar/Navbar.jsx'
import ViewCampaignsMarketing from './layouts/viewCampaignsMarketing/viewCampaignsMarketing.jsx';
import ChatPage from './pages/ChatPage';
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ViewCampaignsMarketing />} />
        <Route path="/chat" element={<ChatPage />} /> {/* Nueva vista del chatbox */}
      </Routes>
    </Router>
  )
}

export default App
