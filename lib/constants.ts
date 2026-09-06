export const DEFAULT_CATEGORIES = [
  "ARC Raiders News",
  "PS5 & Console Gaming",
  "Guides & Walkthroughs",
  "Weapons & Loadouts",
  "Extraction Shooters",
  "PC Specs & Performance",
];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "ARC Raiders News": {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/30",
  },
  "PS5 & Console Gaming": {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  "Guides & Walkthroughs": {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  "Weapons & Loadouts": {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500/30",
  },
  "Extraction Shooters": {
    bg: "bg-purple-500/10 dark:bg-purple-500/15",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/30",
  },
  "PC Specs & Performance": {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/30",
  },
};

export const FALLBACK_IMAGES: Record<string, string[]> = {
  "ARC Raiders News": [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
  ],
  "PS5 & Console Gaming": [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
  ],
  "Guides & Walkthroughs": [
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=1200&q=80",
  ],
  "Weapons & Loadouts": [
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  ],
  "Extraction Shooters": [
    "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80",
  ],
  "PC Specs & Performance": [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  ],
};

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";
