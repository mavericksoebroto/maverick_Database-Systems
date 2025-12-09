import React, { useEffect, useState } from "react";
import api from "../apiClient";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0); // redraw charts on theme change

  // Detect theme changes and re-render charts
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setChartKey((prev) => prev + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/dashboard-summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading dashboard…</div>;
  if (!summary) return <div>Failed to load dashboard.</div>;

  const {
    product_count,
    supplier_count,
    low_stock_count,
    stock_value,
    low_stock_items,
    recent_sales,
    stock_by_category,
    sales_by_product,
  } = summary;

  // Detect dark mode
  const isDark = document.documentElement.classList.contains("dark");

  // Dynamic colors
  const axisColor = isDark ? "#e5e7eb" : "#1e293b"; // light gray vs slate-800
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const barColor = isDark ? "#60a5fa" : "#2563eb"; // blue-400 vs blue-600

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Inventory, sales and alerts at a glance.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.open("/api/sales/export/csv", "_blank")}
            className="text-xs px-3 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Export Sales (CSV)
          </button>
          <button
            onClick={() => window.open("/api/sales/export/pdf", "_blank")}
            className="text-xs px-3 py-2 rounded-full border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Export Sales (PDF)
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Products" value={product_count} />
        <KpiCard label="Suppliers" value={supplier_count} />
        <KpiCard
          label="Low stock items"
          value={low_stock_count}
          valueClass={low_stock_count > 0 ? "text-amber-600" : "text-emerald-600"}
        />
        <KpiCard label="Stock value" value={`$${stock_value.toFixed(2)}`} />
      </div>

      {/* LOW STOCK + RECENT SALES */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LOW STOCK */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">
            Low stock alerts
          </h2>
          {low_stock_items.length === 0 ? (
            <p className="text-sm text-slate-500">
              All good. No items are below reorder level. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {low_stock_items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">
                      {item.category || "Uncategorized"}
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <div className="font-medium text-rose-600">Qty: {item.qty}</div>
                    <div className="text-slate-500">Reorder at {item.reorder_level}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RECENT SALES */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">
            Recent sales
          </h2>
          {recent_sales.length === 0 ? (
            <p className="text-sm text-slate-500">No sales have been recorded yet.</p>
          ) : (
            <div className="max-h-64 overflow-y-auto text-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-500">
                    <th className="py-1 text-left font-normal">Product</th>
                    <th className="py-1 text-right font-normal">Qty</th>
                    <th className="py-1 text-right font-normal">Total</th>
                    <th className="py-1 text-right font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_sales.map((s, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-1">{s.product_name}</td>
                      <td className="py-1 text-right">{s.quantity_sold}</td>
                      <td className="py-1 text-right">${s.total_price.toFixed(2)}</td>
                      <td className="py-1 text-right text-xs text-slate-500">
                        {new Date(s.sale_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* STOCK BY CATEGORY */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-3 dark:text-slate-200">
            Stock by category
          </h2>
          {stock_by_category.length === 0 ? (
            <p className="text-sm text-slate-500">No products yet to chart.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key={chartKey} data={stock_by_category}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fill: axisColor }} />
                  <YAxis tick={{ fill: axisColor }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: "1px solid rgba(0,0,0,0.2)",
                      color: axisColor,
                    }}
                  />
                  <Bar dataKey="stock" fill={barColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* TOP PRODUCTS BY SALES */}
        <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
          <h2 className="text-sm font-medium text-slate-700 mb-3 dark:text-slate-200">
            Top products by sales
          </h2>
          {sales_by_product.length === 0 ? (
            <p className="text-sm text-slate-500">No sales yet to chart.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key={chartKey} data={sales_by_product}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: axisColor }} />
                  <YAxis tick={{ fill: axisColor }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: "1px solid rgba(0,0,0,0.2)",
                      color: axisColor,
                    }}
                  />
                  <Bar dataKey="total" fill={barColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, valueClass = "" }) {
  return (
    <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 px-4 py-3 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}
