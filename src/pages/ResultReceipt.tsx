import { useState, useEffect } from 'react'
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
  AlertTriangle,
  XCircle,
  Edit3,
  ArrowLeft,
  ClipboardList,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import type { ReceiptInfo } from '../types'

type ReceiptType = 'accept' | 'correction' | 'reject'

interface ReceiptTemplate {
  type: ReceiptType
  title: string
  subtitle: string
  headerColor: string
  headerBg: string
  badgeLabel: string
  badgeColor: string
  introText: string
  materialsTitle: string
  tipsTitle: string
  tipsList: string[]
  citizenSpeech: string
  showPromiseTime: boolean
  showRejectReason: boolean
}

const receiptTemplates: Record<ReceiptType, ReceiptTemplate> = {
  accept: {
    type: 'accept',
    title: '政务服务受理回执',
    subtitle: '您的申请已受理',
    headerColor: 'from-green-600 to-emerald-600',
    headerBg: 'bg-green-600',
    badgeLabel: '已受理',
    badgeColor: 'text-green-600 bg-green-100',
    introText: '您提交的申请材料齐全，符合法定形式，我们已予受理。',
    materialsTitle: '已收材料清单',
    tipsTitle: '温馨提示',
    tipsList: [
      '请妥善保管此回执单，凭此查询办理进度',
      '我们将通过短信通知您办理结果',
      '如需咨询请拨打服务热线：12345',
      '您也可以通过政务服务网或APP在线查询进度',
    ],
    citizenSpeech: '您好！您的申请我们已经收下了，会在承诺时限内为您办好。办理结果会通过短信通知您，请保持手机畅通。',
    showPromiseTime: true,
    showRejectReason: false,
  },
  correction: {
    type: 'correction',
    title: '申请材料补正告知单',
    subtitle: '请补充以下材料后再次申请',
    headerColor: 'from-amber-500 to-orange-500',
    headerBg: 'bg-amber-500',
    badgeLabel: '需补正',
    badgeColor: 'text-amber-600 bg-amber-100',
    introText: '经审查，您提交的申请材料不齐全或不符合法定形式，请按照以下要求补充材料。',
    materialsTitle: '需要补正的材料',
    tipsTitle: '补正说明',
    tipsList: [
      '请在5个工作日内补充完整材料',
      '补正材料齐全后，我们将重新受理您的申请',
      '您可以通过窗口提交或网上上传方式补交材料',
      '如有疑问请拨打咨询电话：12345',
    ],
    citizenSpeech: '您好！您的申请材料还需要补充一些内容。我已经把需要补正的内容列在这张告知单上了，您按照清单准备好后再来办理就可以了，不用重新排队。',
    showPromiseTime: false,
    showRejectReason: false,
  },
  reject: {
    type: 'reject',
    title: '不予受理通知书',
    subtitle: '您的申请不符合受理条件',
    headerColor: 'from-red-500 to-red-600',
    headerBg: 'bg-red-500',
    badgeLabel: '不予受理',
    badgeColor: 'text-red-600 bg-red-100',
    introText: '经审查，您的申请不符合法定受理条件，我们决定不予受理。',
    materialsTitle: '不予受理原因',
    tipsTitle: '救济途径',
    tipsList: [
      '如对本决定不服，可在60日内申请行政复议',
      '也可在6个月内向人民法院提起行政诉讼',
      '如需咨询请拨打服务热线：12345',
      '您可以按照告知的要求重新准备申请材料',
    ],
    citizenSpeech: '您好！非常抱歉，您的申请目前不符合受理条件。具体原因我已经列在通知书上了，您可以按照上面的说明准备好相关材料后再来，或者通过上面的救济途径维护您的权益。',
    showPromiseTime: false,
    showRejectReason: true,
  },
}

