/**
 * Browser-side thermal receipt printing.
 *
 * Approach: inject the receipt HTML into a print-only container on the page,
 * hide the rest of the app via @media print (see src/index.css), then call
 * window.print(). No pop-ups, no iframes — the browser's own print dialog opens.
 *
 * In the print dialog:
 * - Margins: Default (or None for real thermal roll)
 * - Scale: 100%
 * - It should be a single page.
 */

import { buildReceiptPrintHtml } from "./receiptTemplate.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const PRINT_MOUNT_ID = "receipt-print-mount";

export async function markOrderPrinted(orderId, paymentMethod = "CASH") {
  try {
    const response = await fetch(`${API_BASE}/receipts/${orderId}/print`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ payment_method: paymentMethod }),
    });
    return await response.json();
  } catch (err) {
    console.warn("Could not mark receipt printed:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Prints only the receipt by mounting it into a print-only container and
 * calling window.print(). The main app is hidden during printing by CSS.
 */
export function triggerThermalPrint(order, paymentMethod = "CASH") {
  if (!order) return;

  document.getElementById(PRINT_MOUNT_ID)?.remove();

  const mount = document.createElement("div");
  mount.id = PRINT_MOUNT_ID;
  mount.innerHTML = buildReceiptPrintHtml(order, paymentMethod);
  document.body.appendChild(mount);

  const cleanup = () => {
    mount.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup, { once: true });

  // Let the browser paint the receipt before opening the dialog.
  setTimeout(() => {
    window.print();
    // Safety cleanup in case afterprint never fires (some browsers).
    setTimeout(cleanup, 1000);
  }, 60);
}

/**
 * Marks the order as printed in the DB, then opens the print dialog.
 */
export async function printOrderReceipt(order, options = {}) {
  const paymentMethod = (options.paymentMethod || order?.payment_method || "CASH").toUpperCase();

  if (order?.id) {
    await markOrderPrinted(order.id, paymentMethod);
  }

  await new Promise((resolve) => setTimeout(resolve, 50));
  triggerThermalPrint(order, paymentMethod);
}
