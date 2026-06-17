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
import { mockApplicant, mockServices } from '../data/mockData'

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
const CURRENT_SERVICE_KEY = 'gov_service_current_service_id'

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
  // 初始化时从 localStorage 读取最后选中的事项
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_SERVICE_KEY)
  })

  // 根据 serviceId 从 mockServices 中找到完整的事项对象
  const currentService = currentServiceId
    ? mockServices.find((s) => s.id === currentServiceId) || null
    : null

  const setCurrentService = (service: ServiceItem | null) => {
    if (service) {
      setCurrentServiceId(service.id)
    } else {
      setCurrentServiceId(null)
    }
  }

  // 保存当前事项ID到 localStorage
  useEffect(() => {
    if (currentServiceId) {
      localStorage.setItem(CURRENT_SERVICE_KEY, currentServiceId)
    } else {
      localStorage.removeItem(CURRENT_SERVICE_KEY)
    }
  }, [currentServiceId])

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

  // 切换事项时加载对应草稿
  useEffect(() => {
    if (!currentService) {
      setReceiptDraft(null)
      return
    }

    const storageKey = DRAFT_STORAGE_PREFIX + currentService.id
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)

        // 恢复各状态
        if (parsed.receiptDraft) {
          setReceiptDraft(parsed.receiptDraft)
        } else {
          setReceiptDraft(getDefaultReceiptDraft())
        }

        if (Array.isArray(parsed.materials) && parsed.materials.length > 0) {
          setMaterials(parsed.materials)
        } else {
          // 从当前事项初始化材料列表
          setMaterials(
            currentService.requiredMaterials.map((m) => ({
              ...m,
              status: 'pending',
            }))
          )
        }

        if (Array.isArray(parsed.blockingPoints)) {
          setBlockingPoints(parsed.blockingPoints)
        } else {
          setBlockingPoints([])
        }

        if (parsed.approvalResult) {
          setApprovalResult(parsed.approvalResult)
        } else {
          setApprovalResult(null)
        }

        if (Array.isArray(parsed.correctionSuggestions)) {
          setCorrectionSuggestions(parsed.correctionSuggestions)
        } else {
          setCorrectionSuggestions([])
        }
      } catch (e) {
        console.error('Failed to load draft:', e)
        setReceiptDraft(getDefaultReceiptDraft())
        // 初始化默认材料列表
        setMaterials(
          currentService.requiredMaterials.map((m) => ({
            ...m,
            status: 'pending',
          }))
        )
        setBlockingPoints([])
        setApprovalResult(null)
        setCorrectionSuggestions([])
      }
    } else {
      // 新事项，初始化
      setReceiptDraft(getDefaultReceiptDraft())
      setMaterials(
        currentService.requiredMaterials.map((m) => ({
          ...m,
          status: 'pending',
        }))
      )
      setBlockingPoints([])
      setApprovalResult(null)
      setCorrectionSuggestions([])
    }
  }, [currentService])

  // 自动保存草稿
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
  }, [
    currentService,
    receiptDraft,
    materials,
    blockingPoints,
    approvalResult,
    correctionSuggestions,
  ])

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

    // 卡点ID格式: mat-{materialId}-{timestamp}
    // 如果是材料相关的卡点，恢复对应材料的状态
    if (pointId.startsWith('mat-')) {
      const parts = pointId.split('-')
      // parts: ['mat', materialId, timestamp...]
      // materialId 可能是带破折号的（如 'cp1-1'），所以需要重新组合
      const matParts = parts.slice(1, parts.length - 1) // 去掉 'mat' 和最后的 timestamp
      const materialId = matParts.join('-') || parts[1] // fallback
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === materialId
            ? { ...m, status: 'pending', problem: undefined, sharedTime: m.sharedTime }
            : m
        )
      )
    }
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
