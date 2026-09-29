import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactLenis } from 'lenis/react'
import { LangProvider } from './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        anchors: { duration: 1.4 }, // header offset comes from CSS scroll-padding-top
        stopInertiaOnNavigate: true,
      }}
    >
      <LangProvider>
        <App />
      </LangProvider>
    </ReactLenis>
  </StrictMode>,
)
