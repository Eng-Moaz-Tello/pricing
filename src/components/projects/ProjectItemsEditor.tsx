import type { ProjectItem } from '../../types/project'
import type { CatalogItem } from '../../types/catalogItem'
import { formatNumber, projectTotals } from '../../utils/format'

interface Props {
  items: ProjectItem[]
  catalogItems: CatalogItem[]
  onChange: (items: ProjectItem[]) => void
}

const numClass =
  'w-full border border-black/10 rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'

export default function ProjectItemsEditor({ items, catalogItems, onChange }: Props) {
  const catalogMap = Object.fromEntries(catalogItems.map((c) => [c.id, c]))
  const totals = projectTotals(items)

  function updateItem(id: string, patch: Partial<ProjectItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addItem() {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        catalogItemId: '',
        unit: '',
        quantity: 0,
        unitPriceSYP: 0,
        unitPriceUSD: 0,
        specValues: {},
      },
    ])
  }

  function removeItem(id: string) {
    onChange(items.filter((it) => it.id !== id))
  }

  // لما نختار بند من الكتالوج: ننسخ وحدتو ونفضّي قيم المواصفات حسب حقولو
  function selectCatalog(itemId: string, catalogItemId: string) {
    const catalog = catalogMap[catalogItemId]
    updateItem(itemId, {
      catalogItemId,
      unit: catalog?.defaultUnit ?? '',
      specValues: {},
    })
  }

  function updateSpecValue(itemId: string, fieldId: string, value: string) {
    const item = items.find((it) => it.id === itemId)
    if (!item) return
    updateItem(itemId, { specValues: { ...item.specValues, [fieldId]: value } })
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <p className="text-muted text-sm">ما في بنود بعد — ضيف بند من الكتالوج.</p>
      ) : (
        items.map((item, idx) => {
          const catalog = catalogMap[item.catalogItemId]
          const lineSYP = item.quantity * item.unitPriceSYP
          const lineUSD = item.quantity * item.unitPriceUSD

          return (
            <div key={item.id} className="border border-black/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted">بند #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-danger hover:opacity-80 text-sm"
                >
                  حذف البند
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-charcoal mb-1.5">البند</label>
                <select
                  value={item.catalogItemId}
                  onChange={(e) => selectCatalog(item.id, e.target.value)}
                  className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  <option value="" disabled>اختر بند…</option>
                  {catalogItems.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {catalog && (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">الكمية</label>
                      <input
                        type="number" min="0"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                        className={numClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">الوحدة</label>
                      <input
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                        className={numClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">سعر إفرادي (ل.س)</label>
                      <input
                        type="number" min="0"
                        value={item.unitPriceSYP || ''}
                        onChange={(e) => updateItem(item.id, { unitPriceSYP: Number(e.target.value) || 0 })}
                        className={numClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">سعر إفرادي ($)</label>
                      <input
                        type="number" min="0"
                        value={item.unitPriceUSD || ''}
                        onChange={(e) => updateItem(item.id, { unitPriceUSD: Number(e.target.value) || 0 })}
                        className={numClass}
                      />
                    </div>
                  </div>

                  {/* قيم المواصفات الديناميكية حسب البند المختار */}
                  {catalog.specFields.length > 0 && (
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-muted mb-1.5">المواصفات</label>
                      <div className="grid grid-cols-2 gap-3">
                        {catalog.specFields.map((sf) => (
                          <div key={sf.id}>
                            <input
                              value={item.specValues[sf.id] ?? ''}
                              onChange={(e) => updateSpecValue(item.id, sf.id, e.target.value)}
                              placeholder={sf.label}
                              className={numClass}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* إجمالي البند */}
                  <div className="flex justify-end gap-6 text-sm border-t border-black/5 pt-3">
                    <span className="text-muted">
                      الإجمالي: <span className="font-bold text-charcoal">{formatNumber(lineSYP)}</span> ل.س
                    </span>
                    <span className="text-muted">
                      <span className="font-bold text-charcoal">{formatNumber(lineUSD)}</span> $
                    </span>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}

      <button
        type="button"
        onClick={addItem}
        className="self-start text-primary hover:opacity-80 text-sm font-medium"
      >
        + إضافة بند
      </button>

      {/* إجمالي المشروع */}
      {items.length > 0 && (
        <div className="flex justify-end gap-6 bg-mint/50 rounded-lg px-4 py-3 mt-2">
          <span className="text-charcoal font-medium">إجمالي المشروع:</span>
          <span className="font-bold text-primary">{formatNumber(totals.syp)} ل.س</span>
          <span className="font-bold text-primary">{formatNumber(totals.usd)} $</span>
        </div>
      )}
    </div>
  )
}