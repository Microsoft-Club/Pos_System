import { useEffect, useState, useCallback } from "react";
import {
  Printer,
  Wallet,
  RefreshCw,
  CheckCircle2,
  Clock,
  ReceiptText,
  Usb,
} from "lucide-react";
import ReceiptPreview from "../components/ReceiptPreview";
import { markOrderPrinted, triggerThermalPrint } from "../utils/printReceipt";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const PAYMENT_METHOD = "CASH";

export default function ReceiptPrinting() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedId) || null;

  const applyReceiptPayload = useCallback((resData) => {
    setOrders(resData.data || []);
    if (resData.data?.length) {
      setSelectedId(resData.data[0].id);
    }
  }, []);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const response = await fetch(`${API_BASE}/receipts`, {
        credentials: 'include',
      });
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.message || "Failed to load receipts");
      applyReceiptPayload(resData);
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message || "Could not reach the API.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [applyReceiptPayload]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const handleSelectOrder = (order) => {
    setSelectedId(order.id);
    setStatusMsg("");
  };

  const handlePrint = async () => {
    if (!selectedOrder) return;
    setPrinting(true);
    setStatusMsg("");

    try {
      const result = await markOrderPrinted(selectedOrder.id, PAYMENT_METHOD);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                payment_method: PAYMENT_METHOD,
                printed_at: result?.data?.printed_at || new Date().toISOString(),
              }
            : o
        )
      );

      setStatusMsg("Cash payment recorded. Sending receipt to printer…");

      setTimeout(() => {
        triggerThermalPrint(
          {
            ...selectedOrder,
            payment_method: PAYMENT_METHOD,
            printed_at: result?.data?.printed_at || new Date().toISOString(),
          },
          PAYMENT_METHOD
        );
        setPrinting(false);
        setStatusMsg("Print dialog opened. Choose your printer (80mm / 58mm) and print.");
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
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-warning-fg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-3">
            <Printer className="w-3.5 h-3.5" />
            Receipt Printing
          </div>
          <h1 className="text-3xl font-black tracking-tight text-fg">
            Cash Payment & Receipt Preview
          </h1>
          <p className="text-fg-muted text-sm mt-1 max-w-xl">
            Preview the thermal layout, then print the cash receipt.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReceipts}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-chip/80 border border-edge-strong text-fg hover:bg-chip"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: orders + payment */}
        <div className="xl:col-span-7 space-y-6">
          {/* Payment method — cash only */}
          <section className="bg-surface border border-edge rounded-2xl p-6">
            <h2 className="text-sm font-bold text-fg mb-1">Payment Method</h2>
            <p className="text-xs text-fg-muted mb-4">
              This POS records cash payments only.
            </p>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/60 bg-amber-500/10 p-5 shadow-lg shadow-amber-900/20">
              <span className="p-3 rounded-xl bg-amber-500/20 text-warning-fg">
                <Wallet className="w-6 h-6" />
              </span>
              <div>
                <div className="font-bold text-fg">Cash</div>
                <div className="text-xs text-fg-muted mt-0.5">
                  Collect cash · record sale · print receipt
                </div>
              </div>
            </div>
          </section>

          {/* Recent orders */}
          <section className="bg-surface border border-edge rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-fg flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-warning-fg" />
                  Recent Orders
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Select a sale to reprint or test the thermal layout
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-fg-muted text-sm">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-fg-muted text-sm">
                No orders yet. Complete a sale on the Billing screen first.
              </div>
            ) : (
              <ul className="divide-y divide-edge/80 max-h-[340px] overflow-y-auto pr-1">
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
                            : "hover:bg-muted/60 border border-transparent"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-fg">
                            Order #{order.id}
                          </div>
                          <div className="text-[11px] text-fg-muted truncate mt-0.5">
                            {(order.items || [])
                              .map((i) => `${i.quantity}x ${i.name}`)
                              .join(", ")}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-fg tabular-nums">
                            Rs. {Number(order.total || 0).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-fg-subtle flex items-center justify-end gap-1 mt-0.5">
                            {order.printed_at ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-success-fg" />
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
          <section className="bg-surface/80 border border-edge rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-fg-muted mb-3 flex items-center gap-2">
              <Usb className="w-3.5 h-3.5" />
              Hardware connection
            </h3>
            <div className="rounded-xl border border-edge bg-muted/40 p-3 text-xs text-fg-muted leading-relaxed">
              <div className="font-semibold text-fg mb-1">Thermal printer</div>
              Plug in via USB or LAN, install ESC/POS drivers, then pick the printer in the
              browser print dialog (paper 58mm or 80mm, margins none).
            </div>
          </section>
        </div>

        {/* Right: live receipt + print */}
        <div className="xl:col-span-5">
          <div className="bg-surface border border-edge rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-fg">Receipt Preview</h2>
                <p className="text-xs text-fg-muted">80mm thermal layout</p>
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

            <div className="rounded-xl bg-page/50 border border-edge/80 p-4 flex justify-center">
              <ReceiptPreview order={selectedOrder} paymentMethod={PAYMENT_METHOD} />
            </div>

            {statusMsg && (
              <p className="mt-4 text-xs text-warning-fg bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
