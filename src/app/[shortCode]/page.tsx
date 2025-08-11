
'use server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    shortCode: string;
  };
};

async function getLongUrlFromBackend(shortCode: string): Promise<string | null> {
  try {
    // Construct the full URL for the server-side fetch to use the Next.js proxy
    const apiUrl = new URL(`/api/backend/${shortCode}`, process.env.NEXT_PUBLIC_APP_URL).toString();
    
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (res.status === 404) {
      console.log(`Short code ${shortCode} not found in backend.`);
      return null;
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend error for ${shortCode}: ${res.status} ${errorText}`);
      return null;
    }

    const data = await res.json();
    return data.long_url || null;

  } catch (error) {
    console.error('Failed to fetch from backend:', error);
    return null;
  }
}


export default async function ShortCodeRedirectPage({ params }: Props) {
  const longUrl = await getLongUrlFromBackend(params.shortCode);

  if (longUrl) {
    redirect(longUrl);
  } else {
    // If the URL is not found, show a 404 page
    notFound();
  }

  return null;
}
