
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
    // We ask for json=true so the backend returns the data instead of redirecting
    const res = await fetch(`http://localhost:3001/${shortCode}?json=true`);

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      // Log the error and return null if something went wrong
      console.error(`Backend error for ${shortCode}: ${res.statusText}`);
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
