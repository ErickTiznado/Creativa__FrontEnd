import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router';
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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />} >
            <>
              <Route path='/' element={
                <>
                  <Navbar role='Marketing' />

                  <ViewCampaignsMarketing />
                </>
              } />

              <Route path="/chat" element={<ChatPage />} />

            </>
          </Route>


          <Route path="/login" element={<Login />} /> {/* Nueva vista del login */}

          <Route path="/designer" element={
            <>
              <Navbar role='Diseñador' />
              <ViewAssignmentsDesigner />
            </>
          } />

          <Route path="/designer/repository" element={
            <>
              <Navbar role='Diseñador' />
              <CampaignWorkspace />
            </>
          } />

        </Routes>
      </Router>
    </AuthProvider >
  )
}

export default App
