import { useState, useEffect } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  userAgent: string
}

// Immediate device detection function that works synchronously
function getImmediateDeviceInfo(): DeviceInfo {
  // Default to mobile-first approach for safety
  if (typeof window === 'undefined') {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenWidth: 0,
      screenHeight: 0,
      userAgent: ''
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const userAgent = navigator.userAgent

  // Mobile detection based on user agent and screen size
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileUA = mobileRegex.test(userAgent)
  
  // Screen size based detection
  const isMobileScreen = width <= 768
  const isTabletScreen = width > 768 && width <= 1024
  const isDesktopScreen = width > 1024

  // Touch capability detection
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Final determination - be more aggressive about mobile detection
  const isMobile = isMobileUA || isMobileScreen || (hasTouchScreen && width <= 1024)
  const isTablet = !isMobile && (isTabletScreen || (userAgent.includes('iPad')))
  const isDesktop = !isMobile && !isTablet && isDesktopScreen

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: width,
    screenHeight: height,
    userAgent
  }
}

export function useDeviceDetection(): DeviceInfo {
  // Initialize with immediate detection to prevent flash
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getImmediateDeviceInfo())

  useEffect(() => {
    const updateDeviceInfo = () => {
      const newDeviceInfo = getImmediateDeviceInfo()
      setDeviceInfo(newDeviceInfo)
    }

    // Update immediately on mount
    updateDeviceInfo()

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDeviceInfo, 100)
    })

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}