import { ImageContext } from '@/types/index';

export async function uploadImages(
  images: { data: string; mediaType: string }[]
) {
  const response = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload images');
  }

  const data = await response.json();
  return data; // Returns { description: string }
}

export async function getAmbientResponse(
  content: string,
  imageContexts: ImageContext[]
): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, imageContexts }),
  });

  if (!response.ok) {
    throw new Error('Failed to get ambient response');
  }

  const data = await response.json();
  return data.suggestion;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
