import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project, ProjectItem } from '../types/project'
import type { CatalogItem } from '../types/catalogItem'
import { createProject } from '../services/projectsService'
import { getIncomingEntities } from '../services/incomingEntitiesService'
import { getContractors } from '../services/contractorsService'
import { getCatalogItems } from '../services/catalogItemsService'
import type { Option } from '../components/ui/SelectField'
import SelectWithCreate from '../components/ui/SelectWithCreate'
import TextField from '../components/ui/TextField'
import ProjectItemsEditor from '../components/projects/ProjectItemsEditor'
import QuickAddEntityModal from '../components/projects/QuickAddEntityModal'
import QuickAddContractorModal from '../components/projects/QuickAddContractorModal'

type FormState = Omit<Project, 'id'>

const emptyForm: FormState = {
  name: '', startDate: '', endDate: '', signaturePlace: '',
  incomingEntityId: '', contractorId: '', items: [],
}

export default function QuickProjectPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [entityOptions, setEntityOptions] = useState<Option[]>([])
  const [contractorOptions, setContractorOptions] = useState<Option[]>([])
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [entityModal, setEntityModal] = useState(false)
  const [contractorModal, setContractorModal] = useState(false)

  useEffect(() => {
    async function init() {
      const [ents, cons, cats] = await Promise.all([
        getIncomingEntities(), getContractors(), getCatalogItems(),
      ])
      setEntityOptions(ents.map((e) => ({ value: e.id, label: e.name })))
      setContractorOptions(cons.map((c) => ({ value: c.id, label: c.name })))
      setCatalogItems(cats)
      setLoading(false)
    }
    init()
  }, [])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const canSave = form.name.trim() && form.incomingEntityId && form.contractorId

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)
    await createProject({ ...form, name: form.name.trim() })
    setSaving(false)
    navigate('/projects')
  }

  if (loading) return <p className="text-muted">جاري التحميل…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-charcoal">إدخال مشروع فوري</h2>
          <p className="text-muted mt-1">أدخل المشروع وبنوده والجهة والمتعهد دفعة وحدة</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-charcoal hover:bg-mint text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          رجوع
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
          <h3 className="text-lg font-bold text-charcoal mb-4">بيانات المشروع</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="اسم المشروع" value={form.name} onChange={(v) => setField('name', v)} autoFocus />
            <TextField label="مكان التوقيع" value={form.signaturePlace} onChange={(v) => setField('signaturePlace', v)} placeholder="مثال: دمشق" />
            <TextField label="تاريخ البدء" type="date" value={form.startDate} onChange={(v) => setField('startDate', v)} />
            <TextField label="تاريخ الانتهاء" type="date" value={form.endDate} onChange={(v) => setField('endDate', v)} />
            <SelectWithCreate
              label="الجهة الواردة"
              value={form.incomingEntityId}
              onChange={(v) => setField('incomingEntityId', v)}
              options={entityOptions}
              onCreate={() => setEntityModal(true)}
              placeholder="اختر جهة…"
            />
            <SelectWithCreate
              label="المتعهد"
              value={form.contractorId}
              onChange={(v) => setField('contractorId', v)}
              options={contractorOptions}
              onCreate={() => setContractorModal(true)}
              placeholder="اختر متعهد…"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
          <h3 className="text-lg font-bold text-charcoal mb-4">بنود التسعير</h3>
          <ProjectItemsEditor
            items={form.items}
            catalogItems={catalogItems}
            onChange={(items: ProjectItem[]) => setField('items', items)}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-mint transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving || !canSave}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ…' : 'حفظ المشروع'}
          </button>
        </div>
      </form>

      <QuickAddEntityModal
        open={entityModal}
        onClose={() => setEntityModal(false)}
        onCreated={(entity) => {
          setEntityOptions((opts) => [...opts, { value: entity.id, label: entity.name }])
          setField('incomingEntityId', entity.id)
        }}
      />
      <QuickAddContractorModal
        open={contractorModal}
        onClose={() => setContractorModal(false)}
        onCreated={(contractor) => {
          setContractorOptions((opts) => [...opts, { value: contractor.id, label: contractor.name }])
          setField('contractorId', contractor.id)
        }}
      />
    </div>
  )
}