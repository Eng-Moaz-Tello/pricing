import type { Project } from '../types/project'

let projects: Project[] = [
  {
    id: '1',
    name: 'تجهيز مبنى المديرية',
    startDate: '2026-01-10',
    endDate: '2026-03-15',
    signaturePlace: 'دمشق',
    incomingEntityId: '1',
    contractorId: '1',
    items: [
      {
        id: 'pi1',
        catalogItemId: '1',
        unit: 'م²',
        quantity: 20,
        unitPriceSYP: 500000,
        unitPriceUSD: 40,
        specValues: { s1: 'ألمنيوم', s2: '120×150', s3: 'دبل' },
      },
    ],
  },
]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getProjects(): Promise<Project[]> {
  await delay()
  return [...projects]
}

export async function getProject(id: string): Promise<Project | undefined> {
  await delay()
  return projects.find((p) => p.id === id)
}

export async function createProject(data: Omit<Project, 'id'>) {
  await delay()
  const project: Project = { ...data, id: crypto.randomUUID() }
  projects.push(project)
  return project
}

export async function updateProject(id: string, data: Omit<Project, 'id'>) {
  await delay()
  projects = projects.map((p) => (p.id === id ? { ...p, id, ...data } : p))
  return projects.find((p) => p.id === id)!
}

export async function deleteProject(id: string) {
  await delay()
  projects = projects.filter((p) => p.id !== id)
}