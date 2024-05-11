import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId: string = import.meta.env.VITE_API_CLIENT_ID || "1056783723409-7ljeg5rqsvfv83ijipgbsbhi9905ffrk.apps.googleusercontent.com";
console.log(clientId)


ReactDOM.createRoot(document.getElementById('root')!).render(

  <GoogleOAuthProvider clientId="1056783723409-7aii99rhj579ii9m8ec8s94ndqcuu8vu.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
)
