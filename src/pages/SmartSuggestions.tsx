import { useState, useEffect } from 'react'
import {
  Lightbulb,
  Zap,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  ThumbsUp,
  ArrowRight,
  UserX,
  Users,
  Edit3,
  ClipboardList,
  AlertOctagon,
  ArrowLeftRight,
  X,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import {
  approvalRules,
  generateMockApprovalResult,
  determineSuggestionType,
} from '../data/approvalRules'
import type { BlockingPoint } from '../types'

type SuggestionType = 'seconds' | 'correction' | 'manual' | 'reject' | null

function SmartSuggestions() {
  const {
    currentService,
    blockingPoints,
    setBlockingPoints,
    correctionSuggestions,
    setCorrectionSuggestions,
    approvalResult,
    setApprovalResult,
    setActiveTab,
    removeBlockingPoint,
  } = useAppContext()

  const goToReceipt = () => {
    setActiveTab('receipt')
  }

  const goToMaterialVerification = () => {
    setActiveTab('verification')
  }

  const goToExceptionHandling = () => {
    setActiveTab('exception')
  }
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [runSecondsApproval, setRunSecondsApproval] = useState(false)
  const [suggestionType, setSuggestionType] = useState<SuggestionType>(null)

  // 根据全部卡点实时计算建议类型
  useEffect(() => {
    if (blockingPoints.length > 0) {
      const type = determineSuggestionType(blockingPoints)
      setSuggestionType(type)
      // 同步更新补正建议（只取 correction 类型）
      const suggestions = blockingPoints
        .filter((bp) => bp.suggestionType === 'correction' && bp.solution)
        .map((bp) => bp.solution)
      setCorrectionSuggestions(suggestions)
    } else if (!runSecondsApproval) {
      setSuggestionType(null)
    }
  }, [blockingPoints, runSecondsApproval, setCorrectionSuggestions])

  // 切换事项时重置秒批状态（但保留材料登记的卡点）
  useEffect(() => {
    setRunSecondsApproval(false)
    setSuggestionType(null)
  }, [currentService])

  const handleRunApproval = () => {
    if (!currentService) return

    // 根据事项ID生成对应的核验结果
    const detectionPoints = generateMockApprovalResult(currentService.id)

    // 合并：保留手工登记的，替换检测来源的（按 id 去重）
    const manualPoints = blockingPoints.filter((bp) => bp.source === 'manual')
    const merged = [...detectionPoints, ...manualPoints]
    setBlockingPoints(merged)

    const type = determineSuggestionType(merged)
    setSuggestionType(type)
    setApprovalResult(type)

    const suggestions = merged
      .filter((bp) => bp.suggestionType === 'correction' && bp.solution)
      .map((bp) => bp.solution)
    setCorrectionSuggestions(suggestions)

    setRunSecondsApproval(true)
  }

  const handleGenerateCorrectionNotice = () => {
    setApprovalResult('correction')
    goToReceipt()
  }

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: XCircle,
          iconColor: 'text-red-500',
          text: 'text-red-700',
          label: '不通过',
        }
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          text: 'text-amber-700',
          label: '待核实',
        }
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-500',
          text: 'text-green-700',
          label: '通过',
        }
    }
  }

  const getSuggestionTypeInfo = (type: SuggestionType) => {
    const typeMap = {
      seconds: {
        label: '秒批通过',
        icon: Zap,
        bg: 'bg-green-500',
        text: 'text-green-700',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        description: '所有核验点通过，可直接秒批',
      },
      correction: {
        label: '材料补正',
        icon: Edit3,
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        lightBg: 'bg-amber-50',
        border: 'border-amber-200',
        description: '存在可补正的问题，建议先补正再受理',
      },
      manual: {
        label: '转人工受理',
        icon: Users,
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200',
        description: '存在需人工核实的情况，建议转人工窗口受理',
      },
      reject: {
        label: '不予受理',
        icon: UserX,
        bg: 'bg-red-500',
        text: 'text-red-700',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        description: '存在不符合受理条件的问题，建议不予受理',
      },
    }
    return type ? typeMap[type] : null
  }

  // 获取该事项的核验规则说明
  const getRuleDescription = () => {
    if (!currentService) return null
    const rule = approvalRules.find((r) => r.serviceId === currentService.id)
    return rule
  }

  const criticalCount = blockingPoints.filter((bp) => bp.level === 'critical').length
  const warningCount = blockingPoints.filter((bp) => bp.level === 'warning').length
  const passCount = blockingPoints.filter((bp) => bp.level === 'info').length
  const manualCount = blockingPoints.filter((bp) => bp.suggestionType === 'manual').length
  const correctionCount = blockingPoints.filter((bp) => bp.suggestionType === 'correction').length
  const suggestionInfo = getSuggestionTypeInfo(suggestionType)

  if (!currentService) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">请先在受理台选择办理事项</p>
          <p className="text-sm mt-2">选择事项后获取智能受理建议</p>
        </div>
      </div>
    )
  }

  const rule = getRuleDescription()

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧：秒批检测 */}
      <div className="col-span-7 flex flex-col">
        {/* 秒批概览卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">秒批智能检测</h2>
                  <p className="text-sm text-slate-500">{currentService.name}</p>
                </div>
              </div>
              {currentService.isSecondsApproval ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>支持秒批</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                  普通事项
                </span>
              )}
            </div>
          </div>

          {!runSecondsApproval ? (
            <div className="p-8 text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <p className="text-slate-600 mb-2">点击下方按钮开始秒批智能检测</p>
              <p className="text-sm text-slate-500 mb-4">
                系统将自动核验 <span className="font-medium text-blue-600">{rule?.checkPoints.length || 0}</span> 个核验点
              </p>
              <button
                onClick={handleRunApproval}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center space-x-2 mx-auto"
              >
                <Zap className="w-5 h-5" />
                <span>开始秒批检测</span>
              </button>
            </div>
          ) : (
            <div className="p-5">
              {/* 最终建议卡片 */}
              {suggestionInfo && (
                <div
                  className={`mb-5 p-5 rounded-xl border-2 ${suggestionInfo.lightBg} ${suggestionInfo.border}`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${suggestionInfo.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      {(() => {
                        const Icon = suggestionInfo.icon
                        return <Icon className="w-6 h-6 text-white" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-lg font-bold ${suggestionInfo.text}`}>
                          {suggestionInfo.label}
                        </span>
                      </div>
                      <p className={`text-sm ${suggestionInfo.text}`}>{suggestionInfo.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 检测结果统计 */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{passCount}</div>
                  <div className="text-sm text-green-700 mt-1">通过项</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
                  <div className="text-sm text-amber-700 mt-1">待核实</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                  <div className="text-sm text-red-700 mt-1">卡点</div>
                </div>
              </div>

              {/* 卡点详情 */}
              <h3 className="font-medium text-slate-800 mb-3 flex items-center justify-between">
                <span>卡点明细（合并秒批检测 + 材料登记）</span>
                {blockingPoints.length > 0 && (
                  <span className="text-xs text-slate-500 font-normal">
                    共 {blockingPoints.length} 项
                  </span>
                )}
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {blockingPoints.map((bp) => {
                  const style = getLevelStyle(bp.level)
                  const Icon = style.icon
                  return (
                    <div
                      key={bp.id}
                      className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <span className="font-medium text-slate-800">{bp.field}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${style.iconColor} bg-white/60`}>
                              {style.label}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              bp.source === 'detection'
                                ? 'text-purple-600 bg-purple-100'
                                : 'text-blue-600 bg-blue-100'
                            }`}>
                              {bp.source === 'detection' ? '系统检测' : '人工登记'}
                            </span>
                            {bp.suggestionType === 'manual' && (
                              <span className="px-2 py-0.5 text-xs rounded text-blue-600 bg-blue-50 border border-blue-200">
                                需人工
                              </span>
                            )}
                            {bp.suggestionType === 'correction' && (
                              <span className="px-2 py-0.5 text-xs rounded text-amber-600 bg-amber-50 border border-amber-200">
                                可补正
                              </span>
                            )}
                            {bp.suggestionType === 'reject' && (
                              <span className="px-2 py-0.5 text-xs rounded text-red-600 bg-red-50 border border-red-200">
                                不受理
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${style.text}`}>{bp.reason}</p>
                          {bp.solution && (
                            <div className="mt-2 flex items-start space-x-2">
                              <ThumbsUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-blue-600">
                                <span className="font-medium">处理建议：</span>
                                {bp.solution}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeBlockingPoint(bp.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="移除"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {blockingPoints.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    暂无卡点
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 补正建议（只要有可补正的卡点就显示） */}
        {correctionCount > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-800 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>补正建议（补正而非退件）</span>
                </h3>
                <span className="text-xs text-amber-600">
                  共 {correctionCount} 项待补正
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {blockingPoints
                  .filter((bp) => bp.suggestionType === 'correction' && bp.solution)
                  .map((bp, index) => (
                    <div
                      key={bp.id}
                      className="p-4 border border-amber-200 rounded-xl bg-amber-50/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{bp.field}补正</div>
                            <div className="text-sm text-slate-500">{bp.solution}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={handleGenerateCorrectionNotice}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>一键生成补正告知单</span>
              </button>
            </div>
          </div>
        )}

        {/* 转人工指引（有需人工处理的卡点就显示） */}
        {manualCount > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-blue-50">
              <h3 className="font-medium text-slate-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>转人工受理指引</span>
                <span className="ml-1 text-xs text-blue-600">{manualCount}项</span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-4 border border-blue-200 rounded-xl bg-blue-50/50">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <AlertOctagon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 mb-1">需人工核实的事项</div>
                    <div className="text-sm text-slate-500 space-y-1">
                      {blockingPoints
                        .filter((bp) => bp.suggestionType === 'manual')
                        .map((bp) => (
                          <div key={bp.id}>• {bp.field}：{bp.reason}</div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                该事项存在系统无法自动判定的情况，建议引导群众至人工窗口进行核验，或进行异常处置登记。
                <span className="text-amber-600 font-medium">（此类问题不能通过补正解决）</span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={goToMaterialVerification}
                  className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>去人工核验</span>
                </button>
                <button
                  onClick={goToExceptionHandling}
                  className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>异常处置登记</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 秒批通过时的操作 */}
        {runSecondsApproval && suggestionType === 'seconds' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">恭喜！秒批通过</h3>
              <p className="text-slate-600 mb-4">所有核验点均已通过，可直接办理</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={goToReceipt}
                  className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>生成受理回执</span>
                </button>
                <button className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>查看详情</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 不予受理时的操作 */}
        {runSecondsApproval && suggestionType === 'reject' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">不符合受理条件</h3>
              <p className="text-slate-600 mb-4">存在无法通过补正解决的问题，建议不予受理</p>
              <button
                onClick={goToReceipt}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>生成不予受理通知书</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：受理口径 */}
      <div className="col-span-5 flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="font-medium text-slate-800 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-purple-500" />
              <span>受理口径（不同情形）</span>
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto">
            {currentService.scenarios.map((scenario) => {
              const isExpanded = expandedScenario === scenario.id
              return (
                <div
                  key={scenario.id}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                    className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Info className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-800">{scenario.name}</div>
                        <div className="text-xs text-slate-500">{scenario.description}</div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="text-sm font-medium text-slate-700 mb-2">受理要求：</div>
                        <ul className="space-y-1.5">
                          {scenario.requirements.map((req, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2 text-sm text-slate-600"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 核验点说明 */}
        {rule && (
          <div className="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span>核验点说明</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rule.checkPoints.map((cp) => (
                <div key={cp.id} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-700">{cp.field}：</span>
                    <span className="text-slate-500">{cp.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>查看办事指南</span>
          </button>
          <button
            onClick={goToReceipt}
            className="py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>去生成回执</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmartSuggestions
