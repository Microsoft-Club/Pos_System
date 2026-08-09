import Sidebar from './Sidebar.jsx'
import MenuCard from './MenuCard.jsx'
import CartPanel from './CartPanel.jsx'

// Temporary data so the UI works without PostgreSQL.
// Shape matches GET /billing/items so Phase 4 can swap this cleanly.
const Temp_items = [
  { id: 1, name: 'Half Biryani', price: '8.50', type: 'HALF' },
  { id: 2, name: 'Full Biryani', price: '12.00', type: 'FULL' },
  { id: 3, name: 'Family Pack Biryani', price: '28.00', type: 'FAMILY' },
  { id: 4, name: 'Iced Latte', price: '4.50', type: 'HALF' },
]

const Categories = ['ALL', 'HALF', 'FULL', 'FAMILY']

export default function BillingPage() {
  function handleAddItem(item) {
    console.log('Add to cart:', item.name)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-6">
          <span className="font-bold text-blue-600">Pak POS</span>
          <nav className="flex gap-4 text-sm text-slate-600">
            <span className="text-blue-600 font-medium">Dashboard</span>
            <span>Inventory</span>
            <span>Reports</span>
          </nav>
        </header>

        {/* Menu area + cart */}
        <div className="flex flex-1 overflow-hidden">
          <section className="flex-1 p-5 overflow-y-auto">
            {/* Category filter pills */}
            <div className="flex gap-2 mb-5">
              {Categories.map((category, index) => (
                <button
                  key={category}
                  className={
                    'px-4 py-1.5 rounded-full text-xs font-medium ' +
                    (index === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600')
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Temp_items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddItem}
                />
              ))}
            </div>
          </section>

          <CartPanel />
        </div>
      </main>
    </div>
  )
}
