import { useState, useEffect } from 'react'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  userAgent: string
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: ''
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
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

      // Final determination
      const isMobile = isMobileUA || (isMobileScreen && hasTouchScreen)
      const isTablet = !isMobile && (isTabletScreen || (userAgent.includes('iPad')))
      const isDesktop = !isMobile && !isTablet

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        userAgent
      })
    }

    // Initial detection
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