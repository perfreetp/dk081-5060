export interface VerificationKeyPoint {
  id: string
  title: string
  desc: string
  category: 'identity' | 'material' | 'policy' | 'logic'
}

export const serviceVerificationPoints: Record<string, VerificationKeyPoint[]> = {
  '1': [
    {
      id: 'vp1-1',
      title: '身份一致性核验',
      desc: '确保申请人本人办理，人脸与身份证照片比对一致；如委托办理，需核验委托书及受托人身份',
      category: 'identity',
    },
    {
      id: 'vp1-2',
      title: '经营场所核验',
      desc: '通过不动产登记库核验经营场所地址真实存在，且不属于禁设区域；住宅改商用需核验利害关系人同意证明',
      category: 'material',
    },
    {
      id: 'vp1-3',
      title: '经营范围核验',
      desc: '核对经营范围表述是否规范，是否涉及前置审批事项；涉及后置审批的需履行告知义务',
      category: 'policy',
    },
    {
      id: 'vp1-4',
      title: '材料一致性核验',
      desc: '申请书填写内容与身份证件、房产证明等材料信息一致，签字人身份与申请人一致',
      category: 'logic',
    },
  ],
  '2': [
    {
      id: 'vp2-1',
      title: '参保状态核验',
      desc: '核验社保系统中的参保状态是否正常，缴费是否连续；断缴人员需提醒补缴后再申请',
      category: 'policy',
    },
    {
      id: 'vp2-2',
      title: '身份信息核验',
      desc: '公安人口库信息与社保系统信息比对一致，姓名、身份证号完全匹配，不一致需先进行信息合并',
      category: 'identity',
    },
    {
      id: 'vp2-3',
      title: '电子照片核验',
      desc: '公安人口库调取的照片是否符合制卡标准（清晰、无遮挡、近一年）；不符合的需现场采集',
      category: 'material',
    },
    {
      id: 'vp2-4',
      title: '重复申领核验',
      desc: '系统中是否已有社保卡申领记录，原卡是否已挂失注销；重复制卡需说明原因并收取工本费',
      category: 'logic',
    },
  ],
  '3': [
    {
      id: 'vp3-1',
      title: '查询权限核验',
      desc: '核验查询人是否为权利人本人、利害关系人或持有效委托书的受托人；公检法等机关需核验公务证件',
      category: 'identity',
    },
    {
      id: 'vp3-2',
      title: '不动产信息核验',
      desc: '核对不动产坐落地址、产权证书编号与系统登记信息一致；多套房需明确查询具体房源',
      category: 'material',
    },
    {
      id: 'vp3-3',
      title: '查询范围核验',
      desc: '按权限查询：本人名下全部或指定不动产；机构查询需核验查询事由是否符合法定情形',
      category: 'policy',
    },
  ],
  '4': [
    {
      id: 'vp4-1',
      title: '企业主体核验',
      desc: '核验企业经营状态是否正常（未吊销、未注销、未列入异常名录）；法人代表身份证明是否有效',
      category: 'identity',
    },
    {
      id: 'vp4-2',
      title: '决议文件核验',
      desc: '股东会/董事会决议签字人数是否符合章程规定，签字与备案印鉴是否一致；变更事项是否符合法定比例',
      category: 'material',
    },
    {
      id: 'vp4-3',
      title: '变更事项核验',
      desc: '变更前后的经营范围、注册资本、股东结构等是否符合法律法规；注册资本变更需核验实缴或认缴情况',
      category: 'policy',
    },
    {
      id: 'vp4-4',
      title: '材料逻辑核验',
      desc: '变更前后信息逻辑一致（如股权变更后比例合计为100%）；新法定代表人无失信被执行人记录',
      category: 'logic',
    },
  ],
  '5': [
    {
      id: 'vp5-1',
      title: '居住时长核验',
      desc: '核验居住登记是否满半年；以实际居住（房本/租房合同）、就业（社保/劳动合同）、就读（学籍）三选一作为依据',
      category: 'policy',
    },
    {
      id: 'vp5-2',
      title: '就业证明核验',
      desc: '劳动合同期限是否还有半年以上，社保连续缴费是否满6个月；个体工商户需核验营业执照及纳税记录',
      category: 'material',
    },
    {
      id: 'vp5-3',
      title: '住所证明核验',
      desc: '自有房屋核验房本；租赁房屋核验备案合同+房东同意书；单位宿舍核验单位出具的住宿证明',
      category: 'material',
    },
    {
      id: 'vp5-4',
      title: '人证一致性核验',
      desc: '申请人与身份证照片比对一致，就业、住所证明上的姓名与申请人一致',
      category: 'identity',
    },
  ],
}

// 默认核验要点（通用）
export const defaultVerificationPoints: VerificationKeyPoint[] = [
  {
    id: 'default-1',
    title: '身份一致性核验',
    desc: '确保申请人与证件持有人为同一人',
    category: 'identity',
  },
  {
    id: 'default-2',
    title: '证照有效期核验',
    desc: '检查共享获取的证照是否在有效期内',
    category: 'material',
  },
  {
    id: 'default-3',
    title: '材料完整性核验',
    desc: '核对所有必填项是否齐全',
    category: 'material',
  },
  {
    id: 'default-4',
    title: '逻辑一致性核验',
    desc: '验证各材料间信息是否一致',
    category: 'logic',
  },
]

export function getVerificationPoints(serviceId: string): VerificationKeyPoint[] {
  return serviceVerificationPoints[serviceId] || defaultVerificationPoints
}

export const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  identity: { label: '身份类', color: 'text-blue-600', bg: 'bg-blue-100' },
  material: { label: '材料类', color: 'text-green-600', bg: 'bg-green-100' },
  policy: { label: '政策类', color: 'text-purple-600', bg: 'bg-purple-100' },
  logic: { label: '逻辑类', color: 'text-amber-600', bg: 'bg-amber-100' },
}
