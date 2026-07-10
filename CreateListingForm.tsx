import { BarcodeScanner } from '../common/BarcodeScanner';

// Inside your component:
const [showScanner, setShowScanner] = useState(false);

const handleBarcodeScan = (upc: string) => {
  setFormData(prev => ({ ...prev, upc }));
  setShowScanner(false);
};

// In your JSX, add this button near the UPC field:
<div className="flex gap-2">
  <input
    type="text"
    value={formData.upc}
    onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
    className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-3"
    placeholder="UPC / SKU"
  />
  <button
    type="button"
    onClick={() => setShowScanner(true)}
    className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700"
  >
    📷 Scan
  </button>
</div>

// At the bottom of your component, add:
{showScanner && (
  <BarcodeScanner 
    onScan={handleBarcodeScan} 
    onClose={() => setShowScanner(false)} 
  />
)}
