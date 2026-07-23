export interface ProjectItem {
  id: string
  catalogItemId: string           // مرجع لبند الكتالوج
  unit: string                    // الوحدة (تنسخ من الكتالوج، وفيها تعديل)
  quantity: number
  unitPriceSYP: number
  unitPriceUSD: number
  specValues: Record<string, string> // specFieldId -> القيمة المعبّأة
}

export interface Project {
  id: string
  name: string
  startDate: string
  endDate: string
  signaturePlace: string
  incomingEntityId: string
  contractorId: string
  items: ProjectItem[]
}