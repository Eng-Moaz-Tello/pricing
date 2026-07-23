import type { Contractor } from '../types/contractor'

let contractors: Contractor[] = [
  {
    id: '1',
    name: 'محمد معاذ تللو',
    phone: '0968767511',
    birthDate: '1995-09-23',
    nationalId: '01040102375',
    hasCompany: true,
    companyName: 'مؤسسة تللو العقارية',
  },
  {
    id: '2',
    name: 'سامي زكريا',
    phone: '0937654321',
    birthDate: '1994-01-01',
    nationalId: '04010098765',
    hasCompany: false,
  },
  {
    id: '3',
    name: 'كنان العايد',
    phone: '0937623452',
    birthDate: '2001-01-01',
    nationalId: '04010098765',
    hasCompany: false,
  },
]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getContractors(): Promise<Contractor[]> {
  await delay()
  return [...contractors]
}

export async function createContractor(data: Omit<Contractor, 'id'>) {
  await delay()
  const c: Contractor = { ...data, id: crypto.randomUUID() }
  contractors.push(c)
  return c
}

export async function updateContractor(id: string, data: Omit<Contractor, 'id'>) {
  await delay()
  contractors = contractors.map((c) => (c.id === id ? { ...c, id, ...data } : c))
  return contractors.find((c) => c.id === id)!
}

export async function deleteContractor(id: string) {
  await delay()
  contractors = contractors.filter((c) => c.id !== id)
}