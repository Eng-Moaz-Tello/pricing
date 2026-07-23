import { NavLink } from 'react-router-dom'

const links = [
  { to: '/incoming-entities', label: 'الجهات الواردة' },
  { to: '/contractors', label: 'المتعهدين' },
  { to: '/related-works', label: 'الأعمال المرتبطة' },
  { to: '/items', label: 'البنود' },
  { to: '/projects', label: 'المشاريع' },
  { to: '/projects/quick', label: 'إدخال مشروع فوري' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white p-4">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-primary text-white' : 'text-charcoal hover:bg-mint'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}