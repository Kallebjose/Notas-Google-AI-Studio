import { Folder, Note } from '@/types/note';

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'all', name: 'Todas as Notas', isSystem: true },
  { id: 'pinned', name: 'Fixadas', isSystem: true },
  { id: 'pessoal', name: 'Pessoal' },
  { id: 'trabalho', name: 'Trabalho' },
  { id: 'ideias', name: 'Ideias & Projetos' },
  { id: 'receitas', name: 'Receitas' },
  { id: 'trash', name: 'Lixeira', isSystem: true },
];

const now = Date.now();
const oneHourAgo = now - 1000 * 60 * 60;
const yesterday = now - 1000 * 60 * 60 * 24;
const twoDaysAgo = now - 1000 * 60 * 60 * 48;
const threeDaysAgo = now - 1000 * 60 * 60 * 72;

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Bem-vindo ao seu novo Bloco de Notas ✨',
    content: `Este aplicativo foi feito para ser simples, rápido e agradável de usar no dia a dia.

Recursos disponíveis:
• Crie notas e listas de tarefas organizadas em pastas.
• Fixe suas notas mais importantes no topo.
• Adicione tags para encontrar tudo facilmente (#importante, #ideias).
• Alterne entre modo claro e escuro.
• Suas notas são salvas automaticamente no navegador.
• Exporte notas como Markdown, Texto ou faça backup em JSON.

Experimente criar uma nova nota usando o botão "+ Nova Nota" ou explore as pastas na barra lateral!`,
    folderId: 'pessoal',
    isPinned: true,
    isTrashed: false,
    color: 'amber',
    tags: ['dicas', 'inicio'],
    checklist: [],
    createdAt: threeDaysAgo,
    updatedAt: now,
  },
  {
    id: 'note-2',
    title: 'Compras da Semana 🛒',
    content: `Itens essenciais para a despensa e feira de sábado:`,
    folderId: 'pessoal',
    isPinned: true,
    isTrashed: false,
    color: 'emerald',
    tags: ['compras', 'casa'],
    checklist: [
      { id: 'c1', text: 'Café em grãos 100% arábica', completed: true },
      { id: 'c2', text: 'Bananas maduras e maçãs gala', completed: true },
      { id: 'c3', text: 'Pão artesanal de fermentação natural', completed: false },
      { id: 'c4', text: 'Azeite de oliva extravirgem', completed: false },
      { id: 'c5', text: 'Queijo canastra ou meia-cura', completed: false },
      { id: 'c6', text: 'Ovos caipiras (dúzia)', completed: false },
    ],
    createdAt: yesterday,
    updatedAt: oneHourAgo,
  },
  {
    id: 'note-3',
    title: 'Planejamento da Sprint & Metas 🎯',
    content: `Objetivos estratégicos desta semana:

1. Revisão de Interface & UX
- Finalizar testes de usabilidade em dispositivos móveis
- Garantir contraste adequado em modo escuro
- Otimizar tempo de resposta das transições

2. Arquitetura & Performance
- Manter estado local sincronizado instantaneamente
- Suportar atalhos de teclado ágeis
- Reduzir bundle size desnecessário

"A simplicidade é o último grau de sofisticação." — Leonardo da Vinci`,
    folderId: 'trabalho',
    isPinned: false,
    isTrashed: false,
    color: 'sky',
    tags: ['trabalho', 'foco'],
    checklist: [],
    createdAt: twoDaysAgo,
    updatedAt: yesterday,
  },
  {
    id: 'note-4',
    title: 'Ideias para o Próximo App 💡',
    content: `Brainstorming de soluções digitais:

• Rastreador de hábitos minimalista com visualização em calendário mensal.
• Aplicativo de receitas com temporizador integrado e conversor de medidas culinárias.
• Leitor de feeds RSS limpo focado em artigos longos sem distrações.

Ponto de atenção:
Focar sempre em carregamento instantâneo e offline-first.`,
    folderId: 'ideias',
    isPinned: false,
    isTrashed: false,
    color: 'purple',
    tags: ['ideias', 'tecnologia'],
    checklist: [],
    createdAt: threeDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: 'note-5',
    title: 'Pão de Queijo Mineiro Tradicional 🧀',
    content: `Ingredientes:
• 500g de polvilho azedo
• 1 copo (requeijão) de leite integral
• 1/2 copo de óleo de milho ou girassol
• 1 colher (chá) de sal
• 2 ou 3 ovos caipiras
• 300g de queijo minas curado ou canastra ralado grosso

Modo de preparo:
1. Ferva o leite com o óleo e o sal.
2. Escalde o polvilho em uma tigela grande e misture bem até esfriar.
3. Adicione os ovos um a um, sovando até incorporar.
4. Adicione o queijo ralado e amasse até a massa soltar das mãos.
5. Modele bolinhas e asse a 200°C por 25 a 30 minutos até dourarem levemente.`,
    folderId: 'receitas',
    isPinned: false,
    isTrashed: false,
    color: 'amber',
    tags: ['culinaria', 'favoritos'],
    checklist: [],
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo,
  },
];
