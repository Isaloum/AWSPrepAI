// Polyfill 'global' for AWS/Node.js libs — must be in bundle, not an inline script
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

// Redirect old Amplify URL to custom domain
if (window.location.hostname === 'main.d2pm3jfcsesli7.amplifyapp.com') {
  window.location.replace('https://certiprepai.com' + window.location.pathname + window.location.search)
}

Sentry.init({
  dsn: 'https://ff11893839d989559b8b45663789b544@o4511333066145792.ingest.us.sentry.io/4511333070667776',
  environment: window.location.hostname === 'certiprepai.com' ? 'production' : 'development',
  enabled: window.location.hostname === 'certiprepai.com',
  tracesSampleRate: 0.1,
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network request failed',
    'Load failed',
    'ChunkLoadError',
  ],
  beforeSend(event) {
    // Never send passwords, tokens, or payment data
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>
      delete data.password
      delete data.token
      delete data.accessToken
      delete data.idToken
    }
    return event
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
