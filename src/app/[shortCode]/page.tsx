
'use server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    shortCode: string;
  };
};

import { BACKEND_URL } from '@/constants/api';

async function getLongUrlFromBackend(shortCode: string): Promise<string | null> {
  try {
    const apiUrl = `${BACKEND_URL}/${shortCode}`;

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
    // This catch block is important for network errors (e.g., backend is down).
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

  // This part is never reached because of redirect() or notFound()
  return null;
}
