import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldAlert, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

export default function Onboarding() {
  const navigate = useNavigate();
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);

  const handleContinue = async () => {
    await base44.auth.updateMe({ onboarded: true });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-6xl text-foreground">AS <span className="text-primary">IS</span></h1>
          <p className="text-muted-foreground mt-2 text-sm">Before you start, you need to understand something.</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Warning */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-foreground font-bold">
              This ain't your mama's marketplace.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Everything here is sold As Is. No refunds. No returns. No hand-holding. 
              If you buy something broken, that's on you. If you sell something fake, 
              you're getting banned and your money's gone.
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-4 cursor-pointer" onClick={() => setAgreed1(!agreed1)}>
              <Checkbox checked={agreed1} onCheckedChange={setAgreed1} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">I understand and agree to the As Is Policy</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All items are sold As Is, Where Is, With All Faults. No returns, refunds, 
                  or chargebacks except for the 3 listed exceptions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-4 cursor-pointer" onClick={() => setAgreed2(!agreed2)}>
              <Checkbox checked={agreed2} onCheckedChange={setAgreed2} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">I understand that As Is is only a connector</p>
                <p className="text-xs text-muted-foreground mt-1">
                  As Is connects buyers and sellers. We don't own, inspect, or guarantee 
                  any items. We're not your babysitter.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!agreed1 || !agreed2}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase tracking-wider h-14 disabled:opacity-30"
          >
            {agreed1 && agreed2 ? "LET'S GO" : "AGREE TO BOTH FIRST"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}