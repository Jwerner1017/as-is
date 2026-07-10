import { useState } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { BarcodeScanner } from '../common/BarcodeScanner';

const CATEGORIES = [
  'Electronics', 'Fashion & Apparel', 'Home & Garden', 'Automotive',
  'Sports & Outdoors', 'Collectibles', 'Tools & Equipment',
  'Beauty & Personal Wellness', 'Toys & Hobbies', 'Miscellaneous'
];

const TABS = ['Basic Info', 'Details', 'Photos'];

export function CreateListingForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', condition: 'Used',
    color: '', upc: '', quantity: '1', yearOrModel: '', size: '', expirationDate: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [confirmedPhotos, setConfirmedPhotos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const showSize = ['Fashion & Apparel', 'Sports & Outdoors'].includes(category);
  const showExpiration = category === 'Beauty & Personal Wellness';
  const showYearModel = ['Electronics', 'Automotive', 'Tools & Equipment', 'Collectibles'].includes(category);

  const validateCurrentTab = () => {
    if (activeTab === 0) {
      if (!category || !formData.title || !formData.price) return false;
    }
    if (activeTab === 2) {
      if (photos.length < 2 || !confirmedPhotos) return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      setActiveTab(Math.min(activeTab + 1, 2));
    } else {
      alert("Please fill out all required fields before continuing.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length < 2 || !confirmedPhotos) {
      alert("You must upload at least 2 photos and confirm they are of the actual item.");
      return;
    }

    setIsSubmitting(true);

    // TODO: Submit to Base44 here
    console.log("Submitting listing...", { 
      ...formData, 
      category, 
      photos, 
      confirmedPhotos 
    });

    setIsSubmitting(false);
  };

  // Barcode Scanner Handler
  const handleBarcodeScan = (upcCode: string) => {
    setFormData(prev => ({
      ...prev,
      upc: upcCode
    }));
    setShowScanner(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">List an Item</h1>
      <p className="text-zinc-400 mb-6">Be honest. No stock photos.</p>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700 mb-8">
        {TABS.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === index
                ? 'border-b-2 border-red-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Basic Info */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm">Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Price *</label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 h-28" 
              />
            </div>
          </div>
        )}

        {/* Tab 2: Details */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showSize && (
                <div>
                  <label className="block mb-2 text-sm">Size *</label>
                  <input 
                    type="text" 
                    value={formData.size} 
                    onChange={(e) => setFormData({...formData, size: e.target.value})} 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                    required 
                  />
                </div>
              )}

              {showExpiration && (
                <div>
                  <label className="block mb-2 text-sm">Expiration Date *</label>
                  <input 
                    type="date" 
                    value={formData.expirationDate} 
                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})} 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                    required 
                  />
                </div>
              )}

              {showYearModel && (
                <div>
                  <label className="block mb-2 text-sm">Year / Model #</label>
                  <input 
                    type="text" 
                    value={formData.yearOrModel} 
                    onChange={(e) => setFormData({...formData, yearOrModel: e.target.value})} 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm">Color</label>
                <input 
                  type="text" 
                  value={formData.color} 
                  onChange={(e) => setFormData({...formData, color: e.target.value})} 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                />
              </div>

              {/* UPC with Scan Button */}
              <div>
                <label className="block mb-2 text-sm">UPC / SKU #</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.upc} 
                    onChange={(e) => setFormData({...formData, upc: e.target.value})} 
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded p-3" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowScanner(true)}
                    className="px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded flex items-center justify-center"
                  >
                    📷 Scan
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Quantity</label>
                <input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Photos */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <PhotoUpload 
              photos={photos} 
              setPhotos={setPhotos} 
              minPhotos={2} 
            />

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={confirmedPhotos}
                onChange={(e) => setConfirmedPhotos(e.target.checked)}
                className="mt-1"
              />
              <label className="text-sm text-zinc-300">
                I confirm these photos were taken by me of the actual item. Using stock or copied photos may result in a ban.
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {activeTab > 0 && (
            <button 
              type="button" 
              onClick={() => setActiveTab(activeTab - 1)} 
              className="px-6 py-2 border border-zinc-700 rounded"
            >
              Back
            </button>
          )}

          {activeTab < 2 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              className="ml-auto bg-zinc-800 hover:bg-zinc-700 px-8 py-2 rounded"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-red-600 hover:bg-red-700 px-8 py-2 rounded font-bold disabled:bg-zinc-700"
            >
              {isSubmitting ? 'LISTING...' : 'LIST ITEM — $0.20'}
            </button>
          )}
        </div>
      </form>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleBarcodeScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
}
