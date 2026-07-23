import { useEffect, useState, type FormEvent } from 'react'
import type { Contractor } from '../types/contractor'
import {
  getContractors, createContractor, updateContractor, deleteContractor,
} from '../services/contractorsService'
import { useCrud } from '../hooks/useCrud'
import PageHeader from '../components/ui/PageHeader'
import DataTable, { type Column } from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import TextField from '../components/ui/TextField'
import FormActions from '../components/ui/FormActions'

type FormState = Omit<Contractor, 'id'>

const emptyForm: FormState = {
  name: '', phone: '', birthDate: '', nationalId: '', hasCompany: false, companyName: '',
}

const columns: Column<Contractor>[] = [
  { header: 'الاسم', cell: (c) => c.name, className: 'font-medium text-charcoal' },
  { header: 'رقم الهاتف', cell: (c) => c.phone || '—' },
  { header: 'الرقم الوطني', cell: (c) => c.nationalId || '—' },
  { header: 'الشركة', cell: (c) => (c.hasCompany ? c.companyName || '—' : 'مستقل') },
]

export default function ContractorsPage() {
  const crud = useCrud<Contractor>({
    getAll: getContractors,
    create: createContractor,
    update: updateContractor,
    remove: deleteContractor,
  })

  const [form, setForm] = useState<FormState>(emptyForm)

  // عبّي الفورم من العنصر يلي عم نعدّلو، أو فضّيه للإضافة
  useEffect(() => {
    if (!crud.modalOpen) return
    if (crud.editing) {
      const { id, ...rest } = crud.editing
      setForm({ ...rest, companyName: rest.companyName ?? '' })
    } else {
      setForm(emptyForm)
    }
  }, [crud.modalOpen, crud.editing])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    crud.save({
      ...form,
      name: form.name.trim(),
      companyName: form.hasCompany ? form.companyName?.trim() || undefined : undefined,
    })
  }

  return (
    <div>
      <PageHeader
        title="المتعهدين"
        subtitle="إدارة المتعهدين المرتبطين بالمشاريع"
        actionLabel="+ إضافة متعهد"
        onAction={crud.openCreate}
      />

      <DataTable
        columns={columns}
        rows={crud.items}
        loading={crud.loading}
        emptyText="لا يوجد متعهدين بعد"
        onEdit={crud.openEdit}
        onDelete={(c) => crud.remove(c.id, 'متأكد من حذف المتعهد؟')}
      />

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'تعديل متعهد' : 'إضافة متعهد'}
        onClose={crud.closeModal}
      >
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
              placeholder="مثال: مؤسسة العلي للمقاولات"
            />
          )}

          <FormActions onCancel={crud.closeModal} saving={crud.saving} disabled={!form.name.trim()} />
        </form>
      </Modal>
    </div>
  )
}