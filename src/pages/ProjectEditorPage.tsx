import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types/project";
import {
  getProject,
  createProject,
  updateProject,
} from "../services/projectsService";
import { getIncomingEntities } from "../services/incomingEntitiesService";
import { getContractors } from "../services/contractorsService";
import TextField from "../components/ui/TextField";
import SelectField, { type Option } from "../components/ui/SelectField";
import { getCatalogItems } from "../services/catalogItemsService";
import type { CatalogItem } from "../types/catalogItem";
import ProjectItemsEditor from "../components/projects/ProjectItemsEditor";
type FormState = Omit<Project, "id">;

const emptyForm: FormState = {
  name: "",
  startDate: "",
  endDate: "",
  signaturePlace: "",
  incomingEntityId: "",
  contractorId: "",
  items: [],
};

export default function ProjectEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [entityOptions, setEntityOptions] = useState<Option[]>([]);
  const [contractorOptions, setContractorOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  useEffect(() => {
    async function init() {
      setLoading(true);
      const [ents, cons, cats] = await Promise.all([
        getIncomingEntities(),
        getContractors(),
        getCatalogItems(),
      ]);
      setEntityOptions(ents.map((e) => ({ value: e.id, label: e.name })));
      setContractorOptions(cons.map((c) => ({ value: c.id, label: c.name })));
      setCatalogItems(cats);
      if (id) {
        const project = await getProject(id);
        if (project) {
          const { id: _id, ...rest } = project;
          setForm(rest);
        }
      }
      setLoading(false);
    }
    init();
  }, [id]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const canSave =
    form.name.trim() && form.incomingEntityId && form.contractorId;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    const data = { ...form, name: form.name.trim() };
    if (id) {
      await updateProject(id, data);
    } else {
      await createProject(data);
    }
    setSaving(false);
    navigate("/projects");
  }

  if (loading) return <p className="text-muted">جاري التحميل…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-charcoal">
          {isEdit ? "تعديل مشروع" : "مشروع جديد"}
        </h2>
        <button
          onClick={() => navigate("/projects")}
          className="text-charcoal hover:bg-mint text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          رجوع
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
          <h3 className="text-lg font-bold text-charcoal mb-4">
            بيانات المشروع
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="اسم المشروع"
              value={form.name}
              onChange={(v) => setField("name", v)}
              autoFocus
            />
            <TextField
              label="مكان التوقيع"
              value={form.signaturePlace}
              onChange={(v) => setField("signaturePlace", v)}
              placeholder="مثال: دمشق"
            />
            <TextField
              label="تاريخ البدء"
              type="date"
              value={form.startDate}
              onChange={(v) => setField("startDate", v)}
            />
            <TextField
              label="تاريخ الانتهاء"
              type="date"
              value={form.endDate}
              onChange={(v) => setField("endDate", v)}
            />
            <SelectField
              label="الجهة الواردة"
              value={form.incomingEntityId}
              onChange={(v) => setField("incomingEntityId", v)}
              options={entityOptions}
              placeholder="اختر جهة…"
            />
            <SelectField
              label="المتعهد"
              value={form.contractorId}
              onChange={(v) => setField("contractorId", v)}
              options={contractorOptions}
              placeholder="اختر متعهد…"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
          <h3 className="text-lg font-bold text-charcoal mb-4">بنود التسعير</h3>
          <ProjectItemsEditor
            items={form.items}
            catalogItems={catalogItems}
            onChange={(items) => setField("items", items)}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-mint transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving || !canSave}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "جاري الحفظ…" : "حفظ المشروع"}
          </button>
        </div>
      </form>
    </div>
  );
}
