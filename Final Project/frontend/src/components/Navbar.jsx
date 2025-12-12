import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const linkClass = (path) =>
    `text-sm px-3 py-1 rounded-full transition ${
      location.pathname === path
        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur dark:bg-slate-900/80 dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100">
          Smart Inventory
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link to="/pos" className={linkClass("/pos")}>
            POS
          </Link>
          <Link to="/products" className={linkClass("/products")}>
            Products
          </Link>
          <Link to="/suppliers" className={linkClass("/suppliers")}>
            Suppliers
          </Link>

          <button
            onClick={() => setDark((d) => !d)}
            className="ml-2 text-xs px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
