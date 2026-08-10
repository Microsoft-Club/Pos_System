/**
 * Browser-side thermal receipt printing (80mm shop/mart roll).
 *
 * Injects receipt HTML into a print-only mount, sets @page to 80mm × content
 * height, then calls window.print(). No pop-ups / iframes.
 *
 * In Chrome print dialog for best results:
 * - Paper size: Custom 80mm (or “Thermal 80mm” if available)
 * - Margins: None
 * - Scale: 100%
 */

import { buildReceiptPrintHtml, THERMAL_WIDTH_MM } from "./receiptTemplate.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const PRINT_MOUNT_ID = "receipt-print-mount";
const PRINT_PAGE_STYLE_ID = "receipt-print-page-style";

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

function pxToMm(px) {
  return Math.ceil((px * 25.4) / 96);
}

/**
 * Sets an exact 80mm × heightMm @page rule so the PDF / printer page
 * matches thermal roll dimensions instead of Letter/A4.
 */
function applyThermalPageSize(heightMm) {
  document.getElementById(PRINT_PAGE_STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = PRINT_PAGE_STYLE_ID;
  style.textContent = `
    @media print {
      @page {
        size: ${THERMAL_WIDTH_MM}mm ${heightMm}mm;
        margin: 0;
      }
      html, body,
      #receipt-print-mount,
      #receipt-print-mount #receipt-print-root {
        width: ${THERMAL_WIDTH_MM}mm !important;
        max-width: ${THERMAL_WIDTH_MM}mm !important;
        min-width: ${THERMAL_WIDTH_MM}mm !important;
      }
    }
  `;
  document.head.appendChild(style);
  return style;
}

/**
 * Prints only the receipt, sized to a full 80mm thermal page.
 */
export function triggerThermalPrint(order, paymentMethod = "CASH") {
  if (!order) return;

  document.getElementById(PRINT_MOUNT_ID)?.remove();
  document.getElementById(PRINT_PAGE_STYLE_ID)?.remove();

  const mount = document.createElement("div");
  mount.id = PRINT_MOUNT_ID;
  // Temporarily visible (off-screen) so we can measure height before printing.
  mount.style.cssText =
    "position:fixed;left:-9999px;top:0;width:80mm;display:block;visibility:hidden;";
  mount.innerHTML = buildReceiptPrintHtml(order, paymentMethod);
  document.body.appendChild(mount);

  const cleanup = () => {
    mount.remove();
    document.getElementById(PRINT_PAGE_STYLE_ID)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup, { once: true });

  // Measure after layout, lock page size to 80mm × content height, then print.
  requestAnimationFrame(() => {
    const root = mount.querySelector("#receipt-print-root");
    const heightPx = root?.offsetHeight || mount.offsetHeight || 400;
    // Extra padding so content isn't clipped at the bottom edge.
    const heightMm = Math.max(pxToMm(heightPx) + 4, 80);

    applyThermalPageSize(heightMm);

    // Reset mount styles so @media print CSS takes over (hidden on screen).
    mount.style.cssText = "";

    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 1000);
    }, 50);
  });
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
