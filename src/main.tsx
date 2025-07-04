import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Loading from './components/Loading.tsx'

function AppWithLoading() {
  const [isLoading, setIsLoading] = useState(true)
  const [showApp, setShowApp] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay before showing app for smooth transition
    setTimeout(() => {
      setShowApp(true)
    }, 200)
  }

  return (
    <>
      {/* Loading screen */}
      {isLoading && <Loading onComplete={handleLoadingComplete} />}
      
      {/* Main app - only render after loading is complete */}
      {showApp && (
        <div
          style={{
            opacity: showApp ? 1 : 0,
            transition: 'opacity 0.6s ease-in',
            width: '100vw',
            height: '100vh'
          }}
        >
          <App />
        </div>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithLoading />
  </React.StrictMode>,
)