import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Redirect old Amplify URL to custom domain
if (window.location.hostname === 'main.d2pm3jfcsesli7.amplifyapp.com') {
  window.location.replace('https://awsprepai.isaloumapps.com' + window.location.pathname + window.location.search)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
