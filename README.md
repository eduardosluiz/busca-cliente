# Busca Cliente.ia

Plataforma para encontrar contatos de empresas e profissionais filtrados por nicho.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Stripe

## Requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd busca-cliente-ia
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
src/
  ├── app/              # Páginas da aplicação
  ├── components/       # Componentes React reutilizáveis
  ├── lib/             # Utilitários e configurações
  ├── types/           # Definições de tipos TypeScript
  └── styles/          # Estilos globais e componentes
```

## Funcionalidades

- Autenticação de usuários
- Busca de contatos por nicho
- Integração com redes sociais
- Sistema de assinatura com Stripe
- Tema claro/escuro
- Interface responsiva

## Planos

### Free
- 10 buscas por mês
- 50 contatos por mês
- Dados básicos de contato

### Início (R$ 49,90/mês)
- 50 buscas por mês
- 1.000 contatos por mês
- Dados completos de contato
- Suporte prioritário

### Premium (R$ 69,90/mês)
- 100 buscas por mês
- 3.000 contatos por mês
- Dados completos de contato
- Suporte prioritário
- Exportação em massa

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 