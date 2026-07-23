import { useEffect, useState, type FormEvent } from 'react'
import type { IncomingEntity } from '../types/incomingEntity'
import {
  getIncomingEntities, createIncomingEntity, updateIncomingEntity, deleteIncomingEntity,
} from '../services/incomingEntitiesService'
import { useCrud } from '../hooks/useCrud'
import PageHeader from '../components/ui/PageHeader'
import DataTable, { type Column } from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import TextField from '../components/ui/TextField'
import FormActions from '../components/ui/FormActions'

const columns: Column<IncomingEntity>[] = [
  { header: 'الاسم', cell: (e) => e.name, className: 'font-medium text-charcoal' },
  { header: 'ملاحظات', cell: (e) => e.notes || '—' },
]

export default function IncomingEntitiesPage() {
  const crud = useCrud<IncomingEntity>({
    getAll: getIncomingEntities,
    create: createIncomingEntity,
    update: updateIncomingEntity,
    remove: deleteIncomingEntity,
  })

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (crud.modalOpen) {
      setName(crud.editing?.name ?? '')
      setNotes(crud.editing?.notes ?? '')
    }
  }, [crud.modalOpen, crud.editing])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    crud.save({ name: name.trim(), notes: notes.trim() || undefined })
  }

  return (
    <div>
      <PageHeader
        title="الجهات الواردة"
        subtitle="إضافة وتعديل الجهات الطالبة للمشاريع"
        actionLabel="+ إضافة جهة"
        onAction={crud.openCreate}
      />

      <DataTable
        columns={columns}
        rows={crud.items}
        loading={crud.loading}
        emptyText="لا يوجد جهات بعد"
        onEdit={crud.openEdit}
        onDelete={(e) => crud.remove(e.id, 'متأكد من حذف الجهة؟')}
      />

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'تعديل جهة واردة' : 'إضافة جهة واردة'}
        onClose={crud.closeModal}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="الاسم" value={name} onChange={setName} placeholder="مثال: شركة الشام للإنشاءات" autoFocus />
          <TextField label="ملاحظات (اختياري)" value={notes} onChange={setNotes} />
          <FormActions onCancel={crud.closeModal} saving={crud.saving} disabled={!name.trim()} />
        </form>
      </Modal>
    </div>
  )
}