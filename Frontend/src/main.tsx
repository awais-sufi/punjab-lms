import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastProviderWrapper } from './ToastSystem'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProviderWrapper>
      <App />
    </ToastProviderWrapper>
  </StrictMode>,
)
