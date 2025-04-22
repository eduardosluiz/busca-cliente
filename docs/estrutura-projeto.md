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
│   ├── assinatura/        # Página de planos e assinatura
│   ├── auth/              # Rotas de autenticação
│   ├── buscar-clientes/   # Funcionalidade de busca de clientes
│   ├── configuracoes/     # Configurações do usuário
│   ├── dashboard/         # Painel principal
│   ├── login/            # Página de login
│   ├── meus-contatos/    # Gerenciamento de contatos
│   ├── perfil/           # Perfil do usuário
│   ├── register/         # Página de registro
│   ├── api/              # Rotas da API
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Landing page
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI básicos
│   ├── ContactFilters.tsx   # Filtros de contatos
│   ├── ContactForm.tsx      # Formulário de contatos
│   ├── ContactList.tsx      # Lista de contatos
│   ├── ContactsTable.tsx    # Tabela de contatos
│   ├── DashboardLayout.tsx  # Layout do dashboard
│   ├── EmailConfirmation.tsx # Confirmação de email
│   ├── LoginForm.tsx        # Formulário de login
│   ├── Profile.tsx          # Componente de perfil
│   ├── Sidebar.tsx          # Barra lateral
│   └── UserInfo.tsx         # Informações do usuário
├── lib/                  # Utilitários e configurações
└── services/            # Serviços e integrações
```

## Funcionalidades Principais

### Sistema de Autenticação
- Login com email/senha
- Registro de novos usuários
- Confirmação de email
- Recuperação de senha
- Middleware de proteção de rotas

### Dashboard
- Visão geral das atividades
- Métricas e estatísticas
- Acesso rápido às principais funcionalidades

### Gerenciamento de Contatos
- CRUD completo de contatos
- Filtros avançados de busca
- Tabela de visualização com ordenação
- Formulário de cadastro/edição
- Lista personalizada de contatos

### Perfil e Configurações
- Edição de informações pessoais
- Configurações da conta
- Preferências do sistema
- Gerenciamento de assinatura

### Sistema de Assinatura
- Planos disponíveis
- Processo de assinatura
- Gerenciamento de pagamentos

### Componentes de UI
- Modais de login e registro
- Barra de navegação responsiva
- Sidebar com navegação principal
- Componentes de feedback (loading, error)
- Tabelas e formulários padronizados

## Padrões e Convenções

### Componentes
- Componentes funcionais com TypeScript
- Uso de hooks personalizados
- Separação clara entre componentes de UI e lógica

### Estilização
- Tailwind CSS para estilos
- Componentes shadcn/ui personalizados
- Design system consistente

### Estado e Dados
- Server Components para performance
- Client Components para interatividade
- Integração robusta com Supabase

## Próximos Passos
- Implementação de testes automatizados
- Melhorias na UX/UI
- Expansão das integrações
- Otimização de performance
- Sistema de notificações
- Relatórios e análises avançadas 