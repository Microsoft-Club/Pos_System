export default function Sidebar() {
  // Left navigation items
  const navigation = [
    { label: 'Sales', active: true },
    { label: 'Orders', active: false },
    { label: 'Menu', active: false },
    { label: 'Team', active: false },
    { label: 'Settings', active: false },
  ]

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Main Kitchen</h2>
        <p className="text-xs text-slate-500">Terminal 01</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.label}
            className={
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium ' +
              (item.active
                ? 'bg-blue-950 text-white'
                : 'text-slate-600 hover:bg-slate-100')
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold">
        + New Order
      </button>
    </aside>
  )
}
