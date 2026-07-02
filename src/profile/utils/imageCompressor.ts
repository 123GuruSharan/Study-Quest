/**
 * Loads an image file, resizes it to fit within maxDim x maxDim,
 * and compresses it to WebP format.
 */
export async function resizeAndConvertToWebP(file: File, maxDim: number = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Canvas compression is client-side only."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale maintaining aspect ratio
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not acquire 2D canvas context"));
          return;
        }

        // Draw image resized onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas rendering returned empty blob"));
            }
          },
          "image/webp",
          0.85 // 85% compression quality for optimal size and clarity
        );
      };
      img.onerror = () => reject(new Error("Failed to initialize image source"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to process file binary stream"));
    reader.readAsDataURL(file);
  });
}
