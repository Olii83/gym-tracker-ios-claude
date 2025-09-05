import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

// iOS 18 PWA Detection and Fixes
const isIOSPWA = () => {
  return (window.navigator as any).standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches ||
         document.referrer.includes('android-app://') ||
         window.location.search.includes('source=pwa');
};

// Force PWA behavior on iOS 18
if (isIOSPWA()) {
  // Prevent scrolling past viewport bounds
  (document.body.style as any).overscrollBehavior = 'none';
  (document.documentElement.style as any).overscrollBehavior = 'none';
  
  // Hide any potential browser UI
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 100);
}

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
