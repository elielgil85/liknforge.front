// For demonstration purposes, we'll store URLs in memory.
// In a production app, you would use a database.
const urlMap = new Map<string, string>();

export async function saveUrl(shortCode: string, longUrl: string): Promise<void> {
  urlMap.set(shortCode, longUrl);
}

export async function getLongUrl(shortCode: string): Promise<string | null> {
  return urlMap.get(shortCode) || null;
}
