import { useState } from 'react';

const CATEGORIES = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Garden',
  'Automotive',
  'Sports & Outdoors',
  'Collectibles',
  'Tools & Equipment',
  'Beauty & Personal Wellness',
  'Toys & Hobbies',
  'Miscellaneous',
];

export function CreateListingForm() {
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'Used',
    color: '',
    upc: '',
    quantity: '1',
    yearOrModel: '',
    size: '',
    expirationDate: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState('');

  // Show/hide fields based on category
  const showExpiration = category === 'Beauty & Personal Wellness';
  const showSize = ['Fashion & Apparel', 'Sports & Outdoors', 'Shoes'].includes(category);
  const showYearModel = ['Electronics', 'Automotive', 'Tools & Equipment', 'Collectibles'].includes(category);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length < 2) {
      setPhotoError('You must upload at least 2 photos of the actual item.');
      return;
    }

    setPhotoError('');
    setPhotos([...photos, ...Array.from(files)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length < 2) {
      setPhotoError('Minimum 2 photos required. Photos must be of the item you are selling.');
      return;
    }

    // TODO: Submit to Base44
    console.log('Submitting listing...', { ...formData, category, photos });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">List an Item</h1>

      {/* Category */}
      <div>
        <label className="block mb-2 text-sm">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 h-28"
          required
        />
      </div>

      {/* Conditional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showSize && (
          <div>
            <label className="block mb-2 text-sm">Size <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
              required
            />
          </div>
        )}

        {showExpiration && (
          <div>
            <label className="block mb-2 text-sm">Expiration Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, yearOrModel: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm">Color</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">UPC / SKU #</label>
          <input
            type="text"
            value={formData.upc}
            onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <label className="block mb-2 text-sm">
          Photos <span className="text-red-500">(Minimum 2 required)</span>
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          Photos must be taken by you of the actual item. No stock photos or screenshots.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-zinc-800 file:text-white"
        />

        {photoError && <p className="text-red-400 text-sm mt-1">{photoError}</p>}

        {photos.length > 0 && (
          <p className="text-green-400 text-sm mt-2">{photos.length} photo(s) selected</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold text-lg mt-4"
      >
        LIST ITEM — $0.20
      </button>
    </form>
  );
}
