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
    <td style="padding:2px 0;vertical-align:top;word-break:break-word;${leftStyle}">${left}</td>
    <td style="padding:2px 0;vertical-align:top;text-align:right;white-space:nowrap;padding-left:8px;${rightStyle}">${right}</td>
  </tr>`;
};

const divider = () =>
  `<tr><td colspan="2" style="padding:8px 0;"><div style="border-top:1px dashed #94a3b8;"></div></td></tr>`;

/**
 * Self-contained receipt HTML with table layout + inline styles.
 * Tables print more reliably than flexbox across browsers.
 */
export function buildReceiptPrintHtml(order, paymentMethod = "CASH") {
  if (!order) return "";

  const { date, time } = formatDateTime(order.printed_at || order.created_at);
  const method = (paymentMethod || order.payment_method || "CASH").toUpperCase();
  const taxRatePct = ((order.tax_rate || 0) * 100).toFixed(1);
  const companyName = escapeHtml(order.company_name || "Company");

  const logoHtml = order.company_logo
    ? `<img src="${escapeHtml(order.company_logo)}" alt="${companyName}" width="40" height="40" style="display:block;margin:0 auto 8px;object-fit:contain;" />`
    : `<div style="margin:0 auto 8px;width:40px;height:40px;line-height:40px;border-radius:50%;background:#fef3c7;color:#b45309;font-size:12px;font-weight:700;text-align:center;letter-spacing:0.05em;">BJ</div>`;

  const itemsHtml = (order.items || [])
    .map((item) =>
      row(
        escapeHtml(`${item.quantity}x ${item.name}`),
        escapeHtml(formatMoney(item.line_total))
      )
    )
    .join("");

  const taxHtml =
    (order.tax_rate || 0) > 0
      ? row(`Tax (${taxRatePct}%)`, escapeHtml(formatMoney(order.tax)), {
          leftStyle: "color:#475569;",
          rightStyle: "color:#475569;",
        })
      : "";

  return `
<div id="receipt-print-root" style="width:302px;max-width:302px;margin:0;padding:0;background:#ffffff;color:#0f172a;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.45;">
  <div style="padding:16px 14px;">
    <div style="text-align:center;margin-bottom:12px;">
      ${logoHtml}
      <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${companyName}</div>
      <div style="font-size:10px;color:#64748b;margin-top:2px;">POS Terminal 01</div>
    </div>

    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      ${divider()}
      ${row(`Order #${escapeHtml(order.id)}`, escapeHtml(method), {
        leftStyle: "font-size:10px;color:#475569;",
        rightStyle: "font-size:10px;color:#475569;",
      })}
      ${row(escapeHtml(date), escapeHtml(time), {
        leftStyle: "font-size:10px;color:#475569;",
        rightStyle: "font-size:10px;color:#475569;",
      })}
      ${divider()}
      ${itemsHtml}
      ${divider()}
      ${row("Subtotal", escapeHtml(formatMoney(order.subtotal)), {
        leftStyle: "color:#475569;",
        rightStyle: "color:#475569;",
      })}
      ${taxHtml}
      ${row("Total", escapeHtml(formatMoney(order.total)), {
        leftStyle: "font-size:13px;font-weight:700;",
        rightStyle: "font-size:13px;font-weight:700;",
        rowStyle: "font-weight:700;",
      })}
      ${divider()}
    </table>

    <p style="text-align:center;font-size:10px;color:#94a3b8;margin:12px 0 4px;">Thank you for dining with us!</p>
    <p style="text-align:center;font-size:9px;color:#cbd5e1;margin:0;">*** Customer Copy ***</p>
  </div>
</div>`;
}
