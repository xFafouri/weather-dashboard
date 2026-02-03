// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import UnsupportedDevice from "./UnsupportedDevice.jsx";
import DesktopOnlyRoute from "./DesktopOnlyRoute.jsx";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><DesktopOnlyRoute><App /></DesktopOnlyRoute></React.StrictMode>,
    {
    path: "/unsupported-device",
    element: <UnsupportedDevice />,
  },
)
