import React, { useState } from 'react'
import { RotateCcw, Eye, Share2, HelpCircle } from 'lucide-react'
import './FloatingUI.css'

interface FloatingUIProps {
  visible: boolean
  onResetView: () => void
  onShowcaseView: () => void
  onShareSocial: () => void
}

function FloatingUI({ visible, onResetView, onShowcaseView, onShareSocial }: FloatingUIProps) {
  const [showTooltips, setShowTooltips] = useState(false)

  const handleResetView = () => {
    console.log('Reset view clicked - Resets the 3D camera to its default position')
    onResetView()
  }

  const handleShowcaseView = () => {
    console.log('Showcase view clicked - Sets the camera to an optimal viewing angle')
    onShowcaseView()
  }

  const handleShareSocial = () => {
    console.log('Share social media clicked - Opens sharing options for social media')
    onShareSocial()
  }

  const handleHelpToggle = () => {
    console.log('Help clicked - Toggling tooltips visibility')
    setShowTooltips(!showTooltips)
  }

  return (
    <div className={`floating-ui ${visible ? 'visible' : 'hidden'}`}>
      {/* Menu items - always visible when parent is visible */}
      <div className="floating-ui-items">
        <div className="floating-ui-item-container">
          <button 
            className="floating-ui-item"
            onClick={handleResetView}
            aria-label="Reset view"
            title="Reset view"
          >
            <RotateCcw size={10} className="floating-ui-icon" />
          </button>
          {showTooltips && (
            <div className="tooltip">
              Reset camera to default position
            </div>
          )}
        </div>
        
        <div className="floating-ui-item-container">
          <button 
            className="floating-ui-item"
            onClick={handleShowcaseView}
            aria-label="Showcase view"
            title="Showcase view"
          >
            <Eye size={10} className="floating-ui-icon" />
          </button>
          {showTooltips && (
            <div className="tooltip">
              Set optimal viewing angle
            </div>
          )}
        </div>
        
        <div className="floating-ui-item-container">
          <button 
            className="floating-ui-item"
            onClick={handleShareSocial}
            aria-label="Share social media"
            title="Share social media"
          >
            <Share2 size={10} className="floating-ui-icon" />
          </button>
          {showTooltips && (
            <div className="tooltip">
              Share on social media
            </div>
          )}
        </div>

        <div className="floating-ui-item-container">
          <button 
            className={`floating-ui-item help-button ${showTooltips ? 'active' : ''}`}
            onClick={handleHelpToggle}
            aria-label="Help"
            title="Help"
          >
            <HelpCircle size={10} className="floating-ui-icon" />
          </button>
          {showTooltips && (
            <div className="tooltip">
              Click to hide help tooltips
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FloatingUI