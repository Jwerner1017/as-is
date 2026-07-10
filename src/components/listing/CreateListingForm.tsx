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
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [confirmedPhotos, setConfirmedPhotos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conditional field visibility
  const showExpiration = category === 'Beauty & Personal Wellness';
  const showSize = ['Fashion & Apparel', 'Sports & Outdoors'].includes(category);
  const showYearModel = ['Electronics', 'Automotive', 'Tools & Equipment', 'Collectibles'].includes(category);

  // Handle photo upload with preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    const updatedPhotos = [...photos, ...newFiles];
    const updatedPreviews = [...photoPreviews, ...newPreviews];

    if (updatedPhotos.length < 2) {
      setPhotoError('You must upload at least 2 photos of the actual item.');
    } else {
      setPhotoError('');
    }

    setPhotos(updatedPhotos);
    setPhotoPreviews(updatedPreviews);
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);

    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);

    if (newPhotos.length < 2) {
      setPhotoError('You must upload at least 2 photos of the actual item.');
    }
  };

  // Form validation
  const validateForm = () => {
    if (!category) return 'Please select a category';
    if (!formData.title) return 'Title is required';
    if (!formData.price) return 'Price is required';
    if (photos.length < 2) return 'Minimum 2 photos are required';
    if (!confirmedPhotos) return 'You must confirm that photos are of the actual item';
    
    if (showSize && !formData.size) return 'Size is required for this category';
    if (showExpiration && !formData.expirationDate) return 'Expiration date is required for this category';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const error = validateForm();
    if (error) {
      setPhotoError(error);
      setIsSubmitting(false);
      return;
    }

    // TODO: Upload photos and create listing in Base44
    console.log('Creating listing...', {
      ...formData,
      category,
      photos,
      confirmedPhotos,
    });

    // Reset form after successful submission (example)
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">List an Item</h1>
      <p className="text-zinc-400">Be honest. People will see right through bullshit.</p>

      {/* Category */}
      <div>
        <label className="block mb-2 text-sm font-medium">Category *</label>
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

      {/* Title & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            placeholder="Be descriptive"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Price *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 h-28"
          placeholder="Describe the item honestly..."
        />
      </div>

      {/* Conditional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showSize && (
          <div>
            <label className="block mb-2 text-sm font-medium">Size *</label>
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
            <label className="block mb-2 text-sm font-medium">Expiration Date *</label>
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
            <label className="block mb-2 text-sm font-medium">Year / Model #</label>
            <input
              type="text"
              value={formData.yearOrModel}
              onChange={(e) => setFormData({ ...formData, yearOrModel: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium">Color</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">UPC / SKU #</label>
          <input
            type="text"
            value={formData.upc}
            onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3"
          />
        </div>
      </div>

      {/* Photos Upload */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Photos <span className="text-red-500">(Minimum 2 required)</span>
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          Photos must be taken by you of the actual item. No stock photos, screenshots, or copied images.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-zinc-800 file:text-white"
        />

        {/* Photo Previews */}
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="w-full h-28 object-cover rounded border border-zinc-700" 
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {photoError && <p className="text-red-400 text-sm mt-2">{photoError}</p>}
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="photoConfirm"
          checked={confirmedPhotos}
          onChange={(e) => setConfirmedPhotos(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="photoConfirm" className="text-sm text-zinc-300">
          I confirm that these photos were taken by me of the actual item I am selling. 
          I understand that using stock or copied photos may result in my account being banned.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 py-3 rounded font-bold text-lg mt-4 transition-colors"
      >
        {isSubmitting ? 'LISTING...' : 'LIST THIS ITEM — $0.20'}
      </button>
    </form>
  );
}
