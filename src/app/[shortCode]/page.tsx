
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
    // The backend redirect page needs to query the backend for the long URL.
    // It asks for `json=true` so the backend returns the data instead of trying to redirect itself.
    const apiUrl = `http://localhost:3001/${shortCode}?json=true`;
    
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      // Log the error and return null if something went wrong
      console.error(`Backend error for ${shortCode}: ${res.status} ${await res.text()}`);
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
