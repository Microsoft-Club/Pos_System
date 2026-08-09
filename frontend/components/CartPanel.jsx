/**
 * CART AND BILLING SECTION
 * Right-hand ticket column from the POS design
 */
export default function CartPanel() {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col">
      <div className="flex items-start justify-between p-4 border-b border-slate-200">
        <div>
          <h2 className="font-bold text-slate-900">Ticket #402</h2>
          <p className="text-xs text-slate-500">John Doe</p>
        </div>
        <button className="text-xs font-medium text-rose-500 hover:underline">
          Clear All
        </button>
      </div>

      {/* Empty cart state */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-xl bg-blue-50 mb-4" />
        <p className="text-sm font-medium text-slate-700">Your cart is empty.</p>
        <p className="text-xs text-slate-400 mt-1">
          Tap an item from the menu to start a new order.
        </p>
      </div>

      {/* Bottom checkout section */}
      <div className="bg-blue-500 text-white p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {['Cash', 'Discount'].map((method, index) => (
            <button
              key={method}
              className={
                'py-2 rounded-lg text-xs font-medium ' +
                (index === 0
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-300')
              }
            >
              {method}
            </button>
          ))}
        </div>

        {/* Money summary */}
        <div className="space-y-1 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
        </div>

        {/* Grand total */}
        <div className="flex justify-between items-center border-t border-slate-700 pt-3">
          <span className="text-sm font-medium">Total</span>
          <span className="text-xl font-bold">$0.00</span>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 text-sm font-semibold">
          Checkout
        </button>
      </div>
    </aside>
  )
}
