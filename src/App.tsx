import { useState, useEffect, useRef } from 'react'
import {
  ClipboardList,
  FileCheck,
  Lightbulb,
  AlertTriangle,
  Receipt,
  Star,
  Bell,
  Search,
  User,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react'
import AcceptanceDesk from './pages/AcceptanceDesk'
import MaterialVerification from './pages/MaterialVerification'
import SmartSuggestions from './pages/SmartSuggestions'
import ExceptionHandling from './pages/ExceptionHandling'
import ResultReceipt from './pages/ResultReceipt'
import { useAppContext } from './context/AppContext'
import { mockServices } from './data/mockData'
import type { ServiceItem } from './types'

const tabs = [
  { id: 'acceptance', name: '受理台', icon: ClipboardList, color: 'from-blue-500 to-blue-600' },
  { id: 'verification', name: '材料核验', icon: FileCheck, color: 'from-green-500 to-green-600' },
  { id: 'suggestions', name: '智能建议', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
  { id: 'exception', name: '异常处置', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  { id: 'receipt', name: '结果回执', icon: Receipt, color: 'from-purple-500 to-purple-600' },
]

function App() {
  const [showNotices, setShowNotices] = useState(false)
  const { currentService, setCurrentService, activeTab, setActiveTab, isFavorite, toggleFavorite } =
    useAppContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredServices = searchQuery.trim()
    ? mockServices.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleServiceSelect = (service: ServiceItem) => {
    setCurrentService(service)
    setActiveTab('acceptance')
    setSearchQuery(service.name)
    setShowSearchDropdown(false)
  }

  const handleToggleFavorite = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(serviceId)
  }

  // 点击外部关闭搜索下拉
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'acceptance':
        return <AcceptanceDesk />
      case 'verification':
        return <MaterialVerification />
      case 'suggestions':
        return <SmartSuggestions />
      case 'exception':
        return <ExceptionHandling />
      case 'receipt':
        return <ResultReceipt />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* 左侧导航 */}
      <div className="w-60 bg-gradient-to-b from-gov-dark to-slate-800 text-white flex flex-col">
        {/* Logo区域 */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gov-red to-red-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-gov-gold" />
            </div>
            <div>
              <div className="font-bold text-base">政务受理助手</div>
              <div className="text-xs text-slate-400">综合窗口版</div>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/20`
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{tab.name}</span>
              </button>
            )
          })}
        </nav>

        {/* 底部用户信息 */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">王 办事员</div>
              <div className="text-xs text-slate-400 truncate">综合窗口 03号</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部标题栏 */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-slate-800">
              {tabs.find((t) => t.id === activeTab)?.name}
            </h1>
            {currentService && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">/</span>
                <span className="text-sm text-slate-600">{currentService.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* 顶部快速搜索 */}
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchDropdown(true)
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="快速搜索事项..."
                  className="w-72 h-8 pl-9 pr-3 text-sm bg-slate-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setShowSearchDropdown(false)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 搜索结果下拉 */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden">
                  {filteredServices.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                        <span className="text-xs text-slate-500">
                          找到 {filteredServices.length} 个事项
                        </span>
                      </div>
                      {filteredServices.map((service) => {
                        const favorited = isFavorite(service.id)
                        return (
                          <div
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                          >
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-sm text-slate-800 truncate">
                                    {service.name}
                                  </span>
                                  {service.isSecondsApproval && (
                                    <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded flex items-center space-x-0.5 flex-shrink-0">
                                      <Zap className="w-2.5 h-2.5" />
                                      <span>秒批</span>
                                    </span>
                                  )}
                                  {favorited && (
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-xs text-slate-400">{service.category}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => handleToggleFavorite(service.id, e)}
                                className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                                  favorited ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                                }`}
                                title={favorited ? '取消收藏' : '收藏事项'}
                              >
                                {favorited ? (
                                  <Star className="w-4 h-4 fill-amber-500" />
                                ) : (
                                  <Star className="w-4 h-4" />
                                )}
                              </button>
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-400">未找到相关事项</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 通知 */}
            <button
              onClick={() => setShowNotices(!showNotices)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          <div key={activeTab} className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
