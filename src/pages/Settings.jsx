import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Palette, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme, THEMES } from '@/lib/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl text-foreground mb-8">SETTINGS</h1>

      {/* Profile */}
      {user && (
        <section className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="font-display text-xl text-foreground mb-4">PROFILE</h2>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-medium">{user.full_name}</span></p>
            <p className="text-sm"><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-medium">{user.email}</span></p>
          </div>
        </section>
      )}

      {/* Theme */}
      <section className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-accent" />
          <h2 className="font-display text-xl text-foreground">DARK MODE</h2>
        </div>
        <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
          {THEMES.map(t => (
            <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <RadioGroupItem value={t.id} id={t.id} />
              <Label htmlFor={t.id} className="cursor-pointer flex-1">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>

      {/* Logout */}
      <Button onClick={handleLogout} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}