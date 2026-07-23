import type { RelatedWork } from '../types/relatedWork'

let works: RelatedWork[] = [
  { id: '1', name: 'أعمال معلوماتية' },
  { id: '2', name: 'أعمال إنشائية' },
  { id: '3', name: 'أعمال كهربائية' },
]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getRelatedWorks(): Promise<RelatedWork[]> {
  await delay()
  return [...works]
}

export async function createRelatedWork(data: Omit<RelatedWork, 'id'>) {
  await delay()
  const work: RelatedWork = { ...data, id: crypto.randomUUID() }
  works.push(work)
  return work
}

export async function updateRelatedWork(id: string, data: Omit<RelatedWork, 'id'>) {
  await delay()
  works = works.map((w) => (w.id === id ? { ...w, ...data } : w))
  return works.find((w) => w.id === id)!
}

export async function deleteRelatedWork(id: string) {
  await delay()
  works = works.filter((w) => w.id !== id)
}