import { formatRs } from '../../utils/money.js'

/*
 * MenuCard Component
 *
 * props:
 *   item            = { id, name, price, type }
 *   onAddToCart     = fn(item)
 *   quantityInCart  = number (0 if not in cart) — shows a badge + highlight
 */
export default function MenuCard({ item, onAddToCart, quantityInCart = 0 }) {
  const inCart = quantityInCart > 0

  return (
    <button
      onClick={() => onAddToCart(item)}
      className={
        'relative bg-white border rounded-xl p-3 text-left transition hover:shadow-md ' +
        (inCart
          ? 'border-blue-500 ring-1 ring-blue-500'
          : 'border-slate-200 hover:border-blue-400')
      }
    >
      {/* Quantity badge — only shows when the item is in the cart */}
      {inCart && (
        <span className="absolute top-2 right-2 z-10 min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
          {quantityInCart}
        </span>
      )}

      <div className="h-24 bg-slate-100 rounded-lg mb-3" />

      <h3 className="text-sm font-semibold text-slate-900 truncate">
        {item.name}
      </h3>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] uppercase tracking-wide text-slate-400">
          {item.type}
        </span>
        <span className="text-lg font-bold text-blue-600">
          {formatRs(item.price)}
        </span>
      </div>
    </button>
  )
}
