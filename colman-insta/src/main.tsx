import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = '653142317212-n5n2jtq45ddn5p7825a8dicgbsn0e95n.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <StrictMode>
      <App />
    </StrictMode>
</GoogleOAuthProvider>,
)

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
