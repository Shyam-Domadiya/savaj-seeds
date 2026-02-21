import { Sprout, Wheat, Dna, Leaf, type LucideIcon } from "lucide-react"

// Note: Lucide does not have a specific Cotton icon by default, we'll use a placeholder or custom one if needed.
// For now, let's use Lucide icons that fit.

export interface CategoryVisuals {
    gradient: string
    accent: string
    icon: LucideIcon | string // Can be a LucideIcon or a string (emoji)
    iconColor: string
    label: string
}

export const getCategoryVisuals = (category: string = ''): CategoryVisuals => {
    const lowerCat = (category || '').toLowerCase();

    // Vegetable Series
    if (lowerCat.includes('vegetable')) {
        return {
            gradient: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/40",
            accent: "text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-800",
            icon: Sprout,
            iconColor: "text-emerald-600 dark:text-emerald-400",
            label: "Vegetable Series"
        };
    }

    // Wheat Series
    if (lowerCat.includes('wheat')) {
        return {
            gradient: "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/40",
            accent: "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:border-amber-800",
            icon: Wheat,
            iconColor: "text-amber-600 dark:text-amber-400",
            label: "Premium Wheat"
        };
    }

    // Hybrid Series
    if (lowerCat.includes('hybrid')) {
        return {
            gradient: "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/40 dark:to-pink-900/40",
            accent: "text-purple-700 bg-purple-100 border-purple-200 dark:bg-purple-900/40 dark:border-purple-800",
            icon: Dna,
            iconColor: "text-purple-600 dark:text-purple-400",
            label: "Advanced Hybrid"
        };
    }

    // Cotton Series
    if (lowerCat.includes('cotton')) {
        return {
            gradient: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/40 dark:to-gray-800/40",
            accent: "text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800",
            icon: "☁️",
            iconColor: "text-slate-600 dark:text-slate-400",
            label: "White Gold Cotton"
        };
    }

    // Default / Other
    return {
        gradient: "bg-gradient-to-br from-stone-50 to-orange-50 dark:from-stone-900/40 dark:to-orange-900/40",
        accent: "text-stone-700 bg-stone-100 border-stone-200 dark:bg-stone-900/40 dark:border-stone-800",
        icon: Leaf,
        iconColor: "text-primary dark:text-primary",
        label: "Quality Seeds"
    };
};
