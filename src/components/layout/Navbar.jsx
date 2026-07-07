import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Zap, User, ShoppingBag, Radio, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CATEGORIES } from '@/lib/categories';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-3xl tracking-wider text-primary">AS IS</span>
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="pl-10 bg-muted border-border focus:border-primary h-10"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/live">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-red-500 hover:text-red-400">
                <Radio className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Live</span>
              </Button>
            </Link>
            <Link to="/sell">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 mr-1" />
                Sell
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <form onSubmit={handleSearch}>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="bg-muted border-border"
                    />
                  </form>
                  <Link to="/browse" className="text-foreground font-medium py-2">Browse All</Link>
                  <Link to="/live" className="text-red-500 font-bold py-2 flex items-center gap-2">
                    <Radio className="w-4 h-4" /> LIVE NOW
                  </Link>
                  <Link to="/sell" className="text-primary font-bold py-2">Sell Something</Link>
                  <Link to="/dashboard" className="text-foreground font-medium py-2">Dashboard</Link>
                  <Link to="/policies" className="text-muted-foreground text-sm py-2">Policies</Link>
                  <Link to="/settings" className="text-muted-foreground text-sm py-2">Settings</Link>
                  <hr className="border-border" />
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Categories</p>
                  {CATEGORIES.map(cat => (
                    <Link key={cat.name} to={`/browse?category=${encodeURIComponent(cat.name)}`} className="text-sm text-muted-foreground hover:text-foreground py-1">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Category bar - desktop */}
      <div className="hidden md:block border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-hide">
            <Link to="/browse">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap h-7">
                All
              </Button>
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/browse?category=${encodeURIComponent(cat.name)}`}>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap h-7">
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}