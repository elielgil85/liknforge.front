'use server';

import {NextResponse} from 'next/server';
import {z} from 'zod';
import { BACKEND_URL } from '@/constants/api';

const shortUrlSchema = z.object({
  long_url: z.string().url(),
});

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

    const {long_url: longUrl} = parsed.data;

    const response = await fetch(`${BACKEND_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url: longUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} ${errorText}`);
      return NextResponse.json(
        {error: 'Erro ao encurtar a URL.'},
        {status: response.status}
      );
    }

    const data = await response.json();
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const shortUrl = `${domain}/${data.short_code}`;

    return NextResponse.json({shortUrl, originalUrl: longUrl});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Erro interno do servidor.'},
      {status: 500}
    );
  }
}


