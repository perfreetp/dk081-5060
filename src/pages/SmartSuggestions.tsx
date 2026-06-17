import { useState } from 'react'
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
} from 'lucide-react'
import type { ServiceItem, BlockingPoint } from '../types'

interface Props {
  currentService: ServiceItem | null
}

function SmartSuggestions({ currentService }: Props) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [runSecondsApproval, setRunSecondsApproval] = useState(false)

  const mockBlockingPoints: BlockingPoint[] = [
    {
      id: 'bp1',
      field: '经营场所',
      reason: '经营场所地址与不动产登记信息不一致',
      solution: '建议核实地址信息，或补充提供经营场所证明材料',
      level: 'warning',
    },
    {
      id: 'bp2',
      field: '经营范围',
      reason: '经营范围涉及后置审批事项',
      solution: '需先取得相关部门审批文件后方可办理',
      level: 'critical',
    },
    {
      id: 'bp3',
      field: '申请人年龄',
      reason: '申请人已年满18周岁，符合法定要求',
      solution: '',
      level: 'info',
    },
  ]

  const handleRunApproval = () => {
    setRunSecondsApproval(true)
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

  const criticalCount = mockBlockingPoints.filter((bp) => bp.level === 'critical').length
  const warningCount = mockBlockingPoints.filter((bp) => bp.level === 'warning').length

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
                  <p className="text-sm text-slate-500">自动识别不符合秒批条件的卡点</p>
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
              <p className="text-slate-600 mb-4">点击下方按钮开始秒批智能检测</p>
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
              {/* 检测结果统计 */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {mockBlockingPoints.filter((bp) => bp.level === 'info').length}
                  </div>
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
              <h3 className="font-medium text-slate-800 mb-3">检测卡点明细</h3>
              <div className="space-y-3">
                {mockBlockingPoints.map((bp) => {
                  const style = getLevelStyle(bp.level)
                  const Icon = style.icon
                  return (
                    <div
                      key={bp.id}
                      className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-800">{bp.field}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${style.iconColor} bg-white/60`}>
                              {style.label}
                            </span>
                          </div>
                          <p className={`text-sm ${style.text}`}>{bp.reason}</p>
                          {bp.solution && (
                            <div className="mt-2 flex items-start space-x-2">
                              <ThumbsUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-blue-600">
                                <span className="font-medium">补正建议：</span>
                                {bp.solution}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 处理建议 */}
              <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">受理建议</p>
                    <p className="text-sm text-blue-700 mt-1">
                      该申请存在 {criticalCount} 项不符合秒批条件的卡点，
                      <span className="font-medium">建议不予秒批，转为人工受理</span>。
                      可向群众说明原因并出具补正告知单，待材料补充后再次申请。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 补正建议 */}
        {runSecondsApproval && (criticalCount > 0 || warningCount > 0) && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-medium text-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>补正建议（补正而非退件</span>
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {mockBlockingPoints
                  .filter((bp) => bp.level !== 'info')
                  .map((bp, index) => (
                    <div
                      key={bp.id}
                      className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{bp.field}补正</div>
                            <div className="text-sm text-slate-500">{bp.solution}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  ))}
              </div>

              <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>生成一次性补正告知单</span>
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
                    onClick={() =>
                      setExpandedScenario(isExpanded ? null : scenario.id)
                    }
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

        {/* 快捷操作 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>查看办事指南</span>
          </button>
          <button className="py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center space-x-2">
            <ThumbsUp className="w-4 h-4" />
            <span>确认受理</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SmartSuggestions
