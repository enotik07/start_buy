export const imageToBase64 = (
  file: File
): Promise<{ mime_type: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = (reader.result as string).split(",")[1];
      const mime_type = file.type;
      resolve({ mime_type, data: base64Image });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export function base64ToFileWithPreview(
  base64: string,
  mimeType: string,
): { file: File; preview: string } {
  const bstr = atob(base64);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  const file = new File([u8arr], `${'image'+ "-" + crypto.randomUUID()}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  const preview = `data:${mimeType};base64,${base64}`;

  return { file, preview };
}
