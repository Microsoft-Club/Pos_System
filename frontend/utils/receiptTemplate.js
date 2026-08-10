export const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDateTime = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "—" };
  }
  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

/** Standard shop/mart thermal paper width (80mm ESC/POS). */
export const THERMAL_WIDTH_MM = 80;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const row = (left, right, opts = {}) => {
  const leftStyle = opts.leftStyle || "";
  const rightStyle = opts.rightStyle || "";
  const rowStyle = opts.rowStyle || "";
  return `<tr style="${rowStyle}">
    <td style="padding:4px 0;vertical-align:top;word-break:break-word;width:65%;${leftStyle}">${left}</td>
    <td style="padding:4px 0;vertical-align:top;text-align:right;white-space:nowrap;width:35%;${rightStyle}">${right}</td>
  </tr>`;
};

const divider = () =>
  `<tr><td colspan="2" style="padding:10px 0;"><div style="border-top:1px dashed #64748b;"></div></td></tr>`;

/**
 * Full-width 80mm thermal receipt HTML (inline styles).
 * Designed to fill the entire printable page of a shop POS printer.
 */
export function buildReceiptPrintHtml(order, paymentMethod = "CASH") {
  if (!order) return "";

  const { date, time } = formatDateTime(order.printed_at || order.created_at);
  const method = (paymentMethod || order.payment_method || "CASH").toUpperCase();
  const taxRatePct = ((order.tax_rate || 0) * 100).toFixed(1);
  const companyName = escapeHtml(order.company_name || "Biryani Junction");

  const logoHtml = order.company_logo
    ? `<img src="${escapeHtml(order.company_logo)}" alt="${companyName}" width="48" height="48" style="display:block;margin:0 auto 10px;object-fit:contain;" />`
    : `<div style="margin:0 auto 10px;width:48px;height:48px;line-height:48px;border-radius:50%;background:#fef3c7;color:#b45309;font-size:14px;font-weight:700;text-align:center;letter-spacing:0.05em;">BJ</div>`;

  const itemsHtml = (order.items || [])
    .map((item) =>
      row(
        escapeHtml(`${item.quantity}x ${item.name}`),
        escapeHtml(formatMoney(item.line_total)),
        {
          leftStyle: "font-size:13px;",
          rightStyle: "font-size:13px;",
        }
      )
    )
    .join("");

  const taxHtml =
    (order.tax_rate || 0) > 0
      ? row(`Tax (${taxRatePct}%)`, escapeHtml(formatMoney(order.tax)), {
          leftStyle: "font-size:12px;color:#334155;",
          rightStyle: "font-size:12px;color:#334155;",
        })
      : "";

  return `
<div id="receipt-print-root" style="width:80mm;max-width:80mm;min-width:80mm;margin:0;padding:0;background:#ffffff;color:#0f172a;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:1.5;box-sizing:border-box;">
  <div style="padding:5mm 4mm;box-sizing:border-box;width:100%;">
    <div style="text-align:center;margin-bottom:4mm;">
      ${logoHtml}
      <div style="font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${companyName}</div>
      <div style="font-size:11px;color:#475569;margin-top:3px;">POS Terminal 01</div>
    </div>

    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      ${divider()}
      ${row(`Order #${escapeHtml(order.id)}`, escapeHtml(method), {
        leftStyle: "font-size:11px;color:#334155;",
        rightStyle: "font-size:11px;color:#334155;",
      })}
      ${row(escapeHtml(date), escapeHtml(time), {
        leftStyle: "font-size:11px;color:#334155;",
        rightStyle: "font-size:11px;color:#334155;",
      })}
      ${divider()}
      ${itemsHtml}
      ${divider()}
      ${row("Subtotal", escapeHtml(formatMoney(order.subtotal)), {
        leftStyle: "font-size:12px;color:#334155;",
        rightStyle: "font-size:12px;color:#334155;",
      })}
      ${taxHtml}
      ${row("Total", escapeHtml(formatMoney(order.total)), {
        leftStyle: "font-size:15px;font-weight:700;",
        rightStyle: "font-size:15px;font-weight:700;",
        rowStyle: "font-weight:700;",
      })}
      ${divider()}
    </table>

    <p style="text-align:center;font-size:11px;color:#64748b;margin:4mm 0 2mm;">Thank you for dining with us!</p>
    <p style="text-align:center;font-size:10px;color:#94a3b8;margin:0;">*** Customer Copy ***</p>
  </div>
</div>`;
}
