import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          setError('No camera found on this device.');
          return;
        }

        // Use the rear camera if available
        const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result && isScanning) {
              setIsScanning(false);
              onScan(result.getText());
              codeReader.reset();
              onClose();
            }
            if (err && !(err instanceof Error)) {
              // Ignore normal scanning errors
            }
          }
        );
      } catch (err) {
        console.error(err);
        setError('Failed to access camera. Please check permissions.');
      }
    };

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, [onScan, onClose, isScanning]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h3 className="text-lg font-semibold">Scan Barcode</h3>
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button 
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-zinc-800 rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <video 
              ref={videoRef} 
              className="w-full rounded-lg border border-zinc-700"
            />
            <p className="text-center text-sm text-zinc-400 mt-4">
              Position the barcode inside the camera view
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
