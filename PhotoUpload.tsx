import { useState } from 'react';

interface <PhotoUpload 
  photos={photos} 
  setPhotos={setPhotos} 
  minPhotos={2} 
/>

export function PhotoUpload({ photos, setPhotos, minPhotos = 2 }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    const updatedPhotos = [...photos, ...newFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);

    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  const hasEnoughPhotos = photos.length >= minPhotos;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Photos <span className="text-red-500">(Minimum {minPhotos} required)</span>
        </label>
        <p className="text-xs text-zinc-400 mb-3">
          Photos must be taken by you of the actual item. No stock photos or screenshots.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-zinc-400 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded file:border-0 
                     file:bg-zinc-800 file:text-white 
                     file:cursor-pointer hover:file:bg-zinc-700"
        />
      </div>

      {/* Photo Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-28 object-cover rounded-lg border border-zinc-700"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white 
                           rounded-full w-6 h-6 flex items-center justify-center text-xs 
                           opacity-90 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status Message */}
      <div className="text-sm">
        {photos.length === 0 && (
          <p className="text-zinc-400">No photos uploaded yet.</p>
        )}
        {photos.length > 0 && !hasEnoughPhotos && (
          <p className="text-red-400">
            {photos.length} / {minPhotos} photos uploaded. Please add more.
          </p>
        )}
        {hasEnoughPhotos && (
          <p className="text-green-400">
            {photos.length} photos uploaded ✓
          </p>
        )}
      </div>
    </div>
  );
}
