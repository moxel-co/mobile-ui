import React, { useRef, useState, useEffect } from 'react'
import { menuItems, getSubmenuItems, hasSubmenu } from '../data/menuItems'
import { useStore } from '../store/useStore'
import ColorCircle from './ColorCircle'
import './styles/MobileMenu.css'

function MobileMenu() {
  const [activeOption, setActiveOption] = useState<string | null>(null) // Start with no active option
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const submenuScrollRef = useRef<HTMLDivElement>(null!)
  const submenuContainerRef = useRef<HTMLDivElement>(null!)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [submenuStartX, setSubmenuStartX] = useState(0)
  const [isSubmenuDragging, setIsSubmenuDragging] = useState(false)
  const [showSubmenu, setShowSubmenu] = useState(false)

  // Zustand store actions and state
  const { setSelectedItem, toggleSetting, getToggleState, getSelectedItem, setCubeColor, setEnvironmentPreset, cubeColor, environmentPreset } = useStore()

  // Auto-scroll to active option - remove smooth scrolling
  useEffect(() => {
    if (activeOption && scrollRef.current) {
      const activeIndex = menuItems.findIndex(item => item.id === activeOption)
      if (activeIndex !== -1) {
        const container = scrollRef.current
        const item = container.children[activeIndex] as HTMLElement
        if (item) {
          const containerWidth = container.offsetWidth
          const itemLeft = item.offsetLeft
          const itemWidth = item.offsetWidth
          const scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2)
          
          // Remove smooth scrolling - instant scroll
          container.scrollLeft = scrollLeft
        }
      }
    }
  }, [activeOption])

  // Reset submenu selection when main option changes
  useEffect(() => {
    if (activeOption) {
      const currentSubmenuItems = getSubmenuItems(activeOption)
      if (currentSubmenuItems.length > 0) {
        // Check if we have a stored selection for this menu
        const storedSelection = getSelectedItem(activeOption)
        if (storedSelection && currentSubmenuItems.some(item => item.label === storedSelection)) {
          setActiveSubmenuItem(storedSelection)
        } else {
          // Default to first item if no stored selection or stored item doesn't exist
          const firstItem = currentSubmenuItems[0]
          setActiveSubmenuItem(firstItem.label)
          if (!firstItem.toggleable) {
            setSelectedItem(activeOption, firstItem.label)
            // If it's a color item, update the cube color
            if (firstItem.colorValue) {
              setCubeColor(firstItem.colorValue)
            }
            // If it's an environment preset, update the environment
            if (firstItem.environmentPreset) {
              setEnvironmentPreset(firstItem.environmentPreset)
            }
          }
        }
      } else {
        setActiveSubmenuItem(null)
      }
    } else {
      setActiveSubmenuItem(null)
    }
  }, [activeOption, getSelectedItem, setSelectedItem, setCubeColor, setEnvironmentPreset])

  // Update submenu scroll indicators and scrollable state
  useEffect(() => {
    if (submenuScrollRef.current && submenuContainerRef.current) {
      const container = submenuScrollRef.current
      const containerElement = submenuContainerRef.current
      const isScrollable = container.scrollWidth > container.clientWidth
      
      container.setAttribute('data-scrollable', isScrollable.toString())
      
      const updateScrollIndicators = () => {
        const canScrollLeft = container.scrollLeft > 0
        const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth)
        
        containerElement.setAttribute('data-can-scroll-left', canScrollLeft.toString())
        containerElement.setAttribute('data-can-scroll-right', canScrollRight.toString())
      }
      
      updateScrollIndicators()
      container.addEventListener('scroll', updateScrollIndicators)
      
      return () => {
        container.removeEventListener('scroll', updateScrollIndicators)
      }
    }
  }, [showSubmenu, activeOption])

  // Main navigation touch handlers - increase responsiveness
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentX = e.touches[0].clientX
    const diffX = startX - currentX
    
    if (scrollRef.current) {
      // Increase multiplier for more responsive scrolling
      scrollRef.current.scrollLeft += diffX * 1.2
    }
    
    setStartX(currentX)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const currentX = e.clientX
    const diffX = startX - currentX
    
    if (scrollRef.current) {
      // Increase multiplier for more responsive scrolling
      scrollRef.current.scrollLeft += diffX * 1.2
    }
    
    setStartX(currentX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Submenu touch handlers - increase responsiveness
  const handleSubmenuTouchStart = (e: React.TouchEvent) => {
    setSubmenuStartX(e.touches[0].clientX)
    setIsSubmenuDragging(true)
  }

  const handleSubmenuTouchMove = (e: React.TouchEvent) => {
    if (!isSubmenuDragging) return
    
    const currentX = e.touches[0].clientX
    const diffX = submenuStartX - currentX
    
    if (submenuScrollRef.current) {
      // Increase multiplier for more responsive scrolling
      submenuScrollRef.current.scrollLeft += diffX * 1.2
    }
    
    setSubmenuStartX(currentX)
  }

  const handleSubmenuTouchEnd = () => {
    setIsSubmenuDragging(false)
  }

  const handleSubmenuMouseDown = (e: React.MouseEvent) => {
    setSubmenuStartX(e.clientX)
    setIsSubmenuDragging(true)
  }

  const handleSubmenuMouseMove = (e: React.MouseEvent) => {
    if (!isSubmenuDragging) return
    
    const currentX = e.clientX
    const diffX = submenuStartX - currentX
    
    if (submenuScrollRef.current) {
      // Increase multiplier for more responsive scrolling
      submenuScrollRef.current.scrollLeft += diffX * 1.2
    }
    
    setSubmenuStartX(currentX)
  }

  const handleSubmenuMouseUp = () => {
    setIsSubmenuDragging(false)
  }

  const handleMainOptionClick = (optionId: string) => {
    if (optionId === activeOption && showSubmenu) {
      // If clicking the same active option and submenu is showing, deactivate everything
      setActiveOption(null)
      setShowSubmenu(false)
    } else {
      // Otherwise, activate the option and show submenu if it has items
      setActiveOption(optionId)
      const menuHasSubmenu = hasSubmenu(optionId)
      setShowSubmenu(menuHasSubmenu)
    }
  }

  const handleSubmenuItemClick = (item: { label: string; toggleable?: boolean; settingKey?: string; colorValue?: string; environmentPreset?: string }) => {
    if (item.toggleable && item.settingKey) {
      // Toggle the setting in the store
      toggleSetting(item.settingKey)
    } else if (activeOption) {
      // Regular selection behavior for non-toggleable items
      setActiveSubmenuItem(item.label)
      setSelectedItem(activeOption, item.label)
      
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

  const currentSubmenuItems = activeOption ? getSubmenuItems(activeOption) : []

  return (
    <div className="mobile-ui">
      {/* Mobile Menu */}
      <div className="mobile-menu">
        {showSubmenu && currentSubmenuItems.length > 0 && (
          <div 
            ref={submenuContainerRef}
            className="submenu-container"
          >
            <div 
              ref={submenuScrollRef}
              className="submenu-scroll"
              onTouchStart={handleSubmenuTouchStart}
              onTouchMove={handleSubmenuTouchMove}
              onTouchEnd={handleSubmenuTouchEnd}
              onMouseDown={handleSubmenuMouseDown}
              onMouseMove={handleSubmenuMouseMove}
              onMouseUp={handleSubmenuMouseUp}
              onMouseLeave={handleSubmenuMouseUp}
            >
              {currentSubmenuItems.map((item) => {
                const IconComponent = item.icon
                const isToggleable = item.toggleable
                const isToggled = isToggleable && item.settingKey ? getToggleState(item.settingKey) : false
                const isActive = !isToggleable && activeSubmenuItem === item.label
                
                return (
                  <div key={item.label} className="submenu-item-wrapper">
                    <div className="submenu-label">{item.label}</div>
                    <button
                      className={`submenu-item ${
                        isToggleable 
                          ? (isToggled ? 'toggled' : 'untoggled')
                          : (isActive ? 'active' : 'inactive')
                      }`}
                      onClick={() => handleSubmenuItemClick(item)}
                      style={
                        item.colorValue && isActive
                          ? { backgroundColor: item.colorValue }
                          : {}
                      }
                    >
                      {item.colorValue ? (
                        <ColorCircle color={item.colorValue} size={20} className="submenu-icon" />
                      ) : (
                        <IconComponent className="submenu-icon" size={20} />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        <div
          ref={scrollRef}
          className="nav-scroll-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {menuItems.map((menuItem) => {
            const IconComponent = getMenuItemIcon(menuItem)
            return (
              <button
                key={menuItem.id}
                className={`nav-item ${activeOption === menuItem.id ? 'active' : 'inactive'}`}
                onClick={() => handleMainOptionClick(menuItem.id)}
              >
                <IconComponent className="nav-icon" size={16} />
                <span className="nav-label">{menuItem.label}</span>
                {activeOption === menuItem.id && <div className="active-indicator" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileMenu