import type { BlockingPoint } from '../types'

export interface ApprovalRule {
  serviceId: string
  checkPoints: ApprovalCheckPoint[]
}

export interface ApprovalCheckPoint {
  id: string
  field: string
  description: string
  possibleResults: CheckPointResult[]
}

export interface CheckPointResult {
  level: 'info' | 'warning' | 'critical'
  result: 'pass' | 'fail' | 'warning'
  reason: string
  solution: string
  suggestionType: 'correction' | 'manual' | 'reject'
}

// 定义各事项的秒批核验规则
export const approvalRules: ApprovalRule[] = [
  {
    serviceId: '1',
    checkPoints: [
      {
        id: 'cp1',
        field: '申请人年龄',
        description: '检查申请人是否年满16周岁',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '申请人已年满16周岁，符合法定要求',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '申请人未满16周岁，不具备独立申请资格',
            solution: '需由监护人代为申请，或待申请人年满16周岁后自行申请',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp2',
        field: '经营场地区域',
        description: '检查经营场所是否在禁设区域内',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '经营场所不在政府规定的禁设区域内',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '经营场所地址与不动产登记信息不完全一致',
            solution: '请申请人核实地址信息，或补充提供经营场所使用证明',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '该经营场所位于中小学周边禁设区域内',
            solution: '该地址不得从事相关经营活动，请更换经营场所',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp3',
        field: '经营范围',
        description: '检查经营范围是否涉及前置审批',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '经营范围不涉及前置审批事项',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '经营范围涉及后置审批事项',
            solution: '可先办理营业执照，经营前需取得相关部门审批文件',
            suggestionType: 'manual',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '经营范围涉及前置审批事项',
            solution: '需先取得相关部门审批文件后方可办理营业执照',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp4',
        field: '身份一致性',
        description: '检查申请人与证件持有人是否一致',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '人脸识别通过，身份一致',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '人脸识别未通过，身份存疑',
            solution: '需本人携带身份证原件到窗口核验',
            suggestionType: 'manual',
          },
        ],
      },
    ],
  },
  {
    serviceId: '2',
    checkPoints: [
      {
        id: 'cp5',
        field: '参保状态',
        description: '检查申请人是否正常参保',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '申请人处于正常参保状态',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '未查询到参保信息',
            solution: '请先办理参保手续后再申领社保卡',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp6',
        field: '制卡照片',
        description: '检查是否有符合要求的电子照片',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '已调取公安人口库照片，符合制卡要求',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '公安人口库照片质量不符合制卡要求',
            solution: '请申请人提供近期一寸白底彩色电子照片',
            suggestionType: 'correction',
          },
        ],
      },
      {
        id: 'cp7',
        field: '是否已申领',
        description: '检查是否已申领过社保卡',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '未查询到社保卡申领记录',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '申请人已申领过社保卡',
            solution: '如社保卡遗失或损坏，请办理补换卡业务',
            suggestionType: 'correction',
          },
        ],
      },
    ],
  },
  {
    serviceId: '3',
    checkPoints: [
      {
        id: 'cp8',
        field: '查询权限',
        description: '检查是否为权利人本人查询',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '查询人为不动产权利人本人',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '查询人非不动产权利人',
            solution: '需取得权利人授权委托书后方可查询',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp9',
        field: '不动产信息',
        description: '检查不动产信息是否已登记入库',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '不动产信息已完成登记入库',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '未查询到该不动产的登记信息',
            solution: '请核实不动产坐落地址是否正确',
            suggestionType: 'correction',
          },
        ],
      },
    ],
  },
  {
    serviceId: '4',
    checkPoints: [
      {
        id: 'cp10',
        field: '企业状态',
        description: '检查企业是否处于正常经营状态',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '企业处于正常存续经营状态',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '企业已被吊销或列入异常经营名录',
            solution: '需先到市场监管部门解除异常状态',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp11',
        field: '变更事项',
        description: '检查变更事项是否在法定范围内',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '变更事项符合法定要求',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '变更后的经营范围涉及后置审批',
            solution: '请在变更后及时到相关部门办理审批手续',
            suggestionType: 'manual',
          },
        ],
      },
      {
        id: 'cp12',
        field: '申请材料',
        description: '检查材料是否齐全符合法定形式',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '申请材料齐全，符合法定形式',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '股东会决议缺少部分股东签字',
            solution: '请补充完整全体股东签字的股东会决议',
            suggestionType: 'correction',
          },
        ],
      },
    ],
  },
  {
    serviceId: '5',
    checkPoints: [
      {
        id: 'cp13',
        field: '居住时长',
        description: '检查是否在居住地居住满半年',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '已在本地居住登记满半年',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'critical',
            result: 'fail',
            reason: '居住登记未满半年',
            solution: '请在居住登记满半年后再申请办理居住证',
            suggestionType: 'reject',
          },
        ],
      },
      {
        id: 'cp14',
        field: '就业证明',
        description: '检查是否有合法稳定就业证明',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '已核实社保缴纳记录，就业稳定',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '未查询到社保缴纳记录',
            solution: '请提供劳动合同或单位出具的就业证明',
            suggestionType: 'correction',
          },
        ],
      },
      {
        id: 'cp15',
        field: '住所证明',
        description: '检查是否有合法稳定住所证明',
        possibleResults: [
          {
            level: 'info',
            result: 'pass',
            reason: '住所证明材料齐全有效',
            solution: '',
            suggestionType: 'correction',
          },
          {
            level: 'warning',
            result: 'warning',
            reason: '房屋租赁合同未进行备案',
            solution: '请提供经房管部门备案的房屋租赁合同',
            suggestionType: 'correction',
          },
        ],
      },
    ],
  },
]

// 模拟生成核验结果的函数
export function generateMockApprovalResult(serviceId: string): BlockingPoint[] {
  const rule = approvalRules.find((r) => r.serviceId === serviceId)
  if (!rule) return []

  const results: BlockingPoint[] = []

  rule.checkPoints.forEach((cp) => {
    // 随机生成一个结果，但确保至少有一个通过和一个不通过
    const randomIndex = Math.floor(Math.random() * cp.possibleResults.length)
    const result = cp.possibleResults[randomIndex]

    results.push({
      id: `${serviceId}-${cp.id}`,
      field: cp.field,
      reason: result.reason,
      solution: result.solution,
      level: result.level,
    })
  })

  return results
}

// 根据核验点判断最终建议类型
export function determineSuggestionType(blockingPoints: BlockingPoint[]): 'seconds' | 'correction' | 'manual' | 'reject' {
  const hasCritical = blockingPoints.some((bp) => bp.level === 'critical')
  const hasWarning = blockingPoints.some((bp) => bp.level === 'warning')
  const allPass = blockingPoints.every((bp) => bp.level === 'info')

  if (allPass) {
    return 'seconds'
  }

  if (hasCritical) {
    // 检查是否所有 critical 都是 reject 类型
    const criticalPoints = blockingPoints.filter((bp) => bp.level === 'critical')
    const hasRejectCritical = criticalPoints.some((bp) => {
      const rule = approvalRules.find((r) =>
        r.checkPoints.some((cp) =>
          cp.possibleResults.some((pr) => pr.reason === bp.reason && pr.suggestionType === 'reject')
        )
      )
      return rule !== undefined
    })
    if (hasRejectCritical) {
      return 'reject'
    }
    return 'manual'
  }

  if (hasWarning) {
    return 'correction'
  }

  return 'manual'
}