function ResultReceipt() {
  const {
    currentService,
    applicant,
    correctionSuggestions,
    approvalResult,
    blockingPoints,
    setActiveTab,
  } = useAppContext()

  const [receiptType, setReceiptType] = useState<ReceiptType>('accept')
  const [generated, setGenerated] = useState(false)

  // 根据 approvalResult 自动选择回执类型
  useEffect(() => {
    if (approvalResult === 'correction') {
      setReceiptType('correction')
    } else if (approvalResult === 'reject') {
      setReceiptType('reject')
    } else if (approvalResult === 'seconds' || approvalResult === 'manual') {
      setReceiptType('accept')
    }
  }, [approvalResult])

  // 切换事项时重置生成状态
  useEffect(() => {
    setGenerated(false)
  }, [currentService])

  const receiptTypes = [
    { id: 'accept' as ReceiptType, name: '受理回执', icon: CheckCircle2, color: 'green' },
    { id: 'correction' as ReceiptType, name: '补正告知单', icon: Edit3, color: 'amber' },
    { id: 'reject' as ReceiptType, name: '不予受理通知书', icon: XCircle, color: 'red' },
  ]

  const generateReceiptNo = () => {
    const prefix = receiptType === 'accept' ? 'SL' : receiptType === 'correction' ? 'BZ' : 'BT'
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}${date}${random}`
  }

  const getCurrentTime = () => {
    return new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getPromiseTime = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const receiptData: ReceiptInfo = {
    receiptNo: generateReceiptNo(),
    serviceName: currentService?.name || '',
    applicant: applicant?.name || '',
    acceptTime: getCurrentTime(),
    promiseTime: getPromiseTime(),
    materials:
      receiptType === 'correction'
        ? correctionSuggestions.length > 0
          ? correctionSuggestions
          : currentService?.requiredMaterials.filter((m) => m.isRequired).map((m) => m.name) || []
        : currentService?.requiredMaterials.map((m) => m.name) || [],
    resultType: receiptType,
  }

  const template = receiptTemplates[receiptType]

  const getDisplayMaterials = () => {
    if (receiptType === 'correction' && correctionSuggestions.length > 0) {
      return correctionSuggestions
    }
    if (receiptType === 'reject' && blockingPoints.length > 0) {
      return blockingPoints
        .filter((bp) => bp.level === 'critical')
        .map((bp) => `${bp.field}：${bp.reason}`)
    }
    return currentService?.requiredMaterials.map((m) => m.name) || []
  }

  const handleGenerate = () => {
    setGenerated(true)
  }

  const goToAcceptance = () => {
    setActiveTab('acceptance')
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

  // 未选择事项时的提示
  if (!currentService) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">请先选择办理事项</h3>
          <p className="text-slate-500 mb-6">
            您还未在受理台选择办理事项，无法生成回执
          </p>
          <button
            onClick={goToAcceptance}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>回到受理台选择事项</span>
          </button>
        </div>
      </div>
    )
  }

  const displayMaterials = getDisplayMaterials()

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* 左侧：回执类型选择和操作 */}
      <div className="col-span-4 flex flex-col space-y-4">
        {/* 回执类型选择 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-medium text-slate-800 mb-4">选择回执类型</h3>
          {approvalResult && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">智能推荐：</span>
                根据秒批检测结果，建议生成
                <span className="font-bold text-blue-800">
                  {' '}
                  {receiptTypes.find((t) => t.id === receiptType)?.name}
                </span>
              </p>
            </div>
          )}
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

        {/* 当前事项信息 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-medium text-slate-800 mb-3 flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-blue-500" />
            <span>当前办理事项</span>
          </h3>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-slate-800">{currentService.name}</div>
            <div className="text-xs text-slate-500 mt-1">{currentService.category}</div>
          </div>
          {applicant && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-slate-400" />
              <span>申请人：{applicant.name}</span>
            </div>
          )}
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
        >
          <Receipt className="w-5 h-5" />
          <span>生成{receiptTypes.find((t) => t.id === receiptType)?.name}</span>
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
                  disabled={!generated}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                    generated
                      ? 'hover:bg-slate-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center ${
                      generated ? 'group-hover:bg-blue-100 transition-colors' : ''
                    }`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 ${
                        generated ? 'text-slate-500 group-hover:text-blue-600' : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`text-sm font-medium ${
                        generated ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {item.name}
                    </div>
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
          <button
            disabled={!generated}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              generated
                ? 'bg-white/10 hover:bg-white/20 cursor-pointer'
                : 'bg-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
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
                {template.badgeLabel}
              </span>
            )}
          </div>

          {generated ? (
            <div className="p-8 overflow-y-auto h-[calc(100%-57px)] bg-slate-50">
              {/* 回执卡片 */}
              <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                {/* 页眉 - 根据类型变化 */}
                <div className={`bg-gradient-to-r ${template.headerColor} p-6 text-white text-center`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-300" />
                    </div>
                    <span className="font-bold text-lg">{template.title}</span>
                  </div>
                  <p className="text-white/80 text-sm">{template.subtitle}</p>
                </div>

                {/* 回执号 */}
                <div className="p-4 border-b border-slate-100 text-center">
                  <div className="text-xs text-slate-500 mb-1">
                    {receiptType === 'accept' ? '受理编号' : receiptType === 'correction' ? '补正编号' : '通知编号'}
                  </div>
                  <div className="font-mono text-xl font-bold text-blue-600">
                    {receiptData.receiptNo}
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
                    <div className="font-medium text-slate-800">{receiptData.serviceName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>申请人</span>
                      </div>
                      <div className="font-medium text-slate-800">{receiptData.applicant}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>联系电话</span>
                      </div>
                      <div className="font-medium text-slate-800">
                        {applicant?.phone || '138****5678'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{receiptType === 'accept' ? '受理时间' : '出具时间'}</span>
                      </div>
                      <div className="text-sm text-slate-800">{receiptData.acceptTime}</div>
                    </div>
                    {template.showPromiseTime && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>承诺办结</span>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {receiptData.promiseTime}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 导语 - 根据类型变化 */}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">{template.introText}</p>
                  </div>

                  {/* 材料/原因清单 - 根据类型变化 */}
                  <div>
                    <div className="text-xs text-slate-500 mb-2">{template.materialsTitle}</div>
                    <div className="space-y-1.5">
                      {displayMaterials.map((material, index) => (
                        <div
                          key={index}
                          className={`flex items-start space-x-2 text-sm ${
                            receiptType === 'reject' ? 'text-red-700' : 'text-slate-700'
                          }`}
                        >
                          {receiptType === 'accept' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : receiptType === 'correction' ? (
                            <Edit3 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <span>{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 群众话术 - 橙色框，所有类型都有 */}
                <div className="mx-5 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="text-sm font-medium text-orange-800 mb-1 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>窗口话术</span>
                  </div>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    "{template.citizenSpeech}"
                  </p>
                </div>

                {/* 温馨提示/补正说明/救济途径 - 根据类型变化 */}
                <div
                  className={`mx-5 mb-5 p-4 rounded-xl ${
                    receiptType === 'accept'
                      ? 'bg-green-50 border border-green-200'
                      : receiptType === 'correction'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      receiptType === 'accept'
                        ? 'text-green-800'
                        : receiptType === 'correction'
                        ? 'text-amber-800'
                        : 'text-red-800'
                    }`}
                  >
                    {template.tipsTitle}
                  </div>
                  <ul
                    className={`text-xs space-y-1 ${
                      receiptType === 'accept'
                        ? 'text-green-700'
                        : receiptType === 'correction'
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {template.tipsList.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>

                {/* 页脚 */}
                <div className="p-4 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
                  <p>XX市政务服务中心 制发</p>
                  <p className="mt-1">本文书与纸质原件具有同等效力</p>
                </div>
              </div>

              {/* 一次性告知提示 */}
              {receiptType !== 'reject' && (
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
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Receipt className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">选择回执类型并点击生成</p>
                <p className="text-sm mt-2">系统将自动生成标准格式{receiptTypes.find((t) => t.id === receiptType)?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultReceipt
