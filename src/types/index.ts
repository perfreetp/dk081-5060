export interface ServiceItem {
  id: string
  name: string
  category: string
  isSecondsApproval: boolean
  requiredMaterials: MaterialItem[]
  freeCertificates: string[]
  checkPoints: string[]
  scenarios: Scenario[]
  isFavorite?: boolean
}

export interface MaterialItem {
  id: string
  name: string
  type: 'certificate' | 'form' | 'other'
  isShared: boolean
  isRequired: boolean
  source?: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  requirements: string[]
}

export interface Applicant {
  name: string
  idType: string
  idNumber: string
  phone: string
  address?: string
}

export interface ApprovalResult {
  status: 'pending' | 'success' | 'failed' | 'correction'
  blockingPoints?: BlockingPoint[]
  suggestions?: string[]
}

export interface BlockingPoint {
  id: string
  field: string
  reason: string
  solution: string
  level: 'critical' | 'warning' | 'info'
}

export interface InterventionRecord {
  id: string
  time: string
  operator: string
  action: string
  reason: string
  serviceItem: string
  applicant: string
}

export interface PolicyNotice {
  id: string
  title: string
  content: string
  publishDate: string
  effectiveDate: string
  isImportant: boolean
}

export interface ReceiptInfo {
  receiptNo: string
  serviceName: string
  applicant: string
  acceptTime: string
  promiseTime: string
  materials: string[]
  resultType: 'accept' | 'correction' | 'reject'
  remarks?: string
}
