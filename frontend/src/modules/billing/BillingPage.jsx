import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import MenuCard from './MenuCard.jsx'
import CartPanel from './CartPanel.jsx'
import { useTickets } from './useTickets.js'
import { apiGet, apiPost } from '../../api/client.js'

// Fallback data so the screen still works if the API/DB is not connected yet.
const FALLBACK_ITEMS = [
  { id: 1, name: 'Half Biryani', price: '8.50', type: 'HALF' },
  { id: 2, name: 'Full Biryani', price: '12.00', type: 'FULL' },
  { id: 3, name: 'Family Pack Biryani', price: '28.00', type: 'FAMILY' },
  { id: 4, name: 'Iced Latte', price: '4.50', type: 'HALF' },
]

const CATEGORIES = ['ALL', 'HALF', 'FULL', 'FAMILY']

export default function BillingPage() {
  // --- Menu items state ---
  const [items, setItems] = useState([]) // items shown in the grid
  const [loading, setLoading] = useState(true) // true while fetching
  const [loadError, setLoadError] = useState('') // banner text if fetch fails

  // --- Filter + checkout state ---
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('') // menu search text
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', text }

  // Until auth exists, the cashier name is a placeholder.
  const cashierName = 'Cashier'

  // --- Multiple tickets (parallel ordering) live in the custom hook ---
  const {
    cart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totals,
    taxRate,
    discountRate,
    setTaxRate,
    setDiscountRate,
    extraCharge,
    addExtraCharge,
    setExtraCharge,
    paymentMethod,
    setPaymentMethod,
    tickets,
    activeId,
    activeNumber,
    newOrder,
    switchTicket,
    closeTicket,
    completeActiveOrder,
  } = useTickets()

  // Fetch menu items once when the page first loads
  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true)
        // Calls GET http://localhost:5000/api/v1/billing/items
        const data = await apiGet('/billing/items')
        setItems(data.items || [])
        setLoadError('')
      } catch (error) {
        // If the backend/DB is down, use fallback data so UI still works
        console.error('Failed to load items:', error)
        setItems(FALLBACK_ITEMS)
        setLoadError('Could not reach the server — showing sample items.')
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, []) // empty array = run only once on mount

  // Auto-dismiss the toast after 3 seconds
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer) // cleanup if toast changes/unmounts
  }, [toast])

  // How many of each item are in the cart, keyed by item id: { 1: 2, 3: 1 }
  const cartQtyById = cart.reduce((map, line) => {
    map[line.item.id] = line.quantity
    return map
  }, {})

  // Keep a percentage between 0 and 100
  const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0))

  // Filter items by category AND search text
  const visibleItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'ALL' || item.type === activeCategory
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Send the cart to the backend to store the sale
  async function handleCheckout() {
    try {
      setIsSaving(true)
      setToast(null)

      // Backend expects items + the user's tax / discount / add-on choices
      const body = {
        items: cart.map((line) => ({
          item_id: line.item.id,
          quantity: line.quantity,
        })),
        payment_method: paymentMethod,
        tax_rate: taxRate,
        discount_rate: discountRate,
        extra_charge: extraCharge,
      }

      const result = await apiPost('/billing/orders', body)

      // Success — show the saved order id and close this ticket
      setToast({ type: 'success', text: `Order #${result.order_id} saved!` })
      completeActiveOrder()
    } catch (error) {
      console.error('Checkout failed:', error)
      setToast({ type: 'error', text: error.message || 'Checkout failed.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Toast notification (top-right, auto-dismisses) */}
      {toast && (
        <div
          className={
            'fixed top-4 right-4 z-50 rounded-lg px-4 py-2 text-sm font-medium shadow-lg ' +
            (toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white')
          }
        >
          {toast.text}
        </div>
      )}

      <Sidebar onNewOrder={newOrder} />

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

        {/* Parallel order tabs — one tab per open ticket */}
        <div className="flex items-center gap-2 px-5 py-2 bg-white border-b border-slate-200 overflow-x-auto">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => switchTicket(t.id)}
              className={
                'flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium cursor-pointer shrink-0 ' +
                (t.id === activeId
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
              }
            >
              <span>Ticket #{t.number}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation() // don't also trigger switch
                  closeTicket(t.id)
                }}
                aria-label={`Close ticket ${t.number}`}
                className={
                  t.id === activeId
                    ? 'text-white/80 hover:text-white'
                    : 'text-slate-400 hover:text-rose-500'
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={newOrder}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 shrink-0"
          >
            + New
          </button>
        </div>

        {/* Menu area + cart */}
        <div className="flex flex-1 overflow-hidden">
          <section className="flex-1 p-5 overflow-y-auto">
            {/* Warning banner if the API could not be reached */}
            {loadError && (
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2">
                {loadError}
              </div>
            )}

            {/* Search box */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu…"
              className="w-full mb-4 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />

            {/* Category filter pills */}
            <div className="flex gap-2 mb-5">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={
                    'px-4 py-1.5 rounded-full text-xs font-medium ' +
                    (activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600')
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Loading / empty / grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Skeleton placeholder cards while items load */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl p-3 animate-pulse"
                  >
                    <div className="h-24 bg-slate-200 rounded-lg mb-3" />
                    <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : visibleItems.length === 0 ? (
              <p className="text-sm text-slate-500">No items found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addItem}
                    quantityInCart={cartQtyById[item.id] || 0}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Cart receives all state + handlers as props */}
          <CartPanel
            cart={cart}
            totals={totals}
            ticketNumber={activeNumber}
            cashierName={cashierName}
            paymentMethod={paymentMethod}
            onPaymentChange={setPaymentMethod}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onClear={clearCart}
            onCheckout={handleCheckout}
            isSaving={isSaving}
            taxRate={taxRate}
            discountRate={discountRate}
            onTaxChange={(v) => setTaxRate(clampPercent(v))}
            onDiscountChange={(v) => setDiscountRate(clampPercent(v))}
            onAddExtra={addExtraCharge}
            onClearExtra={() => setExtraCharge(0)}
          />
        </div>
      </main>
    </div>
  )
}
