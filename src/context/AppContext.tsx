import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type {
  ServiceItem,
  Applicant,
  BlockingPoint,
  MaterialWithStatus,
  CorrectionItem,
  RejectReasonItem,
  ReceiptDraft,
} from '../types'
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
  addBlockingPoint: (point: BlockingPoint) => void
  removeBlockingPoint: (pointId: string) => void
  correctionSuggestions: string[]
  setCorrectionSuggestions: (suggestions: string[]) => void
  approvalResult: 'seconds' | 'manual' | 'reject' | 'correction' | null
  setApprovalResult: (result: 'seconds' | 'manual' | 'reject' | 'correction' | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void

  materials: MaterialWithStatus[]
  setMaterials: (materials: MaterialWithStatus[]) => void
  updateMaterialStatus: (materialId: string, status: MaterialWithStatus['status'], problem?: string) => void

  receiptDraft: ReceiptDraft | null
  setReceiptDraft: (draft: ReceiptDraft | null) => void
  setReceiptType: (type: 'accept' | 'correction' | 'reject') => void
  setReceiptGenerated: (generated: boolean) => void
  updateCorrectionItems: (items: CorrectionItem[]) => void
  updateRejectReasons: (items: RejectReasonItem[]) => void
  setCustomRejectReason: (reason: string) => void
  addCustomCorrection: (item: string) => void
  removeCustomCorrection: (index: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'gov_service_favorites'
const DRAFT_STORAGE_PREFIX = 'gov_service_draft_'

function getDefaultReceiptDraft(): ReceiptDraft {
  return {
    receiptType: 'accept',
    generated: false,
    correctionItems: [],
    rejectReasons: [],
    customRejectReason: '',
    customCorrections: [],
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentService, setCurrentService] = useState<ServiceItem | null>(null)
  const [applicant, setApplicant] = useState<Applicant | null>(mockApplicant)
  const [favorites, setFavorites] = useState<string[]>([])
  const [blockingPoints, setBlockingPoints] = useState<BlockingPoint[]>([])
  const [correctionSuggestions, setCorrectionSuggestions] = useState<string[]>([])
  const [approvalResult, setApprovalResult] = useState<'seconds' | 'manual' | 'reject' | 'correction' | null>(null)
  const [activeTab, setActiveTab] = useState<string>('acceptance')

  const [materials, setMaterials] = useState<MaterialWithStatus[]>([])

  const [receiptDraft, setReceiptDraft] = useState<ReceiptDraft | null>(null)

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

  // 切换事项时：
  // 1. 先暂存当前事项的草稿（如果有的话）
  // 2. 加载新事项的草稿（如果之前暂存过）
  // 3. 重置该事项特有的状态
  useEffect(() => {
    const prevServiceId = (() => {
      // 尝试从当前状态推断旧的事项 ID
      if (receiptDraft) return undefined
      return undefined
    })()

    // 清空当前事项的相关状态
    setBlockingPoints([])
    setCorrectionSuggestions([])
    setApprovalResult(null)
    setMaterials([])

    if (currentService) {
      // 加载该事项的草稿
      const storageKey = DRAFT_STORAGE_PREFIX + currentService.id
      const storedDraft = localStorage.getItem(storageKey)
      if (storedDraft) {
        try {
          const parsed = JSON.parse(storedDraft)
          setReceiptDraft(parsed)
          if (parsed.materials) {
            setMaterials(parsed.materials)
          }
          if (parsed.blockingPoints) {
            setBlockingPoints(parsed.blockingPoints)
          }
          if (parsed.approvalResult) {
            setApprovalResult(parsed.approvalResult)
          }
          if (parsed.correctionSuggestions) {
            setCorrectionSuggestions(parsed.correctionSuggestions)
          }
        } catch (e) {
          console.error('Failed to load draft:', e)
          setReceiptDraft(getDefaultReceiptDraft())
        }
      } else {
        setReceiptDraft(getDefaultReceiptDraft())
      }
    } else {
      setReceiptDraft(null)
    }
  }, [currentService])

  // 当有当前事项时，自动暂存草稿
  useEffect(() => {
    if (!currentService) return

    const storageKey = DRAFT_STORAGE_PREFIX + currentService.id
    const toSave = {
      receiptDraft,
      materials,
      blockingPoints,
      approvalResult,
      correctionSuggestions,
      savedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(toSave))
    } catch (e) {
      console.error('Failed to save draft:', e)
    }
  }, [currentService, receiptDraft, materials, blockingPoints, approvalResult, correctionSuggestions])

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const isFavorite = (serviceId: string) => {
    return favorites.includes(serviceId)
  }

  const addBlockingPoint = (point: BlockingPoint) => {
    setBlockingPoints((prev) => [...prev, point])
  }

  const removeBlockingPoint = (pointId: string) => {
    setBlockingPoints((prev) => prev.filter((p) => p.id !== pointId))
  }

  const updateMaterialStatus = (
    materialId: string,
    status: MaterialWithStatus['status'],
    problem?: string
  ) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, status, sharedTime: status === 'shared' ? new Date().toLocaleTimeString() : m.sharedTime, problem }
          : m
      )
    )
  }

  const setReceiptType = (type: 'accept' | 'correction' | 'reject') => {
    setReceiptDraft((prev) => (prev ? { ...prev, receiptType: type, generated: false } : null))
  }

  const setReceiptGenerated = (generated: boolean) => {
    setReceiptDraft((prev) => (prev ? { ...prev, generated } : null))
  }

  const updateCorrectionItems = (items: CorrectionItem[]) => {
    setReceiptDraft((prev) => (prev ? { ...prev, correctionItems: items } : null))
  }

  const updateRejectReasons = (items: RejectReasonItem[]) => {
    setReceiptDraft((prev) => (prev ? { ...prev, rejectReasons: items } : null))
  }

  const setCustomRejectReason = (reason: string) => {
    setReceiptDraft((prev) => (prev ? { ...prev, customRejectReason: reason } : null))
  }

  const addCustomCorrection = (item: string) => {
    setReceiptDraft((prev) =>
      prev ? { ...prev, customCorrections: [...prev.customCorrections, item] } : null
    )
  }

  const removeCustomCorrection = (index: number) => {
    setReceiptDraft((prev) =>
      prev
        ? { ...prev, customCorrections: prev.customCorrections.filter((_, i) => i !== index) }
        : null
    )
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
        addBlockingPoint,
        removeBlockingPoint,
        correctionSuggestions,
        setCorrectionSuggestions,
        approvalResult,
        setApprovalResult,
        activeTab,
        setActiveTab,
        materials,
        setMaterials,
        updateMaterialStatus,
        receiptDraft,
        setReceiptDraft,
        setReceiptType,
        setReceiptGenerated,
        updateCorrectionItems,
        updateRejectReasons,
        setCustomRejectReason,
        addCustomCorrection,
        removeCustomCorrection,
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
