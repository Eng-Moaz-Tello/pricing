import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '../types/project'
import { getProjects, deleteProject } from '../services/projectsService'
import { getIncomingEntities } from '../services/incomingEntitiesService'
import { getContractors } from '../services/contractorsService'
import PageHeader from '../components/ui/PageHeader'
import DataTable, { type Column } from '../components/ui/DataTable'
import { formatNumber, projectTotals } from '../utils/format'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [entityMap, setEntityMap] = useState<Record<string, string>>({})
  const [contractorMap, setContractorMap] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    const [p, ents, cons] = await Promise.all([
      getProjects(), getIncomingEntities(), getContractors(),
    ])
    setProjects(p)
    setEntityMap(Object.fromEntries(ents.map((e) => [e.id, e.name])))
    setContractorMap(Object.fromEntries(cons.map((c) => [c.id, c.name])))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(p: Project) {
    if (!confirm('متأكد من حذف المشروع؟')) return
    await deleteProject(p.id)
    load()
  }

  const columns: Column<Project>[] = [
    { header: 'المشروع', cell: (p) => p.name, className: 'font-medium text-charcoal' },
    { header: 'الجهة الواردة', cell: (p) => entityMap[p.incomingEntityId] ?? '—' },
    { header: 'المتعهد', cell: (p) => contractorMap[p.contractorId] ?? '—' },
    { header: 'الفترة', cell: (p) => `${p.startDate} — ${p.endDate}` },
    { header: 'إجمالي (ل.س)', cell: (p) => formatNumber(projectTotals(p.items).syp) },
    { header: 'إجمالي ($)', cell: (p) => formatNumber(projectTotals(p.items).usd) },
  ]

  return (
    <div>
      <PageHeader
        title="المشاريع"
        subtitle="إدارة مشاريع التسعير"
        actionLabel="+ مشروع جديد"
        onAction={() => navigate('/projects/new')}
      />
      <DataTable
        columns={columns}
        rows={projects}
        loading={loading}
        emptyText="لا يوجد مشاريع بعد"
        onEdit={(p) => navigate(`/projects/${p.id}`)}
        onDelete={handleDelete}
      />
    </div>
  )
}