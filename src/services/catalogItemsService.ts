import type { CatalogItem } from '../types/catalogItem'

let items: CatalogItem[] = [
  {
    id: '1',
    name: 'شبابيك ألمنيوم',
    defaultUnit: 'م²',
    relatedWorkId: '2', // أعمال إنشائية
    specFields: [
      { id: 's1', label: 'نوع المادة' },
      { id: 's2', label: 'الأبعاد' },
      { id: 's3', label: 'نوع الزجاج' },
    ],
  },
  {
    id: '2',
    name: 'حواسيب مكتبية',
    defaultUnit: 'جهاز',
    relatedWorkId: '1', // أعمال معلوماتية
    specFields: [
      { id: 's4', label: 'المعالج' },
      { id: 's5', label: 'الذاكرة' },
      { id: 's6', label: 'التخزين' },
    ],
  },
]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function getCatalogItems(): Promise<CatalogItem[]> {
  await delay()
  return [...items]
}

export async function createCatalogItem(data: Omit<CatalogItem, 'id'>) {
  await delay()
  const item: CatalogItem = { ...data, id: crypto.randomUUID() }
  items.push(item)
  return item
}

export async function updateCatalogItem(id: string, data: Omit<CatalogItem, 'id'>) {
  await delay()
  items = items.map((i) => (i.id === id ? { ...i, id, ...data } : i))
  return items.find((i) => i.id === id)!
}

export async function deleteCatalogItem(id: string) {
  await delay()
  items = items.filter((i) => i.id !== id)
}