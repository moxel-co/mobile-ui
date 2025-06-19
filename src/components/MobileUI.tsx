import React, { useState } from 'react'
import MobileMenu from './MobileMenu'
import { useStore } from '../store/useStore'
import './MobileUI.css'

function MobileUI() {
  const [activeOption, setActiveOption] = useState<string | null>(null) // Start with no active option
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string | null>(null)
  
  // Get toggle states, cube color, and environment preset from store for display
  const { getToggleState, cubeColor, environmentPreset } = useStore()

  return (
    <div className="mobile-ui">
      <div className="content-overlay">
        <h1 className="title">3D Mobile App</h1>
        {activeOption && (
          <p className="active-option">Active: {activeOption}</p>
        )}
        {activeSubmenuItem && (
          <p className="active-submenu-item">{activeSubmenuItem}</p>
        )}
        
        {/* Display current toggle states, cube color, and environment for debugging/info */}
        <div className="debug-info">
          <div>Cube Color: {cubeColor}</div>
          <div>Environment: {environmentPreset}</div>
          <div>Auto Rotate: {getToggleState('auto-rotate') ? 'ON' : 'OFF'}</div>
          <div>Show Grid: {getToggleState('show-grid') ? 'ON' : 'OFF'}</div>
          <div>Debug Mode: {getToggleState('debug-mode') ? 'ON' : 'OFF'}</div>
        </div>
      </div>
      <MobileMenu 
        activeOption={activeOption}
        onOptionChange={setActiveOption}
        activeSubmenuItem={activeSubmenuItem}
        onSubmenuItemChange={setActiveSubmenuItem}
      />
    </div>
  )
}

export default MobileUI