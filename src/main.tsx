import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylex.css'
import './material-theme/css/light.css'
import './material-theme/css/light-hc.css'
import './material-theme/css/dark.css'
import './material-theme/css/dark-hc.css'

import App from './App.tsx'
import { BibTeXDataProvider } from './context/BibTeXDataContext.tsx'
import { DesignSkinProvider } from './context/DesignSkinContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import Toast from './components/Toast.tsx'
import { SideBarProvider } from './components/SideBar.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DesignSkinProvider>
            <SideBarProvider>

                <ToastProvider
                    duration={300}
                    keepTime={5000}
                >
                    <BibTeXDataProvider>
                        <App />
                    </BibTeXDataProvider>
                    <Toast />
                </ToastProvider>
            </SideBarProvider>
        </DesignSkinProvider>
    </StrictMode>,
)
