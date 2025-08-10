import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { MousePointerClick, Link2, PieChart } from 'lucide-react';

const benefits = [
  {
    icon: <MousePointerClick className="h-10 w-10 mb-4 text-primary" />,
    title: 'Rastreamento de Cliques',
    description:
      'Monitore cada clique e entenda o desempenho dos seus links com estatísticas detalhadas.',
  },
  {
    icon: <Link2 className="h-10 w-10 mb-4 text-primary" />,
    title: 'Links Personalizados',
    description:
      'Crie links curtos e memoráveis que refletem sua marca, como meu.link/produto-especial.',
  },
  {
    icon: <PieChart className="h-10 w-10 mb-4 text-primary" />,
    title: 'Análise Detalhada',
    description:
      'Obtenha insights sobre seu público com relatórios de geolocalização, dispositivos e referências.',
  },
];

export default function Benefits() {
  return (
    <section className="py-16 md:py-24 text-left">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
          Uma plataforma completa de gerenciamento de links
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Mais do que um simples encurtador de URLs, uma ferramenta para impulsionar seus resultados.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className="bg-card/50 hover:bg-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <CardHeader className="items-center text-center">
              {benefit.icon}
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription className="pt-2 text-base">
                {benefit.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
