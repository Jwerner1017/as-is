import { useState } from 'react';

interface PhotoUploadProps {
  photos: File[];
  setPhotos: (photos: File[]) => void;
  minPhotos?: number;
}

export function PhotoUpload({ photos, setPhotos, minPhotos = 2 }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setPhotos([...photos, ...newFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleUpload}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:bg-zinc-800 file:text-white"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img src={preview} alt="" className="w-full h-28 object-cover rounded border border-zinc-700" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length < minPhotos && (
        <p className="text-red-400 text-sm mt-2">Minimum {minPhotos} photos required.</p>
      )}
    </div>
  );
}
