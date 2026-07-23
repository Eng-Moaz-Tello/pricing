export interface Contractor {
  id: string
  name: string
  phone: string
  birthDate: string      // بصيغة yyyy-mm-dd
  nationalId: string
  hasCompany: boolean
  companyName?: string
}