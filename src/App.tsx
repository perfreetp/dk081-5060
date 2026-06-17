import { useState } from 'react'
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
} from 'lucide-react'
import AcceptanceDesk from './pages/AcceptanceDesk'
import MaterialVerification from './pages/MaterialVerification'
import SmartSuggestions from './pages/SmartSuggestions'
import ExceptionHandling from './pages/ExceptionHandling'
import ResultReceipt from './pages/ResultReceipt'
import { useAppContext } from './context/AppContext'

const tabs = [
  { id: 'acceptance', name: '受理台', icon: ClipboardList, color: 'from-blue-500 to-blue-600' },
  { id: 'verification', name: '材料核验', icon: FileCheck, color: 'from-green-500 to-green-600' },
  { id: 'suggestions', name: '智能建议', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
  { id: 'exception', name: '异常处置', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  { id: 'receipt', name: '结果回执', icon: Receipt, color: 'from-purple-500 to-purple-600' },
]

function App() {
  const [showNotices, setShowNotices] = useState(false)
  const { currentService, activeTab, setActiveTab } = useAppContext()

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
            {/* 搜索 */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="快速搜索事项..."
                className="w-64 h-8 pl-9 pr-3 text-sm bg-slate-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
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
