import React, { useEffect, useState } from "react";
import api from "../apiClient";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "" });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    const res = await api.get("/api/suppliers");   // FIXED
    setSuppliers(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) return;
    await api.post("/api/suppliers", form);        // FIXED
    setForm({ name: "", contact: "" });
    fetchSuppliers();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Keep track of who you order from.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 grid gap-3 md:grid-cols-[2fr,2fr,auto] dark:bg-slate-900/80 dark:border-slate-800"
      >
        <input
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Supplier name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Contact info (phone / email)"
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
        />
        <button
          type="submit"
          className="text-sm rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Add
        </button>
      </form>

      <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">
          Supplier list
        </div>
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2 text-left font-normal">Name</th>
                <th className="py-2 text-left font-normal">Contact</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="py-2">{s.name}</td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {s.contact || "—"}
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No suppliers yet. Add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
