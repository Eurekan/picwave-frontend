// 图片审核状态枚举信息
export const PIC_REVIEW_STATUS_ENUM = {
  REVEIW: 0,
  PASS: 1,
  REJECT: 2,
}
// 图片审核状态对应中文映射
export const PIC_REVIEW_STATUS_MAP = {
  [PIC_REVIEW_STATUS_ENUM.REVEIW]: '待审核',
  [PIC_REVIEW_STATUS_ENUM.PASS]: '通过',
  [PIC_REVIEW_STATUS_ENUM.REJECT]: '拒绝',
}
// 图片审核状态选项数组
export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map((key: any) => ({
  label: PIC_REVIEW_STATUS_MAP[key],
  value: key,
}))
