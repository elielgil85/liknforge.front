import { LinkForgeIcon } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <LinkForgeIcon className="h-6 w-6 text-foreground" />
            <span className="text-lg font-bold font-headline text-foreground">
              LinkForge
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="/#" className="hover:text-primary transition-colors">
              Sobre Nós
            </a>
            <a href="/#" className="hover:text-primary transition-colors">
              Contato
            </a>
            <a href="/#" className="hover:text-primary transition-colors">
              Termos de Serviço
            </a>
            <a href="/#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </a>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkForge. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
