import React, { useEffect, useMemo, useState } from "react";
import api from '../apiClient';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    reorder_level: 5,
    supplier_id: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  async function fetchProducts() {
    const res = await api.get('/api/products');
    setProducts(res.data);
  }

  async function fetchSuppliers() {
    const res = await api.get("/api/suppliers");   // FIXED
    setSuppliers(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) return;

    await api.post("/api/products", {               // FIXED
      ...form,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity || 0),
      reorder_level: Number(form.reorder_level || 5),
      supplier_id: form.supplier_id || null,
    });

    setForm({
      name: "",
      category: "",
      price: "",
      stock_quantity: "",
      reorder_level: 5,
      supplier_id: "",
    });
    fetchProducts();
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const text = `${p.name} ${p.category || ""}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      const matchCat = !categoryFilter || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage items, pricing and stock levels.
        </p>
      </div>

      {/* Add product form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 grid gap-3 md:grid-cols-4 dark:bg-slate-900/80 dark:border-slate-800"
      >
        <input
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <select
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          value={form.supplier_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, supplier_id: e.target.value }))
          }
        >
          <option value="">Supplier (optional)</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
        <input
          type="number"
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Stock quantity"
          value={form.stock_quantity}
          onChange={(e) =>
            setForm((f) => ({ ...f, stock_quantity: e.target.value }))
          }
        />
        <input
          type="number"
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Reorder level"
          value={form.reorder_level}
          onChange={(e) =>
            setForm((f) => ({ ...f, reorder_level: e.target.value }))
          }
        />

        <button
          type="submit"
          className="md:col-span-4 mt-1 text-sm rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Add product
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full md:w-64 text-sm rounded-full border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-48 text-sm rounded-full border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products table */}
      <div className="rounded-2xl bg-white/80 shadow-sm border border-slate-200 p-4 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">
          Inventory
        </div>
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2 text-left font-normal">Name</th>
                <th className="py-2 text-left font-normal">Category</th>
                <th className="py-2 text-right font-normal">Price</th>
                <th className="py-2 text-right font-normal">Stock</th>
                <th className="py-2 text-right font-normal">Reorder</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {p.category || "—"}
                  </td>
                  <td className="py-2 text-right">${p.price.toFixed(2)}</td>
                  <td className="py-2 text-right">{p.stock_quantity}</td>
                  <td className="py-2 text-right">{p.reorder_level}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No products match your filters.
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
