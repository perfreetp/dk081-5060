import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ServiceItem, Applicant, BlockingPoint } from '../types'
import { mockApplicant } from '../data/mockData'

interface AppContextType {
  currentService: ServiceItem | null
  setCurrentService: (service: ServiceItem | null) => void
  applicant: Applicant | null
  setApplicant: (applicant: Applicant | null) => void
  favorites: string[]
  toggleFavorite: (serviceId: string) => void
  isFavorite: (serviceId: string) => boolean
  blockingPoints: BlockingPoint[]
  setBlockingPoints: (points: BlockingPoint[]) => void
  correctionSuggestions: string[]
  setCorrectionSuggestions: (suggestions: string[]) => void
  approvalResult: 'seconds' | 'manual' | 'reject' | 'correction' | null
  setApprovalResult: (result: 'seconds' | 'manual' | 'reject' | 'correction' | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'gov_service_favorites'

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentService, setCurrentService] = useState<ServiceItem | null>(null)
  const [applicant, setApplicant] = useState<Applicant | null>(mockApplicant)
  const [favorites, setFavorites] = useState<string[]>([])
  const [blockingPoints, setBlockingPoints] = useState<BlockingPoint[]>([])
  const [correctionSuggestions, setCorrectionSuggestions] = useState<string[]>([])
  const [approvalResult, setApprovalResult] = useState<'seconds' | 'manual' | 'reject' | 'correction' | null>(null)
  const [activeTab, setActiveTab] = useState<string>('acceptance')

  // 从 localStorage 加载收藏
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    }
  }, [])

  // 保存收藏到 localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  // 切换事项时重置相关状态
  useEffect(() => {
    setBlockingPoints([])
    setCorrectionSuggestions([])
    setApprovalResult(null)
  }, [currentService])

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const isFavorite = (serviceId: string) => {
    return favorites.includes(serviceId)
  }

  return (
    <AppContext.Provider
      value={{
        currentService,
        setCurrentService,
        applicant,
        setApplicant,
        favorites,
        toggleFavorite,
        isFavorite,
        blockingPoints,
        setBlockingPoints,
        correctionSuggestions,
        setCorrectionSuggestions,
        approvalResult,
        setApprovalResult,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
