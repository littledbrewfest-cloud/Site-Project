"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" aria-hidden="true" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-500/40 shadow-sm transition-all duration-200 font-medium text-xs cursor-pointer"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-[spin_10s_linear_infinite]" aria-hidden="true" />
          <span className="hidden md:inline font-semibold">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-700 fill-indigo-700/20" aria-hidden="true" />
          <span className="hidden md:inline font-semibold">Dark Mode</span>
        </>
      )}
    </button>
  );
}
