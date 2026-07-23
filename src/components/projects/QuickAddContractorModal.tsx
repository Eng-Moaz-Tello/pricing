import { useEffect, useState, type FormEvent } from 'react'
import type { Contractor } from '../../types/contractor'
import { createContractor } from '../../services/contractorsService'
import Modal from '../ui/Modal'
import TextField from '../ui/TextField'
import FormActions from '../ui/FormActions'

type FormState = Omit<Contractor, 'id'>

const emptyForm: FormState = {
  name: '', phone: '', birthDate: '', nationalId: '', hasCompany: false, companyName: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (contractor: Contractor) => void
}

export default function QuickAddContractorModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (open) setForm(emptyForm) }, [open])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const created = await createContractor({
      ...form,
      name: form.name.trim(),
      companyName: form.hasCompany ? form.companyName?.trim() || undefined : undefined,
    })
    setSaving(false)
    onCreated(created)
    onClose()
  }

  return (
    <Modal open={open} title="متعهد جديد" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="الاسم" value={form.name} onChange={(v) => setField('name', v)} autoFocus />
          <TextField label="رقم الهاتف" value={form.phone} onChange={(v) => setField('phone', v)} />
          <TextField label="الرقم الوطني" value={form.nationalId} onChange={(v) => setField('nationalId', v)} />
          <TextField label="تاريخ الولادة" type="date" value={form.birthDate} onChange={(v) => setField('birthDate', v)} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.hasCompany}
            onChange={(e) => setField('hasCompany', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-charcoal">تابع لشركة</span>
        </label>

        {form.hasCompany && (
          <TextField
            label="اسم الشركة"
            value={form.companyName ?? ''}
            onChange={(v) => setField('companyName', v)}
          />
        )}

        <FormActions onCancel={onClose} saving={saving} disabled={!form.name.trim()} />
      </form>
    </Modal>
  )
}