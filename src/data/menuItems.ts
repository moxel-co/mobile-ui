import { Box, RectangleHorizontal, Circle, Underline as Cylinder, Triangle, Diamond, Frame as Pyramid, Hexagon, Octagon as Pentagon, Brush as Torus, CircleEllipsis as Ellipsis, Square, SquareStack, Zap, Star, Heart, Bookmark, Flag, Target, Award, Shield, Settings, Wrench, PenTool as Tool, Palette, Sun, Moon, Sunrise, Trees, Building, MapPin, Sunset, CloudRain } from 'lucide-react'

export interface SubmenuItem {
  label: string
  icon: React.ComponentType<any>
  toggleable?: boolean
  settingKey?: string // Key for storing toggle state in Zustand
  colorValue?: string // For color items
  environmentPreset?: string // For environment presets
}

export interface MenuItem {
  id: string
  label: string
  submenu?: SubmenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    id: 'shapes',
    label: 'Shapes',
    submenu: [
      { label: 'Cube', icon: Box },
      { label: 'Cuboid', icon: RectangleHorizontal },
      { label: 'Sphere', icon: Circle },
      { label: 'Cylinder', icon: Cylinder },
      { label: 'Cone', icon: Triangle },
      { label: 'Square Pyramid', icon: Pyramid },
      { label: 'Triangular Pyramid', icon: Triangle },
      { label: 'Tetrahedron', icon: Diamond },
      { label: 'Triangular Prism', icon: Triangle },
      { label: 'Hexagonal Prism', icon: Hexagon },
      { label: 'Pentagonal Prism', icon: Pentagon },
      { label: 'Torus', icon: Torus },
      { label: 'Ellipsoid', icon: Ellipsis }
    ]
  },
  {
    id: 'colors',
    label: 'Colors',
    submenu: [
      { label: 'Cyan', icon: Palette, colorValue: '#64ffda' },
      { label: 'Red', icon: Palette, colorValue: '#ff6b6b' },
      { label: 'Blue', icon: Palette, colorValue: '#4dabf7' },
      { label: 'Green', icon: Palette, colorValue: '#51cf66' },
      { label: 'Purple', icon: Palette, colorValue: '#9775fa' },
      { label: 'Orange', icon: Palette, colorValue: '#ff922b' },
      { label: 'Pink', icon: Palette, colorValue: '#f783ac' },
      { label: 'Yellow', icon: Palette, colorValue: '#ffd43b' },
      { label: 'Teal', icon: Palette, colorValue: '#20c997' },
      { label: 'Indigo', icon: Palette, colorValue: '#748ffc' }
    ]
  },
  {
    id: 'lighting',
    label: 'Lighting',
    submenu: [
      { label: 'Studio', icon: Sun, environmentPreset: 'studio' },
      { label: 'City', icon: Building, environmentPreset: 'city' },
      { label: 'Dawn', icon: Sunrise, environmentPreset: 'dawn' },
      { label: 'Forest', icon: Trees, environmentPreset: 'forest' },
      { label: 'Lobby', icon: MapPin, environmentPreset: 'lobby' },
      { label: 'Park', icon: Trees, environmentPreset: 'park' },
      { label: 'Night', icon: Moon, environmentPreset: 'night' },
      { label: 'Sunset', icon: Sunset, environmentPreset: 'sunset' }
    ]
  },
  {
    id: 'option4',
    label: 'Option4',
    submenu: [
      { label: 'Target', icon: Target },
      { label: 'Award', icon: Award },
      { label: 'Shield', icon: Shield },
      { label: 'Diamond', icon: Diamond },
      { label: 'Star', icon: Star }
    ]
  },
  {
    id: 'option5',
    label: 'Option5',
    submenu: [
      { label: 'Zap', icon: Zap },
      { label: 'Heart', icon: Heart },
      { label: 'Target', icon: Target },
      { label: 'Award', icon: Award }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    submenu: [
      { label: 'Auto Rotate', icon: Settings, toggleable: true, settingKey: 'auto-rotate' },
      { label: 'Show Grid', icon: Wrench, toggleable: true, settingKey: 'show-grid' },
      { label: 'Debug Mode', icon: Tool, toggleable: true, settingKey: 'debug-mode' }
    ]
  }
]

// Helper functions for easy access
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id)
}

export const getSubmenuItems = (menuId: string): SubmenuItem[] => {
  const menuItem = getMenuItemById(menuId)
  return menuItem?.submenu || []
}

export const hasSubmenu = (menuId: string): boolean => {
  const menuItem = getMenuItemById(menuId)
  return !!(menuItem?.submenu && menuItem.submenu.length > 0)
}