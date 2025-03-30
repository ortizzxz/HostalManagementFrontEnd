import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./i18n";
import {  WebSocketProviderAnnouncements } from './components/WebSocketProviderAnnouncements.tsx';
// import { WebSocketProviderUsers } from './components/WebSocketProviderUsers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <WebSocketProviderAnnouncements>
      {/* <WebSocketProviderUsers> */}
        <App />
      {/* </WebSocketProviderUsers> */}
      </WebSocketProviderAnnouncements>
  </StrictMode>,
)
