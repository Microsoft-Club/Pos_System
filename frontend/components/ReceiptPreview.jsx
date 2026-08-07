import { formatMoney, formatDateTime } from "../utils/receiptTemplate.js";

/**
 * Thermal-style receipt preview (58/80mm).
 * On-screen preview; printing uses receiptTemplate.js for identical inline HTML.
 */
export default function ReceiptPreview({ order, paymentMethod = "CASH" }) {
  if (!order) {
    return (
      <div className="receipt-preview flex items-center justify-center min-h-[420px] text-slate-400 text-sm">
        Select an order to preview the receipt
      </div>
    );
  }

  const { date, time } = formatDateTime(order.printed_at || order.created_at);
  const method = (paymentMethod || order.payment_method || "CASH").toUpperCase();
  const taxRatePct = ((order.tax_rate || 0) * 100).toFixed(1);

  return (
    <div className="receipt-preview mx-auto w-[80mm] max-w-[80mm] bg-white text-slate-900 shadow-2xl shadow-black/40 border border-slate-200">
      <div className="px-4 py-5 font-mono text-[11px] leading-relaxed">
        <div className="text-center mb-4">
          {order.company_logo ? (
            <img
              src={order.company_logo}
              alt={order.company_name || "Shop"}
              className="mx-auto mb-2 h-10 w-10 object-contain"
            />
          ) : (
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 text-xs font-bold tracking-wide">
              BJ
            </div>
          )}
          <div className="text-sm font-bold tracking-wide uppercase">
            {order.company_name || "Company"}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">POS Terminal 01</div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-2" />

        <div className="flex justify-between text-[10px] text-slate-600">
          <span>Order #{order.id}</span>
          <span>{method}</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
          <span>{date}</span>
          <span>{time}</span>
        </div>

        <div className="border-t border-dashed border-slate-300 my-3" />

        <div className="space-y-1.5">
          {(order.items || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between gap-2">
              <span className="flex-1 break-words">
                {item.quantity}x {item.name}
              </span>
              <span className="shrink-0 tabular-nums">{formatMoney(item.line_total)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-slate-300 my-3" />

        <div className="space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoney(order.subtotal)}</span>
          </div>
          {(order.tax_rate || 0) > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({taxRatePct}%)</span>
              <span className="tabular-nums">{formatMoney(order.tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-[13px] font-bold mt-1">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-3" />

        <p className="text-center text-[10px] text-slate-400 mt-4 mb-1">
          Thank you for dining with us!
        </p>
        <p className="text-center text-[9px] text-slate-300">
          *** Customer Copy ***
        </p>
      </div>
    </div>
  );
}
