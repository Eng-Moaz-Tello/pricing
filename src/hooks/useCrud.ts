import { useEffect, useState, useCallback, useRef } from 'react'

export interface CrudService<T extends { id: string }> {
  getAll: () => Promise<T[]>
  create: (data: Omit<T, 'id'>) => Promise<T>
  update: (id: string, data: Omit<T, 'id'>) => Promise<T>
  remove: (id: string) => Promise<void>
}

export function useCrud<T extends { id: string }>(service: CrudService<T>) {
  // منخزّن السيرفس بـ ref حتى لو الصفحة مرّرت object جديد كل render
  // ما يصير عندنا loop لا نهائي بالـ useEffect
  const serviceRef = useRef(service)
  serviceRef.current = service

  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setItems(await serviceRef.current.getAll())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item: T) {
    setEditing(item)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  async function save(data: Omit<T, 'id'>) {
    setSaving(true)
    if (editing) {
      await serviceRef.current.update(editing.id, data)
    } else {
      await serviceRef.current.create(data)
    }
    setSaving(false)
    setModalOpen(false)
    await load()
  }

  async function remove(id: string, confirmMessage = 'متأكد من الحذف؟') {
    if (!confirm(confirmMessage)) return
    await serviceRef.current.remove(id)
    await load()
  }

  return {
    items, loading, modalOpen, editing, saving,
    openCreate, openEdit, closeModal, save, remove, reload: load,
  }
}