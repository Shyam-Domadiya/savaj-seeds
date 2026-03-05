"use client"

import { useState, useEffect } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ProductCategory, Season, DifficultyLevel, ProductSort } from "@/lib/types/product"
import { cn } from "@/lib/utils"

export interface ProductFilterState {
  categories: ProductCategory[]
  seasons: Season[]
  difficultyLevels: DifficultyLevel[]
  availability?: boolean
  featured?: boolean
}

interface ProductFilterProps {
  filters: ProductFilterState
  sort: ProductSort
  onFiltersChange: (filters: ProductFilterState) => void
  onSortChange: (sort: ProductSort) => void
  onClearFilters: () => void
  className?: string
}

const categories: ProductCategory[] = [
  'Cotton', 'Wheat', 'Groundnut', 'Cumin', 'Sesame', 'Castor',
  'Maize', 'Gram', 'Millet', 'Coriander', 'Pigeon Pea', 'Vegetable'
]
const seasons: Season[] = ['Spring', 'Summer', 'Monsoon', 'Winter', 'All-Season']
const difficultyLevels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export function ProductFilter({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  className
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [seasonOpen, setSeasonOpen] = useState(false)
  const [difficultyOpen, setDifficultyOpen] = useState(false)

  return (
    <div className={className}>
      {/* Mobile Sorting Toggle (Renamed from Filter) */}
      <div className="lg:hidden mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Sort Products</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between h-12 px-4 border-primary/20 bg-background hover:bg-muted/50 transition-all",
            isOpen && "border-primary ring-1 ring-primary/20"
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {isOpen ? "Hide Sorting" : "Show Sorting"}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </Button>
      </div>

      {/* Panel */}
      <div className={cn(
        "space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
        "lg:block",
        !isOpen && "hidden lg:block"
      )}>
        {/* Sort Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sort By</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={`${sort.field}-${sort.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split('-') as [ProductSort['field'], ProductSort['direction']]
                onSortChange({ field, direction })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                <SelectItem value="category-desc">Category (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}