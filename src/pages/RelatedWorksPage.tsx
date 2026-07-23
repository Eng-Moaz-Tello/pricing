import { useEffect, useState, type FormEvent } from 'react'
import type { RelatedWork } from '../types/relatedWork'
import {
  getRelatedWorks, createRelatedWork, updateRelatedWork, deleteRelatedWork,
} from '../services/relatedWorksService'
import { useCrud } from '../hooks/useCrud'
import PageHeader from '../components/ui/PageHeader'
import DataTable, { type Column } from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import TextField from '../components/ui/TextField'
import FormActions from '../components/ui/FormActions'

const columns: Column<RelatedWork>[] = [
  { header: 'الاسم', cell: (w) => w.name, className: 'font-medium text-charcoal' },
]

export default function RelatedWorksPage() {
  const crud = useCrud<RelatedWork>({
    getAll: getRelatedWorks,
    create: createRelatedWork,
    update: updateRelatedWork,
    remove: deleteRelatedWork,
  })

  const [name, setName] = useState('')

  // لما ينفتح المودال، عبّي الفورم من العنصر يلي عم نعدّلو (أو فضّيه للإضافة)
  useEffect(() => {
    if (crud.modalOpen) setName(crud.editing?.name ?? '')
  }, [crud.modalOpen, crud.editing])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    crud.save({ name: name.trim() })
  }

  return (
    <div>
      <PageHeader
        title="الأعمال المرتبطة"
        subtitle="تصنيفات الأعمال المرتبطة بالبنود"
        actionLabel="+ إضافة عمل"
        onAction={crud.openCreate}
      />

      <DataTable
        columns={columns}
        rows={crud.items}
        loading={crud.loading}
        emptyText="لا يوجد أعمال بعد"
        onEdit={crud.openEdit}
        onDelete={(w) => crud.remove(w.id, 'متأكد من حذف العمل المرتبط؟')}
      />

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'تعديل عمل مرتبط' : 'إضافة عمل مرتبط'}
        onClose={crud.closeModal}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="الاسم" value={name} onChange={setName} placeholder="مثال: أعمال معلوماتية" autoFocus />
          <FormActions onCancel={crud.closeModal} saving={crud.saving} disabled={!name.trim()} />
        </form>
      </Modal>
    </div>
  )
}