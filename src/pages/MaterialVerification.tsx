import { useState, useEffect } from 'react'
import {
  FileCheck,
  FileX,
  FileQuestion,
  Share2,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  ScanLine,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import {
  getVerificationPoints,
  categoryConfig,
} from '../data/verificationPoints'
import type { BlockingPoint } from '../types'

function MaterialVerification() {
  const {
    currentService,
    materials,
    setMaterials,
    updateMaterialStatus,
    blockingPoints,
    addBlockingPoint,
    removeBlockingPoint,
  } = useAppContext()

  const [showProblemInput, setShowProblemInput] = useState<string | null>(null)
  const [problemText, setProblemText] = useState('')
  const [problemLevel, setProblemLevel] = useState<'warning' | 'critical'>('warning')

  // 当切换事项时，自动重置材料清单（只在材料为空时初始化，避免覆盖草稿）
  useEffect(() => {
    if (currentService && materials.length === 0) {
      setMaterials(
        currentService.requiredMaterials.map((m) => ({
          ...m,
          status: 'pending',
        }))
      )
    }
  }, [currentService, materials.length, setMaterials])

  const fetchSharedMaterial = (id: string) => {
    updateMaterialStatus(id, 'shared')
  }

  const fetchAllShared = () => {
    materials.forEach((m) => {
      if (m.isShared && m.status === 'pending') {
        updateMaterialStatus(m.id, 'shared')
      }
    })
  }

  const handleMarkMissing = (materialId: string, materialName: string) => {
    updateMaterialStatus(materialId, 'missing')
    // 自动同步到卡点列表（默认可补正级别）
    const newPoint: BlockingPoint = {
      id: `mat-${materialId}-${Date.now()}`,
      field: materialName,
      reason: '材料缺失，群众未提交该项材料',
      solution: `请补充提交「${materialName}」`,
      level: 'warning',
    }
    addBlockingPoint(newPoint)
  }

  const handleAddProblem = (materialId: string, materialName: string) => {
    if (!problemText.trim()) return

    const level = problemLevel
    const newPoint: BlockingPoint = {
      id: `mat-${materialId}-${Date.now()}`,
      field: materialName,
      reason: problemText,
      solution:
        level === 'warning'
          ? `请针对「${materialName}」补正：${problemText}`
          : `「${materialName}」存在问题：${problemText}，建议不予受理或转人工`,
      level,
    }
    addBlockingPoint(newPoint)

    if (level === 'critical') {
      updateMaterialStatus(materialId, 'missing', problemText)
    } else {
      updateMaterialStatus(materialId, 'waived', problemText)
    }

    setShowProblemInput(null)
    setProblemText('')
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; icon: any; color: string; bg: string }
    > = {
      pending: { label: '待调取', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
      shared: { label: '已共享', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
      submitted: { label: '已提交', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
      waived: { label: '容缺', icon: FileQuestion, color: 'text-amber-600', bg: 'bg-amber-100' },
      missing: { label: '缺失', icon: FileX, color: 'text-red-600', bg: 'bg-red-100' },
    }
    return statusMap[status] || statusMap.pending
  }

  const sharedCount = materials.filter((m) => m.status === 'shared').length
  const sharedTotal = materials.filter((m) => m.isShared).length
  const completionRate =
    materials.length > 0 ? Math.round((sharedCount / materials.length) * 100) : 0

  const verificationPoints = currentService
    ? getVerificationPoints(currentService.id)
    : []

  if (!currentService) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <ScanLine className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">请先在受理台选择办理事项</p>
          <p className="text-sm mt-2">选择事项后可进行材料核验</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧：材料列表 */}
      <div className="col-span-7 flex flex-col">
        {/* 进度卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white mb-4 shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">材料核验进度</h2>
              <p className="text-blue-100 text-sm mt-1">{currentService.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{completionRate}%</div>
              <div className="text-sm text-blue-100">
                {sharedCount}/{materials.length} 项已完成
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* 一键调取按钮 */}
        {sharedTotal > 0 && sharedCount < sharedTotal && (
          <button
            onClick={fetchAllShared}
            className="w-full mb-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>一键调取共享材料</span>
            <span className="px-2 py-0.5 text-xs bg-white/20 rounded">
              {sharedTotal - sharedCount}项待调
            </span>
          </button>
        )}

        {/* 已发现卡点提示 */}
        {blockingPoints.length > 0 && (
          <div className="mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">
                已发现 {blockingPoints.length} 个问题，已同步至智能建议
              </span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {blockingPoints.slice(0, 3).map((bp) => (
                <div key={bp.id} className="flex items-center justify-between text-sm">
                  <span className="text-amber-700">
                    {bp.level === 'critical' ? '❌' : '⚠️'} {bp.field}：{bp.reason}
                  </span>
                  <button
                    onClick={() => removeBlockingPoint(bp.id)}
                    className="p-0.5 text-amber-400 hover:text-amber-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {blockingPoints.length > 3 && (
                <div className="text-xs text-amber-500">另有 {blockingPoints.length - 3} 条问题...</div>
              )}
            </div>
          </div>
        )}

        {/* 材料列表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-800">申报材料清单</h3>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-slate-500">共享获取</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-slate-500">群众提交</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
            {materials.map((material) => {
              const statusInfo = getStatusInfo(material.status)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={material.id}
                  className={`p-4 border rounded-xl transition-all ${
                    material.status === 'shared'
                      ? 'border-green-200 bg-green-50/50'
                      : material.status === 'missing'
                      ? 'border-red-200 bg-red-50/50'
                      : material.status === 'waived'
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-slate-800">{material.name}</span>
                        {material.isRequired ? (
                          <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                            必需
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-500 rounded">
                            选填
                          </span>
                        )}
                        {material.isShared && (
                          <span className="px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-600 rounded flex items-center space-x-1">
                            <Share2 className="w-3 h-3" />
                            <span>可共享</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>
                          材料类型：
                          {material.type === 'certificate'
                            ? '证照类'
                            : material.type === 'form'
                            ? '表单类'
                            : '其他'}
                        </span>
                        {material.source && <span>数据来源：{material.source}</span>}
                        {material.sharedTime && <span>调取时间：{material.sharedTime}</span>}
                      </div>

                      {material.problem && (
                        <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-100">
                          <div className="flex items-start space-x-1 text-xs text-red-600">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>问题：{material.problem}</span>
                          </div>
                        </div>
                      )}

                      {showProblemInput === material.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={problemText}
                            onChange={(e) => setProblemText(e.target.value)}
                            placeholder="请描述发现的问题..."
                            className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={2}
                          />
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-1 text-xs">
                                <input
                                  type="radio"
                                  checked={problemLevel === 'warning'}
                                  onChange={() => setProblemLevel('warning')}
                                  className="text-amber-500"
                                />
                                <span className="text-amber-600">可补正</span>
                              </label>
                              <label className="flex items-center space-x-1 text-xs">
                                <input
                                  type="radio"
                                  checked={problemLevel === 'critical'}
                                  onChange={() => setProblemLevel('critical')}
                                  className="text-red-500"
                                />
                                <span className="text-red-600">不予受理</span>
                              </label>
                            </div>
                            <div className="flex-1" />
                            <button
                              onClick={() => setShowProblemInput(null)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleAddProblem(material.id, material.name)}
                              disabled={!problemText.trim()}
                              className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                              添加问题
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${statusInfo.bg} ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{statusInfo.label}</span>
                      </div>

                      {material.isShared && material.status === 'pending' && (
                        <button
                          onClick={() => fetchSharedMaterial(material.id)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="调取共享数据"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      {material.status === 'shared' && (
                        <button
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                          title="重新调取"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}

                      {material.status === 'pending' && (
                        <button
                          onClick={() => handleMarkMissing(material.id, material.name)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="标记为缺失"
                        >
                          <FileX className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProblemInput(showProblemInput === material.id ? null : material.id)
                          setProblemText('')
                          setProblemLevel('warning')
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          showProblemInput === material.id
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                        }`}
                        title="登记问题"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧：核验要点 */}
      <div className="col-span-5 flex flex-col space-y-4">
        {/* 共享提示卡片 */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800">数据共享提示</h3>
              <p className="text-sm text-emerald-700 mt-2">
                该事项共有 <span className="font-bold">{sharedTotal}</span> 项材料可通过数据共享获取，
                <span className="font-bold">无需</span>向群众索要复印件。
              </p>
              <ul className="mt-3 space-y-1.5">
                {materials
                  .filter((m) => m.isShared)
                  .map((m) => (
                    <li key={m.id} className="flex items-center space-x-2 text-sm text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{m.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 核验要点 - 跟随事项变化 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-medium text-slate-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span>{currentService.name} - 核验要点</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-500px)]">
            {verificationPoints.map((vp, index) => {
              const cat = categoryConfig[vp.category]
              return (
                <div key={vp.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-800 text-sm">{vp.title}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">{vp.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>复印留档</span>
          </button>
          <button className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2">
            <FileCheck className="w-4 h-4" />
            <span>核验通过</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaterialVerification
