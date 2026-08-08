import { useMemo, useState } from 'react'

/**
 * useTickets: manages MULTIPLE open orders (tickets) for parallel billing.
 * Each ticket has its own cart, tax, discount, add-on, and payment method.
 *
 * The hook exposes the ACTIVE ticket's data + operations (same names the
 * CartPanel already uses), plus ticket management (new / switch / close).
 */

// Create a fresh, empty ticket
function makeTicket(number) {
  return {
    // A unique id (crypto.randomUUID exists in modern browsers)
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
    number, // human-friendly number shown in the UI
    cart: [],
    taxRate: 0,
    discountRate: 0,
    extraCharge: 0,
    paymentMethod: 'CASH',
  }
}

export function useTickets() {
  // Start with one open ticket, numbered 1
  const [tickets, setTickets] = useState(() => [makeTicket(1)])
  const [activeId, setActiveId] = useState(() => tickets[0].id)
  const [nextNumber, setNextNumber] = useState(2) // next ticket number to assign

  // The currently selected ticket (fall back to the first if not found)
  const active = tickets.find((t) => t.id === activeId) || tickets[0]

  // Helper: update ONLY the active ticket, immutably
  function updateActive(updater) {
    setTickets((list) =>
      list.map((t) => (t.id === activeId ? updater(t) : t))
    )
  }

  // ----- Cart operations (act on the active ticket) -----

  function addItem(item) {
    updateActive((t) => {
      const existing = t.cart.find((line) => line.item.id === item.id)
      const cart = existing
        ? t.cart.map((line) =>
            line.item.id === item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [...t.cart, { item, quantity: 1 }]
      return { ...t, cart }
    })
  }

  function removeItem(itemId) {
    updateActive((t) => ({
      ...t,
      cart: t.cart.filter((line) => line.item.id !== itemId),
    }))
  }

  function updateQty(itemId, quantity) {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    updateActive((t) => ({
      ...t,
      cart: t.cart.map((line) =>
        line.item.id === itemId ? { ...line, quantity } : line
      ),
    }))
  }

  /** Empty the active ticket's cart and reset its tax/discount/add-on. */
  function clearCart() {
    updateActive((t) => ({
      ...t,
      cart: [],
      taxRate: 0,
      discountRate: 0,
      extraCharge: 0,
    }))
  }

  function setTaxRate(value) {
    updateActive((t) => ({ ...t, taxRate: value }))
  }

  function setDiscountRate(value) {
    updateActive((t) => ({ ...t, discountRate: value }))
  }

  function setExtraCharge(value) {
    updateActive((t) => ({ ...t, extraCharge: value }))
  }

  function addExtraCharge(amount) {
    const value = Number(amount)
    if (isNaN(value) || value === 0) return
    updateActive((t) => ({
      ...t,
      extraCharge: Number((t.extraCharge + value).toFixed(2)),
    }))
  }

  function setPaymentMethod(method) {
    updateActive((t) => ({ ...t, paymentMethod: method }))
  }

  // ----- Ticket management -----

  /** Open a brand-new empty ticket and switch to it. */
  function newOrder() {
    const ticket = makeTicket(nextNumber)
    setNextNumber((n) => n + 1)
    setTickets((list) => [...list, ticket])
    setActiveId(ticket.id)
  }

  /** Switch which ticket is active. */
  function switchTicket(id) {
    setActiveId(id)
  }

  /** Close a ticket. Always keep at least one open. */
  function closeTicket(id) {
    const remaining = tickets.filter((t) => t.id !== id)
    if (remaining.length === 0) {
      // Closed the last one — open a fresh empty ticket
      const ticket = makeTicket(nextNumber)
      setNextNumber((n) => n + 1)
      setTickets([ticket])
      setActiveId(ticket.id)
    } else {
      setTickets(remaining)
      // If we closed the active ticket, activate the first remaining one
      if (id === activeId) setActiveId(remaining[0].id)
    }
  }

  /** Called after a successful checkout — the active order is done, so close it. */
  function completeActiveOrder() {
    closeTicket(activeId)
  }

  // ----- Totals for the active ticket -----
  const totals = useMemo(() => {
    const subtotal = active.cart.reduce(
      (sum, line) => sum + Number(line.item.price) * line.quantity,
      0
    )
    const discountAmount = subtotal * (Number(active.discountRate) / 100)
    const taxableBase = subtotal - discountAmount
    const taxAmount = taxableBase * (Number(active.taxRate) / 100)
    const total = taxableBase + taxAmount + Number(active.extraCharge)

    const round = (n) => Number(n.toFixed(2))

    return {
      subtotal: round(subtotal),
      discountAmount: round(discountAmount),
      taxAmount: round(taxAmount),
      extraCharge: round(Number(active.extraCharge)),
      total: round(total),
      itemCount: active.cart.reduce((sum, line) => sum + line.quantity, 0),
    }
  }, [active])

  return {
    // Active ticket data
    cart: active.cart,
    taxRate: active.taxRate,
    discountRate: active.discountRate,
    extraCharge: active.extraCharge,
    paymentMethod: active.paymentMethod,
    totals,

    // Active ticket operations
    addItem,
    removeItem,
    updateQty,
    clearCart,
    setTaxRate,
    setDiscountRate,
    setExtraCharge,
    addExtraCharge,
    setPaymentMethod,

    // Ticket management (for parallel ordering)
    tickets,
    activeId,
    activeNumber: active.number,
    newOrder,
    switchTicket,
    closeTicket,
    completeActiveOrder,
  }
}
