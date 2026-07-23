import type { IncomingEntity } from '../types/incomingEntity'

let entities: IncomingEntity[] = [
  { id: '1', name: 'محافظة دمشق', notes: 'قسم المعلوماتية طابق ٤' },
  { id: '2', name: 'مديرية الاتصالات' },
]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getIncomingEntities(): Promise<IncomingEntity[]> {
  await delay()
  return [...entities]
}

export async function createIncomingEntity(data: Omit<IncomingEntity, 'id'>) {
  await delay()
  const entity: IncomingEntity = { ...data, id: crypto.randomUUID() }
  entities.push(entity)
  return entity
}

export async function updateIncomingEntity(id: string, data: Omit<IncomingEntity, 'id'>) {
  await delay()
  entities = entities.map((e) => (e.id === id ? { ...e, ...data } : e))
  return entities.find((e) => e.id === id)!
}

export async function deleteIncomingEntity(id: string) {
  await delay()
  entities = entities.filter((e) => e.id !== id)
}