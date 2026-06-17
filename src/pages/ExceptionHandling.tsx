import { useState } from 'react'
import {
  AlertTriangle,
  FileX,
  MessageSquare,
  Bell,
  Clock,
  User,
  FileText,
  ChevronRight,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Gauge,
  Shield,
} from 'lucide-react'
import { mockInterventions, mockPolicies } from '../data/mockData'

type TabType = 'interventions' | 'policies' | 'translation'

function ExceptionHandling() {
  const [activeTab, setActiveTab] = useState<TabType>('interventions')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'interventions' as TabType, name: '人工干预记录', icon: Shield, count: 12 },
    { id: 'policies' as TabType, name: '临时政策调整', icon: Bell, count: 3 },
    { id: 'translation' as TabType, name: '失败原因转译', icon: MessageSquare, count: 0 },
  ]

  const filteredInterventions = mockInterventions.filter(
    (i) =>
      i.serviceItem.includes(searchQuery) ||
      i.applicant.includes(searchQuery) ||
      i.operator.includes(searchQuery)
  )

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧主内容 */}
      <div className="col-span-8 flex flex-col">
        {/* 标签切换 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded-full ${
                        isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 人工干预记录 */}
        {activeTab === 'interventions' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索事项、申请人、经办人..."
                      className="w-64 h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Filter className="w-4 h-4" />
                    <span>筛选</span>
                  </button>
                </div>
                <span className="text-sm text-slate-500">
                  共 <span className="font-semibold text-blue-600">{filteredInterventions.length}</span> 条记录
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto h-[calc(100%-65px)]">
              {filteredInterventions.map((record) => (
                <div
                  key={record.id}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-slate-800">{record.serviceItem}</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded font-medium ${
                            record.action === '人工通过'
                              ? 'bg-green-100 text-green-700'
                              : record.action === '材料补正'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {record.action}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{record.reason}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5" />
                          <span>申请人：{record.applicant}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Shield className="w-3.5 h-3.5" />
                          <span>经办人：{record.operator}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{record.time}</span>
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 临时政策调整 */}
        {activeTab === 'policies' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-red-50 to-amber-50">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-slate-800">临时政策调整（醒目提醒</span>
                <span className="text-sm text-slate-500">· 请注意最新政策变化</span>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-57px)]">
              {mockPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                    policy.isImportant
                      ? 'border-red-300 bg-gradient-to-r from-red-50 to-amber-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {policy.isImportant && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded animate-pulse">
                        重要
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                        临时政策
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-slate-800 text-lg mb-2">{policy.title}</h3>
                  <p className="text-slate-600 mb-4">{policy.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>发布日期：{policy.publishDate}</span>
                      <span>生效日期：{policy.effectiveDate}</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                      <span>查看详情</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 失败原因转译 */}
        {activeTab === 'translation' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">秒批失败原因转译</h3>
              <p className="text-slate-500 mb-6">将系统专业术语转换为群众易懂的口语化表述</p>

              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      original: '未查询到不动产登记信息',
                      translated: '系统中暂未查到您的房产登记信息',
                    },
                    {
                      original: '证照状态为注销',
                      translated: '您的证件已失效，需要重新办理',
                    },
                    {
                      original: '数据项为空',
                      translated: '有必填信息没有填写完整',
                    },
                    {
                      original: '比对不通过',
                      translated: '您填写的信息与系统记录不一致',
                    },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl text-left">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-slate-500">系统原表述</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">{item.original}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600">群众话术</span>
                      </div>
                      <p className="text-sm text-green-700 font-medium">{item.translated}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center space-x-2 mx-auto">
                  <Gauge className="w-5 h-5" />
                  <span>查看全部话术库</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：统计和快捷操作 */}
      <div className="col-span-4 flex flex-col space-y-4">
        {/* 今日统计 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-medium text-slate-800 mb-4 flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span>今日异常统计</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-amber-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-amber-600">5</div>
              <div className="text-sm text-amber-700 mt-1">人工干预</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-red-700 mt-1">秒批失败</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-blue-700 mt-1">材料补正</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-green-700 mt-1">秒批通过</div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex-1">
          <h3 className="font-medium text-slate-800 mb-4 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-500" />
            <span>常用处置</span>
          </h3>
          <div className="space-y-2">
            {[
              { name: '容缺受理', icon: FileText, color: 'blue' },
              { name: '告知承诺', icon: CheckCircle2, color: 'green' },
              { name: '退件处理', icon: XCircle, color: 'red' },
              { name: '加急办理', icon: Clock, color: 'amber' },
              { name: '特别程序', icon: AlertCircle, color: 'purple' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-${item.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-4.5 h-4.5 text-${item.color}-600`} />
                  </div>
                  <span className="flex-1 text-left text-sm text-slate-700">{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                </button>
              )
            })}
          </div>
        </div>

        {/* 窗口主管入口 */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">主管视图</div>
              <div className="text-xs text-slate-400">查看全部干预记录</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            窗口主管可查看所有人工干预记录，进行审核和统计分析
          </p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            进入主管视图
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExceptionHandling
