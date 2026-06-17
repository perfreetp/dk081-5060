import { useState } from 'react'
import {
  Receipt,
  FileText,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Calendar,
  FileCheck,
  Copy,
  QrCode,
  ChevronRight,
  Star,
} from 'lucide-react'
import type { ServiceItem, Applicant, ReceiptInfo } from '../types'

interface Props {
  currentService: ServiceItem | null
  applicant: Applicant | null
}

type ReceiptType = 'accept' | 'correction' | 'reject'

function ResultReceipt({ currentService, applicant }: Props) {
  const [receiptType, setReceiptType] = useState<ReceiptType>('accept')
  const [generated, setGenerated] = useState(false)

  const receiptTypes = [
    { id: 'accept' as ReceiptType, name: '受理回执', icon: CheckCircle2, color: 'green' },
    { id: 'correction' as ReceiptType, name: '补正告知单', icon: FileText, color: 'amber' },
    { id: 'reject' as ReceiptType, name: '不予受理通知书', icon: FileText, color: 'red' },
  ]

  const mockReceipt: ReceiptInfo = {
    receiptNo: 'SL20240115001234',
    serviceName: currentService?.name || '个体工商户设立登记',
    applicant: applicant?.name || '张三',
    acceptTime: '2024-01-15 14:30:00',
    promiseTime: '2024-01-16 14:30:00',
    materials: ['居民身份证', '经营场所证明', '登记申请书'],
    resultType: 'accept',
  }

  const handleGenerate = () => {
    setGenerated(true)
  }

  const getReceiptTypeStyle = (type: string) => {
    switch (type) {
      case 'accept':
        return 'text-green-600 bg-green-100'
      case 'correction':
        return 'text-amber-600 bg-amber-100'
      case 'reject':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧：回执类型选择和操作 */}
      <div className="col-span-4 flex flex-col space-y-4">
        {/* 回执类型选择 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-medium text-slate-800 mb-4">选择回执类型</h3>
          <div className="space-y-2">
            {receiptTypes.map((type) => {
              const Icon = type.icon
              const isActive = receiptType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setReceiptType(type.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-${type.color}-100 flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 text-${type.color}-600`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-800">{type.name}</div>
                    <div className="text-xs text-slate-500">一键生成标准文书</div>
                  </div>
                  {isActive && (
                    <CheckCircle2 className={`w-5 h-5 text-${type.color}-500`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
        >
          <Receipt className="w-5 h-5" />
          <span>生成回执</span>
        </button>

        {/* 快捷操作 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex-1">
          <h3 className="font-medium text-slate-800 mb-4">快捷操作</h3>
          <div className="space-y-2">
            {[
              { name: '打印回执', icon: Printer, desc: '打印纸质回执单' },
              { name: '短信发送', icon: Send, desc: '发送到申请人手机' },
              { name: '下载PDF', icon: Download, desc: '导出PDF文件' },
              { name: '复制链接', icon: Copy, desc: '复制查询链接' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-slate-500 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-slate-700">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              )
            })}
          </div>
        </div>

        {/* 帮办代办快捷入口 */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">帮办代办模式</div>
              <div className="text-xs text-purple-200">代办人员专用</div>
            </div>
          </div>
          <p className="text-sm text-purple-200 mb-3">
            一键生成告知单，自动填充申请人信息
          </p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
            <FileCheck className="w-4 h-4" />
            <span>进入代办模式</span>
          </button>
        </div>
      </div>

      {/* 右侧：回执预览 */}
      <div className="col-span-8 flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-medium text-slate-800">回执预览</h3>
            {generated && (
              <span className={`px-2 py-0.5 text-xs rounded font-medium ${getReceiptTypeStyle(receiptType)}`}>
                {receiptTypes.find((t) => t.id === receiptType)?.name}
              </span>
            )}
          </div>

          {generated ? (
            <div className="p-8 overflow-y-auto h-[calc(100%-57px)] bg-slate-50">
              {/* 回执卡片 */}
              <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                {/* 页眉 */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-300" />
                    </div>
                    <span className="font-bold text-lg">政务服务受理回执</span>
                  </div>
                  <p className="text-blue-200 text-sm">XX市政务服务中心 · 综合窗口</p>
                </div>

                {/* 回执号 */}
                <div className="p-4 border-b border-slate-100 text-center">
                  <div className="text-xs text-slate-500 mb-1">受理编号</div>
                  <div className="font-mono text-xl font-bold text-blue-600">
                    {mockReceipt.receiptNo}
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="w-32 h-32 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-slate-800" />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">扫码查询办理进度</div>
                </div>

                {/* 基本信息 */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">事项名称</div>
                    <div className="font-medium text-slate-800">{mockReceipt.serviceName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>申请人</span>
                      </div>
                      <div className="font-medium text-slate-800">{mockReceipt.applicant}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>联系电话</span>
                      </div>
                      <div className="font-medium text-slate-800">{applicant?.phone || '138****5678'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>受理时间</span>
                      </div>
                      <div className="text-sm text-slate-800">{mockReceipt.acceptTime}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>承诺办结</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {mockReceipt.promiseTime}
                      </div>
                    </div>
                  </div>

                  {/* 材料清单 */}
                  <div>
                    <div className="text-xs text-slate-500 mb-2">申请材料清单</div>
                    <div className="space-y-1.5">
                      {mockReceipt.materials.map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 温馨提示 */}
                <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-sm font-medium text-amber-800 mb-1">温馨提示</div>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• 请妥善保管此回执单，凭此查询办理进度</li>
                    <li>• 我们将通过短信通知您办理结果</li>
                    <li>• 如需咨询请拨打服务热线：12345</li>
                  </ul>
                </div>

                {/* 页脚 */}
                <div className="p-4 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
                  <p>XX市政务服务中心 制发</p>
                  <p className="mt-1">本回执单与纸质原件具有同等效力</p>
                </div>
              </div>

              {/* 一次性告知提示 */}
              <div className="max-w-lg mx-auto mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">一次性告知完成</div>
                    <p className="text-sm text-green-700 mt-1">
                      所有申请材料、办理流程、注意事项已一次性告知申请人，
                      确保群众"最多跑一次"。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Receipt className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">选择回执类型并点击生成</p>
                <p className="text-sm mt-2">系统将自动生成标准格式回执单</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultReceipt
