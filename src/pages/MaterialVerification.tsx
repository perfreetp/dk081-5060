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
} from 'lucide-react'
import type { MaterialItem } from '../types'
import { useAppContext } from '../context/AppContext'

type MaterialStatus = 'pending' | 'shared' | 'submitted' | 'waived' | 'missing'

interface MaterialWithStatus extends MaterialItem {
  status: MaterialStatus
  sharedTime?: string
}

function MaterialVerification() {
  const { currentService } = useAppContext()
  const [materials, setMaterials] = useState<MaterialWithStatus[]>([])

  // 当切换事项时，自动重置材料清单
  useEffect(() => {
    if (currentService) {
      setMaterials(
        currentService.requiredMaterials.map((m) => ({
          ...m,
          status: 'pending',
        }))
      )
    } else {
      setMaterials([])
    }
  }, [currentService])

  const fetchSharedMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'shared', sharedTime: new Date().toLocaleTimeString() }
          : m
      )
    )
  }

  const fetchAllShared = () => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.isShared ? { ...m, status: 'shared', sharedTime: new Date().toLocaleTimeString() } : m
      )
    )
  }

  const getStatusInfo = (status: MaterialStatus) => {
    const statusMap = {
      pending: { label: '待调取', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
      shared: { label: '已共享', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
      submitted: { label: '已提交', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
      waived: { label: '容缺', icon: FileQuestion, color: 'text-amber-600', bg: 'bg-amber-100' },
      missing: { label: '缺失', icon: FileX, color: 'text-red-600', bg: 'bg-red-100' },
    }
    return statusMap[status]
  }

  const sharedCount = materials.filter((m) => m.status === 'shared').length
  const sharedTotal = materials.filter((m) => m.isShared).length
  const completionRate = materials.length > 0 ? Math.round((sharedCount / materials.length) * 100) : 0

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
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧：核验提示 */}
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

        {/* 核验要点 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-medium text-slate-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>核验要点</span>
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { title: '身份一致性核验', desc: '确保申请人与证件持有人为同一人' },
              { title: '证照有效期核验', desc: '检查共享获取的证照是否在有效期内' },
              { title: '材料完整性核验', desc: '核对所有必填项是否齐全' },
              { title: '逻辑一致性核验', desc: '验证各材料间信息是否一致' },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-slate-800 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
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
