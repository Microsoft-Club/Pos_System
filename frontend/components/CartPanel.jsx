import { useState } from 'react'
import Calculator from './Calculator.jsx'

/**
 * CART AND BILLING SECTION (right-hand ticket column)
 *
 * props:
 *   cart            = [{ item, quantity }]
 *   totals          = { subtotal, discountAmount, taxAmount, total, itemCount }
 *   paymentMethod   = "CASH" | "CARD"
 *   onPaymentChange = fn(method)
 *   onUpdateQty     = fn(itemId, quantity)
 *   onRemove        = fn(itemId)
 *   onClear         = fn()
 *   onCheckout      = fn()
 *   isSaving        = boolean
 *   message         = string
 *   taxRate         = number (percent)
 *   discountRate    = number (percent)
 *   onTaxChange     = fn(number)
 *   onDiscountChange= fn(number)
 */
export default function CartPanel({
  cart,
  totals,
  ticketNumber,
  cashierName,
  paymentMethod,
  onPaymentChange,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  isSaving,
  taxRate,
  discountRate,
  onTaxChange,
  onDiscountChange,
  onAddExtra,
  onClearExtra,
}) {
  // Which add-on panel is open: null | 'customize' | 'calc'
  // Only one opens at a time, and only when its button is selected.
  const [activePanel, setActivePanel] = useState(null)

  // Two-step confirm for Clear All (prevents accidental wipe)
  const [confirmClear, setConfirmClear] = useState(false)

  const isEmpty = cart.length === 0

  // Toggle a panel: tap again to close it
  function togglePanel(panel) {
    setActivePanel((current) => (current === panel ? null : panel))
  }

  // First click asks to confirm; second click within 3s actually clears
  function handleClearClick() {
    if (confirmClear) {
      onClear()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <aside className="relative w-80 bg-white border-l border-slate-200 flex flex-col">
      {/* Calculator opens as a fixed popup to the left of this panel (stays on-screen) */}
      {activePanel === 'calc' && (
        <div className="fixed bottom-4 right-[21rem] w-64 z-40 rounded-xl shadow-2xl bg-blue-600">
          <div className="flex items-center justify-between px-3 pt-2 text-white">
            <span className="text-xs font-semibold">Calculator</span>
            <button
              onClick={() => setActivePanel(null)}
              aria-label="Close calculator"
              className="text-white/80 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
          <Calculator onAddToBill={onAddExtra} />
        </div>
      )}

      {/* Ticket header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-200">
        <div>
          <h2 className="font-bold text-slate-900">Ticket #{ticketNumber}</h2>
          <p className="text-xs text-slate-500">
            {cashierName} · {totals.itemCount} items
          </p>
        </div>
        {!isEmpty && (
          <button
            onClick={handleClearClick}
            className={
              'text-xs font-medium hover:underline ' +
              (confirmClear ? 'text-rose-700 font-bold' : 'text-rose-500')
            }
          >
            {confirmClear ? 'Confirm?' : 'Clear All'}
          </button>
        )}
      </div>

      {/* Cart body: empty state OR list of lines */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-xl bg-blue-50 mb-4" />
          <p className="text-sm font-medium text-slate-700">Your cart is empty.</p>
          <p className="text-xs text-slate-400 mt-1">
            Tap an item from the menu to start a new order.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.map((line) => {
            // Line total = unit price × quantity
            const lineTotal = Number(line.item.price) * line.quantity
            return (
              <div key={line.item.id} className="bg-slate-50 rounded-lg p-2">
                {/* Top row: name + unit price on the left, line total + remove on the right */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {line.item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatRs(line.item.price)} each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatRs(lineTotal)}
                    </p>
                    <button
                      onClick={() => onRemove(line.item.id)}
                      aria-label={`Remove ${line.item.name}`}
                      className="text-rose-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Bottom row: quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onUpdateQty(line.item.id, line.quantity - 1)}
                    aria-label={`Decrease ${line.item.name}`}
                    className="w-6 h-6 rounded bg-slate-200 text-slate-700 text-sm"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm">{line.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(line.item.id, line.quantity + 1)}
                    aria-label={`Increase ${line.item.name}`}
                    className="w-6 h-6 rounded bg-blue-600 text-white text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom checkout section — white/blue to match the page */}
      <div className="border-t border-slate-200 p-4 space-y-3">
        {/* Action row: Cash payment, Discount / Calc open panels */}
        <div className="grid grid-cols-3 gap-2">
          {/* Payment method */}
          <button
            onClick={() => onPaymentChange('CASH')}
            className={
              'py-2 rounded-lg text-xs font-medium border ' +
              (paymentMethod === 'CASH'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')
            }
          >
            Cash
          </button>

          {/* Discount panel toggle */}
          <button
            onClick={() => togglePanel('customize')}
            className={
              'py-2 rounded-lg text-xs font-medium border ' +
              (activePanel === 'customize'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')
            }
          >
            Dis %
          </button>

          {/* Calculator panel toggle */}
          <button
            onClick={() => togglePanel('calc')}
            className={
              'py-2 rounded-lg text-xs font-medium border ' +
              (activePanel === 'calc'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')
            }
          >
            Calc
          </button>
        </div>

        {/* Customize panel: user sets tax % and discount % */}
        {activePanel === 'customize' && (
          <div className="rounded-xl border border-slate-200 p-3 space-y-3 bg-slate-50">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                Discount (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={discountRate}
                onChange={(e) => onDiscountChange(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Tax (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => onTaxChange(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        )}

        {/* Money summary */}
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRs(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-rose-600">
              <span>Discount ({discountRate}%)</span>
              <span>− {formatRs(totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax ({taxRate}%)</span>
            <span>{formatRs(totals.taxAmount)}</span>
          </div>
          {totals.extraCharge > 0 && (
            <div className="flex justify-between items-center text-blue-600">
              <span className="flex items-center gap-1">
                Add-on
                <button
                  onClick={onClearExtra}
                  className="text-rose-500 hover:underline"
                  title="Remove add-on"
                >
                  ✕
                </button>
              </span>
              <span>+ {formatRs(totals.extraCharge)}</span>
            </div>
          )}
        </div>

        {/* Grand total */}
        <div className="flex justify-between items-center border-t border-slate-200 pt-3">
          <span className="text-sm font-medium text-slate-700">Total</span>
          <span className="text-xl font-bold text-blue-600">
            {formatRs(totals.total)}
          </span>
        </div>

        <button
          onClick={onCheckout}
          disabled={isEmpty || isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-semibold"
        >
          {isSaving ? 'Saving…' : 'Checkout'}
        </button>
      </div>
    </aside>
  )
}
