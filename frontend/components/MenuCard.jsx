import { formatRs } from '../utils/money.js'

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
        'relative bg-surface border rounded-xl p-3 text-left transition hover:shadow-md ' +
        (inCart
          ? 'border-indigo-500 ring-1 ring-indigo-500'
          : 'border-edge hover:border-indigo-400')
      }
    >
      {/* Quantity badge — only shows when the item is in the cart */}
      {inCart && (
        <span className="absolute top-2 right-2 z-10 min-w-[20px] h-5 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
          {quantityInCart}
        </span>
      )}

      <h3 className="text-sm font-semibold text-fg truncate">
        {item.name}
      </h3>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] uppercase tracking-wide text-fg-muted">
          {item.type}
        </span>
        <span className="text-lg font-bold text-accent">
          {formatRs(item.price)}
        </span>
      </div>
    </button>
  )
}
