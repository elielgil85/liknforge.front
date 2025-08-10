'use server';

import {NextResponse} from 'next/server';
import {z} from 'zod';

const shortUrlSchema = z.object({
  url: z.string().url(),
});

// For demonstration purposes, we'll store URLs in memory.
// In a production app, you would use a database.
const urlMap = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = shortUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {error: 'URL inválida.'},
        {status: 400}
      );
    }

    const {url: longUrl} = parsed.data;

    // Generate a short code
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // In a real app, you'd check for collisions here.

    urlMap.set(shortCode, longUrl);

    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const shortUrl = `${domain}/${shortCode}`;

    return NextResponse.json({shortUrl, originalUrl: longUrl});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Erro interno do servidor.'},
      {status: 500}
    );
  }
}

// This function is not exposed via an endpoint, but would be used by the redirect page.
export async function getLongUrl(shortCode: string): Promise<string | null> {
    return urlMap.get(shortCode) || null;
}
