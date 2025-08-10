"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Share2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  url: z.string().url({ message: 'Por favor, insira uma URL válida.' }),
});

interface ShortenedData {
  shortUrl: string;
  originalUrl: string;
}

export default function ShortenerForm() {
  const [result, setResult] = useState<ShortenedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleShorten = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ long_url: values.url }),
      });

      if (!response.ok) {
        throw new Error('Falha ao encurtar a URL.');
      }

      const data = await response.json();
      const backendDomain = 'http://localhost:3001';
      const shortUrl = `${backendDomain}/${data.short_code}`;

      setResult({
        shortUrl: shortUrl,
        originalUrl: values.url
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oops! Algo deu errado.',
        description: 'Não foi possível encurtar o seu link. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      toast({
        title: 'Copiado!',
        description: 'O link curto foi copiado para a sua área de transferência.',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && result) {
      navigator
        .share({
          title: 'Link encurtado com LinkForge',
          text: `Confira este link: ${result.shortUrl}`,
          url: result.shortUrl,
        })
        .catch(console.error);
    } else {
      handleCopy();
      toast({
        title: 'Copiado!',
        description:
          'A função de compartilhar não é suportada neste navegador, mas o link foi copiado!',
      });
    }
  };

  return (
    <>
      <Card className="shadow-2xl mb-12 border-2 border-transparent focus-within:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleShorten)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Cole seu link longo aqui..."
                        {...field}
                        className="pl-10 h-14 text-lg bg-background"
                        aria-label="URL para encurtar"
                      />
                    </FormControl>
                    <FormMessage className="text-left absolute" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full sm:w-auto text-lg px-8 shrink-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Encurtando...
                  </>
                ) : (
                  'Encurtar'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in-50 duration-500">
          <Card className="text-left shadow-lg">
            <CardHeader>
              <CardTitle>Seu link foi encurtado!</CardTitle>
              <CardDescription>Copie, compartilhe ou crie outro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg border">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg hover:underline break-all text-accent-foreground"
                  style={{color: "hsl(var(--accent))"}}
                >
                  {result.shortUrl}
                </a>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    aria-label="Copiar link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Compartilhar link"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium text-foreground">Link Original:</span>{' '}
                {result.originalUrl}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
