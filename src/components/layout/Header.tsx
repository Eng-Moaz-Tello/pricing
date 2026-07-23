export default function Header() {
  return (
    <header className="h-16 bg-primary text-white flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-2xl font-bold">لجنة التسعير</h1>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-sm font-medium">معاذ تللو</div>
          <div className="text-xs text-white/70">موظف</div>
        </div>
        <button className="bg-danger hover:opacity-90 text-sm px-4 py-1.5 rounded-md transition">
          خروج
        </button>
      </div>
    </header>
  )
}