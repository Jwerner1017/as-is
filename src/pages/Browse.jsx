import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import ListingGrid from '@/components/listings/ListingGrid';
import { CATEGORIES, CONDITIONS, SELLING_FORMATS, SHIPPING_TYPES, SELLER_LEVELS, SORT_OPTIONS } from '@/lib/categories';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState([]);
  const [showSold, setShowSold] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const query = searchParams.get('q') || '';

  const categoryData = CATEGORIES.find(c => c.name === activeCategory);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const filter = {};
        if (!showSold) filter.status = 'active';
        if (activeCategory) filter.category = activeCategory;
        if (activeSubcategory) filter.subcategory = activeSubcategory;
        if (selectedConditions.length === 1) filter.condition = selectedConditions[0];
        if (selectedFormats.length === 1) filter.selling_format = selectedFormats[0];
        if (selectedShipping.length === 1) filter.shipping_type = selectedShipping[0];

        let sortField = '-created_date';
        if (sortBy === 'oldest') sortField = 'created_date';
        if (sortBy === 'price_low') sortField = 'price';
        if (sortBy === 'price_high') sortField = '-price';
        if (sortBy === 'ending_soon') sortField = 'auction_end';

        const data = await base44.entities.Listing.filter(filter, sortField, 50);
        let filtered = data;

        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(l => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q));
        }
        if (priceRange[0] > 0 || priceRange[1] < 10000) {
          filtered = filtered.filter(l => {
            const p = l.selling_format === 'Auction' ? (l.current_bid || l.starting_bid || 0) : (l.price || 0);
            return p >= priceRange[0] && p <= priceRange[1];
          });
        }
        if (selectedConditions.length > 1) {
          filtered = filtered.filter(l => selectedConditions.includes(l.condition));
        }
        if (selectedFormats.length > 1) {
          filtered = filtered.filter(l => selectedFormats.includes(l.selling_format));
        }
        if (selectedShipping.length > 1) {
          filtered = filtered.filter(l => selectedShipping.includes(l.shipping_type));
        }
        if (sortBy === 'most_juiced') {
          filtered.sort((a, b) => (b.juiced ? 1 : 0) - (a.juiced ? 1 : 0));
        }

        setListings(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory, activeSubcategory, query, sortBy, showSold]);

  const toggleFilter = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const activeFilterCount = selectedConditions.length + selectedFormats.length + selectedShipping.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) + (showSold ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Price Range</h4>
        <Slider
          min={0}
          max={10000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Condition</h4>
        <div className="space-y-2">
          {CONDITIONS.map(c => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox checked={selectedConditions.includes(c)} onCheckedChange={() => toggleFilter(selectedConditions, setSelectedConditions, c)} />
              <Label className="text-sm text-muted-foreground cursor-pointer">{c}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Selling Format</h4>
        <div className="space-y-2">
          {SELLING_FORMATS.map(f => (
            <div key={f} className="flex items-center gap-2">
              <Checkbox checked={selectedFormats.includes(f)} onCheckedChange={() => toggleFilter(selectedFormats, setSelectedFormats, f)} />
              <Label className="text-sm text-muted-foreground cursor-pointer">{f}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Shipping</h4>
        <div className="space-y-2">
          {SHIPPING_TYPES.map(s => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox checked={selectedShipping.includes(s)} onCheckedChange={() => toggleFilter(selectedShipping, setSelectedShipping, s)} />
              <Label className="text-sm text-muted-foreground cursor-pointer">{s}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={showSold} onCheckedChange={setShowSold} />
        <Label className="text-sm text-muted-foreground cursor-pointer">Show Recently Sold</Label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            {activeCategory || (query ? `Results for "${query}"` : 'BROWSE ALL')}
          </h1>
          {activeSubcategory && <p className="text-sm text-muted-foreground">{activeSubcategory}</p>}
          {categoryData && !activeSubcategory && (
            <div className="flex flex-wrap gap-1 mt-2">
              {categoryData.subcategories.map(sub => (
                <Badge
                  key={sub.name}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-primary/10 hover:border-primary/50"
                  onClick={() => setSearchParams({ category: activeCategory, subcategory: sub.name })}
                >
                  {sub.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 bg-card border-border text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden relative">
                <SlidersHorizontal className="w-4 h-4 mr-1" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-border w-72 overflow-y-auto">
              <h3 className="font-display text-xl text-foreground mb-6">FILTERS</h3>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop filters */}
        <div className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20">
            <h3 className="font-display text-lg text-foreground mb-4">FILTERS</h3>
            <FilterContent />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <ListingGrid listings={listings} loading={loading} />
        </div>
      </div>
    </div>
  );
}