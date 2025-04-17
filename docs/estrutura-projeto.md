# Estrutura do Projeto Busca Cliente.ia

## Visão Geral
O Busca Cliente.ia é uma aplicação Next.js 14 que permite aos usuários encontrar e gerenciar contatos de empresas e profissionais. A aplicação utiliza Supabase para autenticação e armazenamento de dados.

## Tecnologias Principais
- Next.js 14.1.0
- React
- TypeScript
- Supabase (Autenticação e Banco de Dados)
- Tailwind CSS
- Shadcn/ui (Componentes)

## Estrutura de Diretórios

```
src/
├── app/                    # Rotas e páginas da aplicação
│   ├── (auth)/            # Rotas protegidas que requerem autenticação
│   ├── api/               # Rotas da API
│   ├── layout.tsx         # Layout principal da aplicação
│   └── page.tsx           # Página inicial (Landing page)
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI básicos (buttons, inputs, etc)
│   └── [outros]          # Componentes específicos da aplicação
├── lib/                   # Utilitários e configurações
│   ├── database.types.ts  # Tipos do Supabase
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
└── services/             # Serviços e integrações
```

## Principais Componentes

### Layout Principal (`app/layout.tsx`)
- Componente Server-side que define a estrutura base da aplicação
- Gerencia metadados e fonte Inter do Google
- Envolve a aplicação com o AuthProvider

### Página Inicial (`app/page.tsx`)
- Landing page com apresentação do produto
- Componente Client-side com interatividade
- Usa componentes do Shadcn/ui para botões e interface

### Autenticação (`app/providers.tsx`)
- Provedor de autenticação usando Supabase
- Gerencia estado de autenticação globalmente
- Fornece hook useAuth para componentes filhos

## Funcionalidades Principais

### Sistema de Autenticação
- Implementado com Supabase Auth
- Suporte para email/senha e OAuth
- Middleware para proteção de rotas

### Gerenciamento de Contatos
- CRUD completo de contatos
- Filtros e busca avançada
- Paginação e ordenação

### Busca de Clientes
- Interface de busca com filtros
- Integração com APIs externas
- Sistema de salvamento de contatos

## Padrões e Convenções

### Componentes
- Uso de 'use client' para componentes interativos
- Componentes UI base em /components/ui
- Props tipadas com TypeScript

### Estilização
- Tailwind CSS para estilos
- Variáveis CSS personalizadas
- Sistema de design consistente

### Estado e Dados
- Server Components quando possível
- Client Components para interatividade
- Supabase para persistência

## Middleware e Segurança

### Proteção de Rotas
- Middleware Next.js para autenticação
- Redirecionamentos automáticos
- Validação de sessão

### Manipulação de Erros
- Componentes de erro personalizados
- Tratamento global de erros
- Feedback visual para usuários

## Integração com Supabase

### Autenticação
- Gerenciamento de sessão
- Refresh tokens automático
- Proteção contra CSRF

### Banco de Dados
- Tipos gerados automaticamente
- Políticas RLS para segurança
- Queries otimizadas

## Considerações de Performance

### Otimizações
- Server Components para redução de JS
- Imagens otimizadas com next/image
- Carregamento sob demanda

### Cache
- Estratégias de cache implementadas
- Revalidação de dados
- Otimização de builds

## Desenvolvimento

### Ambiente Local
- Variáveis de ambiente necessárias
- Configuração do Supabase local
- Scripts de desenvolvimento

### Deployment
- Configurado para deploy na Vercel
- CI/CD automatizado
- Variáveis de ambiente seguras

## Próximos Passos
- Implementação de testes automatizados
- Melhorias na UX/UI
- Novas integrações
- Sistema de planos e pagamentos 