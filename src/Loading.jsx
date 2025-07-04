import React, { useState, useEffect, Suspense } from 'react';

// Your existing Loading component (unchanged)
import { useRef } from 'react' 
import { useTransition } from 'react';

// Icon paths to preload
const ICON_PATHS = [
    '/icons/base-wavy.png',
    '/icons/base-stripes.png',
    '/icons/base-classic.png',
];

function Loading({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const progressRef = useRef(0);
    const [isPending, startTransition] = useTransition();

    // Preload icons
    useEffect(() => {
        const preloadIcons = async () => {
            try {
                const promises = ICON_PATHS.map(path => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = path;
                    });
                });

                await Promise.all(promises);
                setIconsLoaded(true);
            } catch (error) {
                setIconsLoaded(true);
            }
        };

        preloadIcons();
    }, []);

    // Progress animation
    useEffect(() => {
        let rafId;
        const updateProgress = () => {
            const increment = iconsLoaded ? 2 : 0.5;
            progressRef.current += increment;
            
            const maxProgress = iconsLoaded ? 100 : 85;
            
            if (progressRef.current <= maxProgress) {
                setProgress(Math.min(progressRef.current, maxProgress));
                rafId = requestAnimationFrame(updateProgress);
            } else if (iconsLoaded && progressRef.current >= 100) {
                setProgress(100);
                setTimeout(() => {
                    onLoadingComplete?.();
                }, 500);
            }
        };

        startTransition(() => {
            rafId = requestAnimationFrame(updateProgress);
        });

        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [iconsLoaded, onLoadingComplete]);

    const safeProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('/loading-bg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#242424',
          zIndex: 1000,
          fontFamily: '"Outfit", sans-serif',
        }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ position: 'relative', width: '128px', height: '128px' }}>
          <img
            src="/sg60-jersey.svg"
            alt="Loading"
            style={{
              width: '100%',
              height: '100%',
              filter: 'grayscale(100%)',
              opacity: 0.5,
            }}
          />
          <img
            src="/sg60-jersey.svg"
            alt="Loading"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: `polygon(0 ${100 - safeProgress}%, 100% ${100 - safeProgress}%, 100% 100%, 0 100%)`,
            }}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginTop: '16px', 
          textAlign: 'center' 
        }}>
          <span 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
              marginBottom: '8px',
            }}
          >
            {Math.floor(safeProgress)}%
          </span>
          <div style={{ 
            fontWeight: '300',
            color: 'white'
          }}>
            {safeProgress < 85 ? 'Loading Assets...' :
              safeProgress < 100 ? 'Preparing Icons...' :
                'Ready!'}
          </div>
        </div>
      </div>
    );
}

// Your main App component
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Main App Content</h1>
      <p>This is your main application that loads after the loading screen.</p>
    </div>
  );
}

// Main component with transition logic
export default function AppWithTransition() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Start fade out animation
    setTimeout(() => {
      setShowLoading(false);
    }, 800); // Fade duration
  };

  return (
    <>
      {/* Loading overlay with fade transition */}
      {showLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            opacity: isLoading ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
            pointerEvents: isLoading ? 'auto' : 'none',
          }}
        >
          <Loading onLoadingComplete={handleLoadingComplete} />
        </div>
      )}
      
      {/* Main app content */}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.8s ease-in',
          transitionDelay: isLoading ? '0s' : '0.2s',
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </div>
    </>
  );
}