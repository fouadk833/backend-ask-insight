export function getFastApiBaseUrl(): string {
  const url = process.env.FASTAPI_URL || 'http://localhost:8000';
  // Normalize: if no protocol prefix, assume https for non-local URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
