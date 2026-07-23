import { useEffect, useState, type FormEvent } from 'react'
import type { IncomingEntity } from '../../types/incomingEntity'
import { createIncomingEntity } from '../../services/incomingEntitiesService'
import Modal from '../ui/Modal'
import TextField from '../ui/TextField'
import FormActions from '../ui/FormActions'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (entity: IncomingEntity) => void
}

export default function QuickAddEntityModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setName(''); setNotes('') }
  }, [open])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const created = await createIncomingEntity({
      name: name.trim(),
      notes: notes.trim() || undefined,
    })
    setSaving(false)
    onCreated(created)
    onClose()
  }

  return (
    <Modal open={open} title="جهة واردة جديدة" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="الاسم" value={name} onChange={setName} placeholder="مثال: شركة الشام للإنشاءات" autoFocus />
        <TextField label="ملاحظات (اختياري)" value={notes} onChange={setNotes} />
        <FormActions onCancel={onClose} saving={saving} disabled={!name.trim()} />
      </form>
    </Modal>
  )
}