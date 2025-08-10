import fs from 'fs/promises';
import path from 'path';

// Em um ambiente de produção, use um banco de dados de verdade.
// O acesso ao sistema de arquivos em ambientes serverless pode ser inconsistente.
const dbPath = path.join(process.cwd(), 'links.json');

type UrlMap = {
  links: Record<string, string>;
};

async function readDb(): Promise<UrlMap> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna uma estrutura vazia.
    return { links: {} };
  }
}

async function writeDb(data: UrlMap): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function saveUrl(shortCode: string, longUrl: string): Promise<void> {
  const db = await readDb();
  db.links[shortCode] = longUrl;
  await writeDb(db);
}

export async function getLongUrl(shortCode: string): Promise<string | null> {
  const db = await readDb();
  return db.links[shortCode] || null;
}
