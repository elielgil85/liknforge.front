import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ShortenerForm from '@/components/ShortenerForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-1000">
            Links curtos, grandes resultados
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-in fade-in-0 slide-in-from-top-6 duration-1000 delay-200">
            Um encurtador de URL poderoso e simples. Crie links curtos,
            memoráveis e rastreáveis.
          </p>
          <div className="animate-in fade-in-0 slide-in-from-top-8 duration-1000 delay-300">
            <ShortenerForm />
          </div>
        </div>
        <div className="animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 delay-500">
          <Benefits />
        </div>
      </main>
      <Footer />
    </div>
  );
}
