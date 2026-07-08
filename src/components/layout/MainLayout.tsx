import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-bold text-2xl tracking-tighter">AS IS</div>
            
            {/* Navigation Links */}
            <div className="flex gap-6 text-sm">
              <a href="/" className="hover:text-red-400">Browse</a>
              <a href="/live" className="hover:text-red-400">Live</a>
              <a href="/sell" className="hover:text-red-400">Sell</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User avatar / Login button will go here */}
            <button className="text-sm px-4 py-1.5 border border-zinc-700 rounded hover:bg-zinc-900">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
