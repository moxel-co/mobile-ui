import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MenuState {
  // Selected items for each menu category
  selectedItems: Record<string, string | null>
  
  // Toggle states for settings items
  toggleStates: Record<string, boolean>
  
  // Current cube color
  cubeColor: string
  
  // Current environment preset
  environmentPreset: string
  
  // Actions
  setSelectedItem: (menuId: string, itemLabel: string | null) => void
  toggleSetting: (settingKey: string) => void
  getToggleState: (settingKey: string) => boolean
  getSelectedItem: (menuId: string) => string | null
  setCubeColor: (color: string) => void
  setEnvironmentPreset: (preset: string) => void
}

// Default toggle states for settings
const defaultToggleStates = {
  'auto-rotate': true,
  'show-grid': false,
  'debug-mode': false
}

export const useStore = create<MenuState>()(
  persist(
    (set, get) => ({
      selectedItems: {},
      toggleStates: defaultToggleStates,
      cubeColor: '#64ffda', // Default cyan color
      environmentPreset: 'studio', // Default environment preset
      
      setSelectedItem: (menuId: string, itemLabel: string | null) =>
        set((state) => ({
          selectedItems: {
            ...state.selectedItems,
            [menuId]: itemLabel
          }
        })),
      
      toggleSetting: (settingKey: string) =>
        set((state) => ({
          toggleStates: {
            ...state.toggleStates,
            [settingKey]: !state.toggleStates[settingKey]
          }
        })),
      
      getToggleState: (settingKey: string) => {
        const state = get()
        return state.toggleStates[settingKey] ?? false
      },
      
      getSelectedItem: (menuId: string) => {
        const state = get()
        return state.selectedItems[menuId] ?? null
      },
      
      setCubeColor: (color: string) =>
        set(() => ({
          cubeColor: color
        })),
      
      setEnvironmentPreset: (preset: string) =>
        set(() => ({
          environmentPreset: preset
        }))
    }),
    {
      name: 'mobile-menu-storage', // unique name for localStorage key
      partialize: (state) => ({
        selectedItems: state.selectedItems,
        toggleStates: state.toggleStates,
        cubeColor: state.cubeColor,
        environmentPreset: state.environmentPreset
      })
    }
  )
)