import { useEffect, useState, useCallback } from "react";
import {
  Printer,
  Wallet,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  Clock,
  ReceiptText,
  Usb,
} from "lucide-react";
import ReceiptPreview from "../components/ReceiptPreview";
import { markOrderPrinted, triggerThermalPrint } from "../utils/printReceipt";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default function ReceiptPrinting() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedId) || null;

  const applyReceiptPayload = useCallback((resData) => {
    setOrders(resData.data || []);
    setDemoMode(Boolean(resData.isDemoData));
    if (resData.data?.length) {
      setSelectedId(resData.data[0].id);
      setPaymentMethod(resData.data[0].payment_method || "CASH");
    }
  }, []);

  const fetchReceipts = useCallback(async (forceDemo = false) => {
    setLoading(true);
    setStatusMsg("");
    try {
      const url = `${API_BASE}/receipts${forceDemo ? "?demo=true" : ""}`;
      const response = await fetch(url);
      const resData = await response.json();
      if (!resData.success) throw new Error("Failed to load receipts");
      applyReceiptPayload(resData);
    } catch (err) {
      console.error(err);
      setStatusMsg("Could not reach the API. Showing empty list.");
      setOrders([]);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, [applyReceiptPayload]);

  useEffect(() => {
    let cancelled = false;

    async function loadReceipts() {
      try {
        const response = await fetch(`${API_BASE}/receipts`);
        const resData = await response.json();
        if (cancelled) return;
        if (!resData.success) throw new Error("Failed to load receipts");
        applyReceiptPayload(resData);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setStatusMsg("Could not reach the API. Showing empty list.");
        setOrders([]);
        setDemoMode(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReceipts();
    return () => {
      cancelled = true;
    };
  }, [applyReceiptPayload]);

  const handleSelectOrder = (order) => {
    setSelectedId(order.id);
    setPaymentMethod(order.payment_method || "CASH");
    setStatusMsg("");
  };

  const handlePrint = async () => {
    if (!selectedOrder) return;
    setPrinting(true);
    setStatusMsg("");

    try {
      // Card path: in production this is where you'd await the card-reader SDK.
      // For this web POS we record CARD and continue to print.
      if (paymentMethod === "CARD") {
        setStatusMsg("Waiting for card terminal… (simulated approval)");
        await new Promise((r) => setTimeout(r, 600));
      }

      const result = await markOrderPrinted(selectedOrder.id, paymentMethod);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                payment_method: paymentMethod,
                printed_at: result?.data?.printed_at || new Date().toISOString(),
              }
            : o
        )
      );

      setStatusMsg(
        paymentMethod === "CARD"
          ? "Card payment recorded. Sending receipt to printer…"
          : "Cash payment recorded. Sending receipt to printer…"
      );

      // Let React re-render the preview with updated payment/time
      setTimeout(() => {
        triggerThermalPrint();
        setPrinting(false);
        setStatusMsg("Print dialog opened. Choose your thermal printer (80mm / 58mm).");
      }, 80);
    } catch (err) {
      console.error(err);
      setPrinting(false);
      setStatusMsg("Print failed. Check printer connection and try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-3">
            <Printer className="w-3.5 h-3.5" />
            Module 3 · Receipt Printing
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Payment & Receipt Preview
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Choose payment method, preview the thermal layout, then print. After Module 2
            saves a sale, call the same print helper to auto-print the ticket.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {demoMode && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              Demo data
            </span>
          )}
          <button
            type="button"
            onClick={() => fetchReceipts(demoMode)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: orders + payment */}
        <div className="xl:col-span-7 space-y-6">
          {/* Payment method */}
          <section className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-1">Payment Method</h2>
            <p className="text-xs text-slate-400 mb-4">
              Cash opens the drawer flow. Card is where the card machine is triggered.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                  paymentMethod === "CASH"
                    ? "border-amber-400/60 bg-amber-500/10 shadow-lg shadow-amber-900/20"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
                }`}
              >
                <span
                  className={`p-3 rounded-xl ${
                    paymentMethod === "CASH"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Wallet className="w-6 h-6" />
                </span>
                <div>
                  <div className="font-bold text-white">Cash</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Collect cash · record sale · print receipt
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                  paymentMethod === "CARD"
                    ? "border-sky-400/60 bg-sky-500/10 shadow-lg shadow-sky-900/20"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-600"
                }`}
              >
                <span
                  className={`p-3 rounded-xl ${
                    paymentMethod === "CARD"
                      ? "bg-sky-500/20 text-sky-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                </span>
                <div>
                  <div className="font-bold text-white">Card</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Send amount to card terminal · print on approval
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Recent orders */}
          <section className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-amber-400" />
                  Recent Orders
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a sale to reprint or test the thermal layout
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No orders yet. Complete a sale on the Billing screen first.
              </div>
            ) : (
              <ul className="divide-y divide-slate-800/80 max-h-[340px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const active = order.id === selectedId;
                  return (
                    <li key={order.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectOrder(order)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                          active
                            ? "bg-amber-500/10 border border-amber-500/30"
                            : "hover:bg-slate-900/60 border border-transparent"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">
                            Order #{order.id}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {(order.items || [])
                              .map((i) => `${i.quantity}x ${i.name}`)
                              .join(", ")}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-white tabular-nums">
                            Rs. {Number(order.total || 0).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                            {order.printed_at ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Printed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Not printed
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Hardware notes */}
          <section className="bg-[#0f1626]/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Usb className="w-3.5 h-3.5" />
              Hardware connection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400 leading-relaxed">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="font-semibold text-slate-200 mb-1">Thermal printer</div>
                Plug in via USB or LAN, install ESC/POS drivers, then pick the printer in the
                browser print dialog (paper 58mm or 80mm, margins none).
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="font-semibold text-slate-200 mb-1">Card machine</div>
                USB/serial terminals act as a keyboard or use a vendor SDK. On approval,
                Module 2 stores the sale and this module prints the receipt.
              </div>
            </div>
          </section>
        </div>

        {/* Right: live receipt + print */}
        <div className="xl:col-span-5">
          <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-white">Receipt Preview</h2>
                <p className="text-xs text-slate-400">80mm thermal layout</p>
              </div>
              <button
                type="button"
                disabled={!selectedOrder || printing}
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-900/30 hover:from-amber-500 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer className={`w-4 h-4 ${printing ? "animate-pulse" : ""}`} />
                {printing ? "Printing…" : "Print Receipt"}
              </button>
            </div>

            <div className="rounded-xl bg-slate-950/50 border border-slate-800/80 p-4 flex justify-center">
              <ReceiptPreview order={selectedOrder} paymentMethod={paymentMethod} />
            </div>

            {statusMsg && (
              <p className="mt-4 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
