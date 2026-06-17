import { ServiceItem, InterventionRecord, PolicyNotice, Applicant } from '../types'

export const mockServices: ServiceItem[] = [
  {
    id: '1',
    name: '个体工商户设立登记',
    category: '市场监管',
    isSecondsApproval: true,
    requiredMaterials: [
      { id: 'm1', name: '居民身份证', type: 'certificate', isShared: true, isRequired: true, source: '公安人口库' },
      { id: 'm2', name: '经营场所证明', type: 'certificate', isShared: true, isRequired: true, source: '不动产登记库' },
      { id: 'm3', name: '个体工商户设立登记申请书', type: 'form', isShared: false, isRequired: true },
      { id: 'm4', name: '一寸免冠照片', type: 'other', isShared: false, isRequired: false },
    ],
    freeCertificates: ['居民身份证', '营业执照', '不动产权证书'],
    checkPoints: ['申请人年龄（年满16周岁', '经营场所不在禁设区域', '经营范围不涉及前置审批'],
    scenarios: [
      { id: 's1', name: '经营场所为自有房产', description: '申请人自有房产作为经营场所', requirements: ['提供不动产权证书', '房产用途为商业或商住两用'] },
      { id: 's2', name: '经营场所为租赁房屋', description: '租赁他人房屋作为经营场所', requirements: ['提供房屋租赁合同', '提供出租方房产证明'] },
      { id: 's3', name: '经营场所为市场摊位', description: '在集贸市场内经营', requirements: ['提供市场开办单位出具的场地证明'] },
    ],
    isFavorite: true,
  },
  {
    id: '2',
    name: '社会保障卡申领',
    category: '人力资源和社会保障',
    isSecondsApproval: true,
    requiredMaterials: [
      { id: 'm5', name: '居民身份证', type: 'certificate', isShared: true, isRequired: true, source: '公安人口库' },
      { id: 'm6', name: '电子照片', type: 'other', isShared: true, isRequired: true, source: '公安人口库照片' },
    ],
    freeCertificates: ['居民身份证'],
    checkPoints: ['已参加社会保险', '未申领过社保卡', '照片符合制卡条件'],
    scenarios: [
      { id: 's4', name: '首次申领', description: '初次申领社会保障卡', requirements: ['正常参保状态', '提供二代身份证'] },
      { id: 's5', name: '补换卡', description: '社保卡遗失或损坏补办', requirements: ['原社保卡已挂失', '提供身份证'] },
    ],
    isFavorite: true,
  },
  {
    id: '3',
    name: '不动产登记查询',
    category: '自然资源',
    isSecondsApproval: true,
    requiredMaterials: [
      { id: 'm7', name: '居民身份证', type: 'certificate', isShared: true, isRequired: true, source: '公安人口库' },
      { id: 'm8', name: '不动产权证书', type: 'certificate', isShared: false, isRequired: false, source: '不动产登记库' },
    ],
    freeCertificates: ['居民身份证', '不动产权证书'],
    checkPoints: ['查询人为权利人本人', '不动产信息已登记入库'],
    scenarios: [
      { id: 's6', name: '本人名下房产查询', description: '查询本人名下不动产信息', requirements: ['本人身份证原件', '人脸识别验证'] },
      { id: 's7', name: '特定房屋信息查询', description: '查询特定不动产的登记信息', requirements: ['不动产坐落地址', '产权人身份证明'] },
    ],
    isFavorite: false,
  },
  {
    id: '4',
    name: '营业执照变更登记',
    category: '市场监管',
    isSecondsApproval: false,
    requiredMaterials: [
      { id: 'm9', name: '居民身份证', type: 'certificate', isShared: true, isRequired: true, source: '公安人口库' },
      { id: 'm10', name: '营业执照正本', type: 'certificate', isShared: true, isRequired: true, source: '市场监管库' },
      { id: 'm11', name: '变更登记申请书', type: 'form', isShared: false, isRequired: true },
      { id: 'm12', name: '股东会决议', type: 'other', isShared: false, isRequired: true },
    ],
    freeCertificates: ['居民身份证', '营业执照'],
    checkPoints: ['企业处于正常经营状态', '变更事项在法定范围内', '材料齐全符合法定形式'],
    scenarios: [
      { id: 's8', name: '名称变更', description: '变更企业名称', requirements: ['名称预先核准通知书', '股东会决议'] },
      { id: 's9', name: '经营范围变更', description: '变更经营范围', requirements: ['新的经营范围表述', '股东会决议'] },
      { id: 's10', name: '法定代表人变更', description: '变更法定代表人', requirements: ['新法定代表人身份证明', '任免文件'] },
    ],
    isFavorite: false,
  },
  {
    id: '5',
    name: '居住证办理',
    category: '公安',
    isSecondsApproval: false,
    requiredMaterials: [
      { id: 'm13', name: '居民身份证', type: 'certificate', isShared: true, isRequired: true, source: '公安人口库' },
      { id: 'm14', name: '居住证明', type: 'certificate', isShared: false, isRequired: true },
      { id: 'm15', name: '就业证明', type: 'certificate', isShared: false, isRequired: true },
    ],
    freeCertificates: ['居民身份证'],
    checkPoints: ['在居住地居住满半年', '有合法稳定就业', '有合法稳定住所'],
    scenarios: [
      { id: 's11', name: '自有住房居住', description: '在自有房屋居住', requirements: ['提供房产证明', '居住满半年证明'] },
      { id: 's12', name: '租赁房屋居住', description: '在租赁房屋居住', requirements: ['房屋租赁合同', '房东身份证明', '居住满半年证明'] },
      { id: 's13', name: '单位宿舍居住', description: '在单位集体宿舍居住', requirements: ['单位出具的住宿证明', '劳动合同'] },
    ],
    isFavorite: true,
  },
]

