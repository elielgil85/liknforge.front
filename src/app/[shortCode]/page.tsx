
'use server';
import { getLongUrl } from '@/lib/url-store';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    shortCode: string;
  };
};

export default async function ShortCodeRedirectPage({ params }: Props) {
  const longUrl = await getLongUrl(params.shortCode);

  if (longUrl) {
    redirect(longUrl);
  } else {
    redirect('/');
  }

  return null;
}
