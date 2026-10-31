import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Notas — Bloco de Anotações Simples & Elegante',
  description: 'Aplicativo elegante e intuitivo de anotações com suporte a pastas, listas de tarefas, busca rápida e formatação.',
  openGraph: {
    title: 'Notas — Bloco de Anotações Simples & Elegante',
    description: 'Aplicativo elegante e intuitivo de anotações com suporte a pastas, listas de tarefas, busca rápida e formatação.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notas — Bloco de Anotações Simples & Elegante',
    description: 'Aplicativo elegante e intuitivo de anotações com suporte a pastas, listas de tarefas, busca rápida e formatação.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased text-slate-800 dark:text-slate-100 bg-[#f9f9fb] dark:bg-[#121316] min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
