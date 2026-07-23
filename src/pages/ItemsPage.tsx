import { useEffect, useState, type FormEvent } from 'react'
import type { CatalogItem, SpecField } from '../types/catalogItem'
import type { RelatedWork } from '../types/relatedWork'
import {
  getCatalogItems, createCatalogItem, updateCatalogItem, deleteCatalogItem,
} from '../services/catalogItemsService'
import { getRelatedWorks } from '../services/relatedWorksService'
import { useCrud } from '../hooks/useCrud'
import PageHeader from '../components/ui/PageHeader'
import DataTable, { type Column } from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import TextField from '../components/ui/TextField'
import SelectField from '../components/ui/SelectField'
import FormActions from '../components/ui/FormActions'

interface FormState {
  name: string
  defaultUnit: string
  relatedWorkId: string
  specFields: SpecField[]
}

const emptyForm: FormState = { name: '', defaultUnit: '', relatedWorkId: '', specFields: [] }

const inputClass =
  'w-full border border-black/10 rounded-lg px-4 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'

export default function ItemsPage() {
  const crud = useCrud<CatalogItem>({
    getAll: getCatalogItems,
    create: createCatalogItem,
    update: updateCatalogItem,
    remove: deleteCatalogItem,
  })

  const [relatedWorks, setRelatedWorks] = useState<RelatedWork[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)

  // منجيب الأعمال المرتبطة حتى نعرض اسمها بالجدول ونعبّي القائمة المنسدلة
  useEffect(() => { getRelatedWorks().then(setRelatedWorks) }, [])

  const workMap = Object.fromEntries(relatedWorks.map((w) => [w.id, w.name]))
  const workOptions = relatedWorks.map((w) => ({ value: w.id, label: w.name }))

  useEffect(() => {
    if (!crud.modalOpen) return
    if (crud.editing) {
      const { id, ...rest } = crud.editing
      setForm({ ...rest, specFields: rest.specFields.map((s) => ({ ...s })) })
    } else {
      setForm(emptyForm)
    }
  }, [crud.modalOpen, crud.editing])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // إدارة حقول المواصفات الديناميكية
  function addSpecField() {
    setForm((f) => ({ ...f, specFields: [...f.specFields, { id: crypto.randomUUID(), label: '' }] }))
  }
  function updateSpecField(id: string, label: string) {
    setForm((f) => ({ ...f, specFields: f.specFields.map((s) => (s.id === id ? { ...s, label } : s)) }))
  }
  function removeSpecField(id: string) {
    setForm((f) => ({ ...f, specFields: f.specFields.filter((s) => s.id !== id) }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.relatedWorkId) return
    crud.save({
      name: form.name.trim(),
      defaultUnit: form.defaultUnit.trim(),
      relatedWorkId: form.relatedWorkId,
      specFields: form.specFields
        .map((s) => ({ ...s, label: s.label.trim() }))
        .filter((s) => s.label), // شيل المواصفات الفاضية
    })
  }

  const columns: Column<CatalogItem>[] = [
    { header: 'النوع', cell: (i) => i.name, className: 'font-medium text-charcoal' },
    { header: 'الوحدة', cell: (i) => i.defaultUnit || '—' },
    { header: 'العمل المرتبط', cell: (i) => workMap[i.relatedWorkId] ?? '—' },
    {
      header: 'المواصفات',
      cell: (i) => i.specFields.map((s) => s.label).join('، ') || '—',
    },
  ]

  return (
    <div>
      <PageHeader
        title="كتالوج البنود"
        subtitle="أنواع البنود ومواصفاتها الافتراضية"
        actionLabel="+ إضافة بند"
        onAction={crud.openCreate}
      />

      <DataTable
        columns={columns}
        rows={crud.items}
        loading={crud.loading}
        emptyText="لا يوجد بنود بعد"
        onEdit={crud.openEdit}
        onDelete={(i) => crud.remove(i.id, 'متأكد من حذف البند؟')}
      />

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'تعديل بند' : 'إضافة بند'}
        onClose={crud.closeModal}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="النوع" value={form.name} onChange={(v) => setField('name', v)} placeholder="مثال: شبابيك ألمنيوم" autoFocus />
            <TextField label="الوحدة الافتراضية" value={form.defaultUnit} onChange={(v) => setField('defaultUnit', v)} placeholder="مثال: م²" />
          </div>

          <SelectField
            label="العمل المرتبط"
            value={form.relatedWorkId}
            onChange={(v) => setField('relatedWorkId', v)}
            options={workOptions}
            placeholder="اختر عمل مرتبط…"
          />

          {/* المواصفات الديناميكية */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-charcoal">المواصفات</label>
              <button type="button" onClick={addSpecField} className="text-primary hover:opacity-80 text-sm font-medium">
                + إضافة مواصفة
              </button>
            </div>

            {form.specFields.length === 0 ? (
              <p className="text-muted text-sm py-2">ما في مواصفات بعد — ضيف الحقول حسب نوع البند</p>
            ) : (
              <div className="flex flex-col gap-2">
                {form.specFields.map((sf) => (
                  <div key={sf.id} className="flex items-center gap-2">
                    <input
                      value={sf.label}
                      onChange={(e) => updateSpecField(sf.id, e.target.value)}
                      placeholder="اسم المواصفة: مثلاً الأبعاد"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecField(sf.id)}
                      className="text-danger hover:opacity-80 shrink-0 px-2 text-lg leading-none"
                      title="حذف"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormActions
            onCancel={crud.closeModal}
            saving={crud.saving}
            disabled={!form.name.trim() || !form.relatedWorkId}
          />
        </form>
      </Modal>
    </div>
  )
}