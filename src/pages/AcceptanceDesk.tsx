import { useState } from 'react'
import {
  Search,
  Star,
  StarOff,
  Zap,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  User,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  Save,
  Bookmark,
} from 'lucide-react'
import { mockServices, serviceCategories } from '../data/mockData'
import { useAppContext } from '../context/AppContext'

function AcceptanceDesk() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const {
    currentService,
    setCurrentService,
    applicant,
    isFavorite,
    toggleFavorite,
    blockingPoints,
    approvalResult,
  } = useAppContext()

  const filteredServices = mockServices.filter((s) => {
    const matchSearch = s.name.includes(searchQuery) || s.category.includes(searchQuery)
    const matchCategory = selectedCategory === '全部' || s.category === selectedCategory
    return matchSearch && matchCategory
  })

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(id)
  }

  const handleServiceSelect = (service: typeof mockServices[0]) => {
    setCurrentService(service)
  }

  const favoriteServices = mockServices.filter((s) => isFavorite(s.id))

  // 判断是否有进行中的办件
  const hasActiveDraft = currentService && (blockingPoints.length > 0 || approvalResult !== null)

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧：事项选择 */}
      <div className="col-span-5 flex flex-col">
        {/* 进行中办件提示 */}
        {hasActiveDraft && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Save className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-blue-800">进行中办件</span>
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">暂存</span>
                </div>
                <div className="text-sm text-blue-700 mt-0.5">
                  {currentService?.name} - 已自动保存草稿，切换回来可继续办理
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 搜索框 */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入事项名称、类别快速搜索..."
              className="w-full h-12 pl-12 pr-4 text-base bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {serviceCategories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 高频收藏 - 我的快捷区 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">我的快捷收藏</span>
            </div>
            <span className="text-xs text-slate-400">
              {favoriteServices.length} 个事项
            </span>
          </div>
          {favoriteServices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {favoriteServices.map((s) => (
                <div key={s.id} className="relative group">
                  <button
                    onClick={() => handleServiceSelect(s)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center space-x-2 ${
                      currentService?.id === s.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 hover:shadow-md'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{s.name}</span>
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(s.id, e)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="取消收藏"
                  >
                    <StarOff className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              点击事项旁边的 <Star className="w-3 h-3 inline text-amber-400" /> 收藏常用事项
            </div>
          )}
        </div>

        {/* 事项列表 */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-600">
              共 <span className="font-semibold text-blue-600">{filteredServices.length}</span> 个事项
            </span>
          </div>
          <div className="overflow-y-auto h-[calc(100%-48px)]">
            {filteredServices.map((service) => {
              const favorited = isFavorite(service.id)
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-blue-50/50 ${
                    currentService?.id === service.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-800">{service.name}</span>
                        {service.isSecondsApproval && (
                          <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded font-medium">
                            秒批
                          </span>
                        )}
                        {/* 搜索结果中也显示收藏状态 */}
                        {searchQuery && favorited && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span>{service.category}</span>
                        <span>·</span>
                        <span>{service.requiredMaterials.length}项材料</span>
                        <span>·</span>
                        <span>{service.freeCertificates.length}项免证</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleToggleFavorite(service.id, e)}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                          favorited ? '' : 'opacity-60 hover:opacity-100'
                        }`}
                        title={favorited ? '取消收藏' : '添加到我的快捷收藏'}
                      >
                        {favorited ? (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="w-4 h-4 text-slate-300 hover:text-amber-500" />
                        )}
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧：申请人信息 + 免证提示 */}
      <div className="col-span-7 flex flex-col space-y-4">
        {/* 申请人信息卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">申请人信息</span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-white/20 text-white rounded">
                已实名核验
              </span>
            </div>
          </div>
          {applicant ? (
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">姓名</div>
                    <div className="font-medium text-slate-800">{applicant.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">证件号码</div>
                    <div className="font-medium text-slate-800">{applicant.idNumber}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">联系电话</div>
                    <div className="font-medium text-slate-800">{applicant.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">住址</div>
                    <div className="font-medium text-slate-800 text-sm truncate">
                      {applicant.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>请刷身份证或输入申请人信息</p>
            </div>
          )}
        </div>

        {/* 选中事项的免证信息 */}
        {currentService ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white">免提交证照清单</span>
                  <span className="px-2 py-0.5 text-xs bg-white/20 text-white rounded ml-2">
                    {currentService.freeCertificates.length}项
                  </span>
                </div>
                {isFavorite(currentService.id) && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-white/20 rounded">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                    <span className="text-xs text-white">已收藏</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <span className="font-medium">温馨提示：</span>
                  以下证照可通过数据共享自动获取，无需群众提交纸质材料或复印件。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {currentService.freeCertificates.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-green-800 text-sm truncate">
                        {cert}
                      </div>
                      <div className="text-xs text-green-600">数据共享获取</div>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded flex-shrink-0">
                      免提交
                    </span>
                  </div>
                ))}
              </div>

              {/* 必核信息 */}
              <div className="mt-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>必核信息</span>
                </h3>
                <div className="space-y-2">
                  {currentService.checkPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-slate-600"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">请先选择办理事项</p>
              <p className="text-sm mt-2">选择事项后自动展示免提交证照清单</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AcceptanceDesk
