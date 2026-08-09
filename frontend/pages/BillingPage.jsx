import { useState, useEffect } from 'react'
import MenuCard from '../components/MenuCard.jsx'
import CartPanel from '../components/CartPanel.jsx'
import { useOutletContext } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export default function BillingPage() {
  const {user} = useOutletContext();
  const [items, setItems] = useState([])

  useEffect(() => {
    let cancelled = false

    async function loadItems() {
      try {
        const res = await fetch(`${API_BASE}/billing/items/${user.company_id}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (cancelled) return
        setItems(data.items || [])
      } catch {
        if (!cancelled) setItems([])
      }
    }

    loadItems()
    return () => {
      cancelled = true
    }
  }, [])

  function handleAddItem(item) {
    console.log('Add to cart:', item.name)
  }

  return (
    <div className="flex h-screen bg-slate-50">

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Menu area + cart */}
        <div className="flex flex-1 overflow-hidden">
          <section className="flex-1 p-5 overflow-y-auto">
            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
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
