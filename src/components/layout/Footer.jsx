import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display text-xl text-primary mb-4">AS IS</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              What you see is what you get.<br />No refunds. No crying.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">Marketplace</h5>
            <div className="flex flex-col gap-2">
              <Link to="/browse" className="text-xs text-muted-foreground hover:text-foreground">Browse</Link>
              <Link to="/live" className="text-xs text-muted-foreground hover:text-foreground">Live Streams</Link>
              <Link to="/sell" className="text-xs text-muted-foreground hover:text-foreground">Sell Something</Link>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">Policies</h5>
            <div className="flex flex-col gap-2">
              <Link to="/policies" className="text-xs text-muted-foreground hover:text-foreground">As Is Policy</Link>
              <Link to="/policies" className="text-xs text-muted-foreground hover:text-foreground">Prohibited Items</Link>
              <Link to="/policies" className="text-xs text-muted-foreground hover:text-foreground">Community Guidelines</Link>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-foreground mb-3">Account</h5>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link to="/settings" className="text-xs text-muted-foreground hover:text-foreground">Settings</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2026 As Is. All sales final. Literally.</p>
        </div>
      </div>
    </footer>
  );
}