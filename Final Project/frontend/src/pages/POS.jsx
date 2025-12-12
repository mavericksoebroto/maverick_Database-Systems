import React, { useEffect, useState } from "react";
import api from "../apiClient";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await api.get("/api/products");
    setProducts(res.data);
  }

  function addToCart() {
    const product = products.find((p) => p.id === Number(selectedId));
    if (!product || qty <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setQty(1);
    setSelectedId("");
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleCheckout() {
    if (cart.length === 0) return;
    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };
      const res = await api.post("/api/sales", payload);
      setStatus("Sale recorded successfully.");
      setCart([]);
      fetchProducts();
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setStatus(
        err.response?.data?.error || "Failed to record sale. Check stock."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">POS</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create sales and automatically update stock.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
        {/* LEFT: Add items */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-3 dark:text-slate-200">
            Add items to cart
          </h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              className="flex-1 text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price.toFixed(2)}) • Stock {p.stock_quantity}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              className="w-24 text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />

            <button
              type="button"
              onClick={addToCart}
              className="text-sm rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Add
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Tip: this simulates a checkout counter. Each completed sale updates
            stock and triggers low stock alerts.
          </div>
        </div>

        {/* RIGHT: Cart summary */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-3 dark:text-slate-200">
            Cart
          </h2>

          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No items yet. Add products on the left.
            </p>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      <th className="py-1 text-left font-normal">Product</th>
                      <th className="py-1 text-right font-normal">Qty</th>
                      <th className="py-1 text-right font-normal">Price</th>
                      <th className="py-1 text-right font-normal">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr
                        key={item.product.id}
                        className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                      >
                        <td className="py-1">{item.product.name}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">
                          ${item.product.price.toFixed(2)}
                        </td>
                        <td className="py-1 text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">
                  Total: <span className="text-lg">${total.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="text-sm rounded-full bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-500"
                >
                  Complete sale
                </button>
              </div>
            </>
          )}

          {status && (
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
