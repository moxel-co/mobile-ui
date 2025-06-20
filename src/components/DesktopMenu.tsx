import React, { useState } from 'react'
import { menuItems, getSubmenuItems } from '../data/menuItems'
import { useStore } from '../store/useStore'
import { ChevronDown } from 'lucide-react'
import './styles/DesktopMenu.css'

function DesktopMenu() {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  
  // Zustand store actions and state
  const { 
    setSelectedItem, 
    toggleSetting, 
    getToggleState, 
    getSelectedItem, 
    setCubeColor, 
    setEnvironmentPreset 
  } = useStore()

  const handleMainMenuClick = (menuId: string) => {
    const newExpandedMenus = new Set(expandedMenus)
    
    if (expandedMenus.has(menuId)) {
      // Collapse the menu
      newExpandedMenus.delete(menuId)
    } else {
      // Expand the menu
      newExpandedMenus.add(menuId)
    }
    
    setExpandedMenus(newExpandedMenus)
  }

  const handleSubmenuItemClick = (
    menuId: string,
    item: { 
      label: string
      toggleable?: boolean
      settingKey?: string
      colorValue?: string
      environmentPreset?: string 
    }
  ) => {
    if (item.toggleable && item.settingKey) {
      // Toggle the setting in the store
      toggleSetting(item.settingKey)
    } else {
      // Regular selection behavior for non-toggleable items
      setSelectedItem(menuId, item.label)
      
      // If it's a color item, update the cube color
      if (item.colorValue) {
        setCubeColor(item.colorValue)
      }
      
      // If it's an environment preset, update the environment
      if (item.environmentPreset) {
        setEnvironmentPreset(item.environmentPreset)
      }
    }
  }

  // Helper function to get the icon for a menu item
  const getMenuItemIcon = (menuItem: typeof menuItems[0]) => {
    const selectedItem = getSelectedItem(menuItem.id)
    
    if (selectedItem) {
      // Find the selected submenu item and use its icon
      const submenuItems = getSubmenuItems(menuItem.id)
      const selectedSubmenuItem = submenuItems.find(item => item.label === selectedItem)
      if (selectedSubmenuItem) {
        return selectedSubmenuItem.icon
      }
    }
    
    // Fallback to the main menu item icon
    return menuItem.icon
  }

  return (
    <div className="desktop-menu">
      <div className="desktop-menu-header">
        <h2 className="desktop-menu-title">3D Controls</h2>
        <p className="desktop-menu-subtitle">Customize your 3D experience</p>
      </div>

      <div className="desktop-menu-content">
        {menuItems.map((menuItem) => {
          const submenuItems = getSubmenuItems(menuItem.id)
          const hasSubmenu = submenuItems.length > 0
          const isExpanded = expandedMenus.has(menuItem.id)
          const selectedItem = getSelectedItem(menuItem.id)
          const IconComponent = getMenuItemIcon(menuItem)

          return (
            <div key={menuItem.id} className="desktop-menu-item">
              <button
                className={`desktop-menu-button ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleMainMenuClick(menuItem.id)}
                disabled={!hasSubmenu}
              >
                <div className="desktop-menu-button-content">
                  <div className="desktop-menu-button-main">
                    <IconComponent className="desktop-menu-icon" size={18} />
                    <span className="desktop-menu-button-label">{menuItem.label}</span>
                  </div>
                  {selectedItem && (
                    <span className="desktop-menu-button-selected">• {selectedItem}</span>
                  )}
                </div>
                {hasSubmenu && (
                  <ChevronDown 
                    size={16} 
                    className={`desktop-menu-chevron ${isExpanded ? 'rotated' : ''}`}
                  />
                )}
              </button>

              {hasSubmenu && isExpanded && (
                <div className="desktop-submenu">
                  <div className="desktop-submenu-content">
                    <div className="desktop-submenu-grid">
                      {submenuItems.map((item) => {
                        const IconComponent = item.icon
                        const isToggleable = item.toggleable
                        const isToggled = isToggleable && item.settingKey ? getToggleState(item.settingKey) : false
                        const isSelected = !isToggleable && selectedItem === item.label

                        return (
                          <button
                            key={item.label}
                            className={`desktop-submenu-item ${
                              isToggleable 
                                ? (isToggled ? 'toggled' : 'untoggled')
                                : (isSelected ? 'selected' : '')
                            }`}
                            onClick={() => handleSubmenuItemClick(menuItem.id, item)}
                            style={
                              item.colorValue && isSelected
                                ? { borderColor: item.colorValue, boxShadow: `0 0 12px ${item.colorValue}40` }
                                : {}
                            }
                          >
                            <div className="desktop-submenu-item-icon">
                              <IconComponent size={20} />
                            </div>
                            
                            {/* Tooltip with label */}
                            <div className="desktop-submenu-item-tooltip">
                              {item.label}
                            </div>

                            {/* Selected indicator for regular items */}
                            {isSelected && !isToggleable && (
                              <div className="desktop-selected-indicator">✓</div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="desktop-menu-footer">
        <p className="desktop-menu-info">
          Interact with the 3D scene using your mouse to rotate and explore
        </p>
      </div>
    </div>
  )
}

export default DesktopMenu