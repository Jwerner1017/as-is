import React from 'react';
import { ShieldAlert, Ban, Users, AlertTriangle, Radio } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Policies() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl text-foreground mb-2">POLICIES</h1>
      <p className="text-sm text-muted-foreground mb-8">Read them. Know them. Don't cry about them later.</p>

      <Tabs defaultValue="asis" className="space-y-6">
        <TabsList className="bg-muted border border-border flex-wrap h-auto">
          <TabsTrigger value="asis" className="text-xs">As Is Policy</TabsTrigger>
          <TabsTrigger value="prohibited" className="text-xs">Prohibited Items</TabsTrigger>
          <TabsTrigger value="counterfeit" className="text-xs">Counterfeit & Replica</TabsTrigger>
          <TabsTrigger value="community" className="text-xs">Community</TabsTrigger>
          <TabsTrigger value="live" className="text-xs">Live Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="asis">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">AS IS POLICY</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All items are sold strictly <strong className="text-foreground">As Is, Where Is, With All Faults</strong>. There are no returns, refunds, or chargebacks for condition, missing parts, authenticity, defects, or "I changed my mind."
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-bold text-sm text-primary mb-2">Only 3 Exceptions where the platform will intervene:</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Package never arrives according to tracking</li>
                <li>Package arrives clearly empty (based on shipping weight difference)</li>
                <li>Buyer receives a completely different category of item than listed</li>
              </ol>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sellers must provide honest, detailed descriptions and clear photos. <strong className="text-primary">Misrepresenting an item will result in permanent ban and forfeiture of funds.</strong>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="prohibited">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl text-foreground">PROHIBITED ITEMS</h2>
            </div>
            <p className="text-sm text-muted-foreground">The following items are strictly prohibited on As Is:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Alcohol', 'Tobacco', 'Live Animals', 'Human Remains',
                'Pornography', 'Real Estate', 'Vehicles', 'Hazardous Materials',
                'Prescription Drugs', 'Street Drugs', 'Lottery Tickets', 'Firearms & Ammunition'
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">✕</span> {item}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="counterfeit">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="font-display text-2xl text-foreground">COUNTERFEIT & REPLICA POLICY</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All items must be authentic. <strong className="text-primary">Counterfeit goods are strictly prohibited.</strong>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Replicas must be clearly labeled <strong className="text-yellow-500">"REPLICA"</strong> in the title and in every photo. Failure to properly label replicas will result in listing removal and potential ban.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              <h2 className="font-display text-2xl text-foreground">COMMUNITY GUIDELINES</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong className="text-foreground">No off-platform deals</strong> — permanent ban + funds forfeited</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong className="text-foreground">No multiple accounts</strong> to circumvent rules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong className="text-foreground">Harassment and threats</strong> = ban</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span><strong className="text-foreground">Talking shit and roasting is allowed</strong></span>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="live">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500" />
              <h2 className="font-display text-2xl text-foreground">LIVE RULES</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• No nudity or sexually explicit behavior (including background)</li>
              <li>• Must show the item on camera during live streams</li>
              <li>• Live games are allowed</li>
              <li className="text-xs text-muted-foreground/70 pl-4">Giveaways, Mystery Boxes, Spin the Wheel, Pick a Number, First to Comment wins, etc.</li>
              <li>• All games must be clearly explained before starting</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}