export const mockApplicant: Applicant = {
  name: '张三',
  idType: '居民身份证',
  idNumber: '310***********1234',
  phone: '138****5678',
  address: '北京市朝阳区建国路88号',
}

export const mockInterventions: InterventionRecord[] = [
  {
    id: 'i1',
    time: '2024-01-15 14:30:25',
    operator: '李主管',
    action: '人工通过',
    reason: '经营场所证明材料存疑，经现场核实后通过',
    serviceItem: '个体工商户设立登记',
    applicant: '张三',
  },
  {
    id: 'i2',
    time: '2024-01-15 10:15:42',
    operator: '王专员',
    action: '材料补正',
    reason: '经营范围表述不规范，指导申请人重新填写',
    serviceItem: '营业执照变更登记',
    applicant: '李四',
  },
  {
    id: 'i3',
    time: '2024-01-14 16:45:18',
    operator: '李主管',
    action: '加急办理',
    reason: '群众特殊情况，按绿色通道处理',
    serviceItem: '社会保障卡申领',
    applicant: '王五',
  },
]

export const mockPolicies: PolicyNotice[] = [
  {
    id: 'p1',
    title: '关于优化个体工商户登记流程的通知',
    content: '自2024年1月1日起，个体工商户设立登记实行"一窗受理、一日办结',
    publishDate: '2023-12-25',
    effectiveDate: '2024-01-01',
    isImportant: true,
  },
  {
    id: 'p2',
    title: '临时调整：社保卡申领免提交纸质照片',
    content: '即日起，社保卡申领可直接调用公安人口库照片，无需提交纸质照片',
    publishDate: '2024-01-10',
    effectiveDate: '2024-01-10',
    isImportant: true,
  },
  {
    id: 'p3',
    title: '关于开展"一网通办"专项行动的通知',
    content: '推进政务服务事项"马上办、网上办、就近办、一次办"',
    publishDate: '2024-01-05',
    effectiveDate: '2024-01-05',
    isImportant: false,
  },
]

export const serviceCategories = [
  '全部',
  '市场监管',
  '人力资源和社会保障',
  '自然资源',
  '公安',
  '税务',
  '住房城乡建设',
  '民政',
]
