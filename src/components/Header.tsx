import { LinkForgeIcon } from '@/components/icons';

export default function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2">
          <LinkForgeIcon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">
            LinkForge
          </span>
        </div>
      </div>
    </header>
  );
}
