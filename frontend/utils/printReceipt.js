/**
 * Browser-side thermal receipt printing.
 *
 * Hardware path (shop setup):
 * 1. Install the thermal printer drivers on the POS PC (58mm or 80mm ESC/POS).
 * 2. Connect via USB (most common) or LAN; set it as the default printer
 *    OR choose it in the browser print dialog.
 * 3. In Chrome print settings: paper size = custom 80mm (or 58mm), margins = none,
 *    scale = 100%, background graphics on.
 *
 * Card reader path (for Module 2 / payment):
 * - USB HID / serial readers usually type the card token like a keyboard, OR
 * - Use the vendor SDK / payment gateway (e.g. Stripe Terminal, PayFast, JazzCash)
 *   which exposes a JS/Node bridge. After approval, call printOrderReceipt().
 *
 * Module 2 integration after checkout:
 *   import { printOrderReceipt } from '../utils/printReceipt';
 *   await printOrderReceipt(orderPayload, { paymentMethod: 'CARD' });
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function markOrderPrinted(orderId, paymentMethod = "CASH") {
  try {
    const response = await fetch(`${API_BASE}/receipts/${orderId}/print`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: paymentMethod }),
    });
    return await response.json();
  } catch (err) {
    console.warn("Could not mark receipt printed:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Opens the system print dialog for the element with id `receipt-print-root`.
 * Call after the receipt preview is mounted with the current order.
 */
export function triggerThermalPrint() {
  window.print();
}

/**
 * Marks the order as printed in the DB, then opens the print dialog.
 * Safe for Module 2 to call right after a successful sale.
 */
export async function printOrderReceipt(order, options = {}) {
  const paymentMethod = (options.paymentMethod || order?.payment_method || "CASH").toUpperCase();

  if (order?.id) {
    await markOrderPrinted(order.id, paymentMethod);
  }

  // Allow React to paint any payment-method change on the preview first
  await new Promise((resolve) => setTimeout(resolve, 50));
  triggerThermalPrint();
}
