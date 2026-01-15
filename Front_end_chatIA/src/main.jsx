import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './colors.css';
import App from './App.jsx'
// import ViewCampaignsMarketing from './layouts/viewCampaignsMarketing/viewCampaignsMarketing.jsx';
// import './fonts.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <ViewCampaignsMarketing /> */}
  </StrictMode>,
)
