import { type ReactNode } from 'react'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  loading: boolean
  emptyText?: string
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

export default function DataTable<T extends { id: string }>({
  columns, rows, loading, emptyText = 'لا يوجد بيانات بعد', onEdit, onDelete,
}: DataTableProps<T>) {
  const colCount = columns.length + 1

  return (
    <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
      <table className="w-full text-right">
        <thead>
          <tr className="text-muted text-sm border-b border-black/5">
            {columns.map((c, i) => (
              <th key={i} className="font-medium px-6 py-4">{c.header}</th>
            ))}
            <th className="font-medium px-6 py-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={colCount} className="text-center text-muted py-8">جاري التحميل…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={colCount} className="text-center text-muted py-8">{emptyText}</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-black/5 last:border-0">
                {columns.map((c, i) => (
                  <td key={i} className={`px-6 py-4 ${c.className ?? 'text-muted'}`}>
                    {c.cell(row)}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => onEdit(row)} className="text-charcoal hover:text-primary text-sm">تعديل</button>
                    <button onClick={() => onDelete(row)} className="text-danger hover:opacity-80 text-sm">حذف</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}