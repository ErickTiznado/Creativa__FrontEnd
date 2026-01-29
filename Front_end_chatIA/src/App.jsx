import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx'
import ViewCampaignsMarketing from './layouts/ViewCampaignsMarketing/ViewCampaignsMarketing.jsx';
import ViewAssignmentsDesigner from './layouts/ViewAssignmentsDesigner/ViewAssignmentsDesigner.jsx';
import CampaignWorkspace from './layouts/CampaignWorkspace/CampaignWorkspace.jsx';
import ChatPage from './pages/ChatPage';
import Login from './components/Login/login.jsx';
import './App.css'
import { authProvider as AuthProvider } from "./context/AuthContext.jsx"
import PrivateRoute from './components/Guards/PrivateRoute.jsx';
import RoleRoute from './components/Guards/RoleRoute.jsx';
import { CampaignProvider } from './context/CampaignContext.jsx';

function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>

              {/* Marketing Routes */}
              <Route element={<RoleRoute allowedRoles={['marketing']} />}>
                <Route path='/' element={
                  <>
                    <Navbar role='Marketing' />
                    <ViewCampaignsMarketing />
                  </>
                } />
                <Route path="/chat" element={<ChatPage />} />
              </Route>

              {/* Designer Routes */}
              <Route element={<RoleRoute allowedRoles={['designer']} />}>
                <Route path="/designer" element={
                  <>
                    <Navbar role='Diseñador' />
                    <ViewAssignmentsDesigner />
                  </>
                } />
                <Route path="/designer/workspace/:campaignId" element={
                  <>
                    <Navbar role='Diseñador' />
                    <CampaignWorkspace />
                  </>
                } />
              </Route>

            </Route>
          </Routes>
        </Router>
      </CampaignProvider>
    </AuthProvider >
  )
}

export default App
