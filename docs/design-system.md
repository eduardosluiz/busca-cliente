# Design System - Busca Cliente.ia

## Visão Geral
Este documento serve como referência para o design system do Busca Cliente.ia, garantindo consistência visual e de experiência do usuário em toda a aplicação.

## Cores
### Paleta Principal
- **Gradiente Principal**: `from-blue-600 to-cyan-500`
  - Usado em: CTAs principais, elementos de destaque
- **Azul Principal**: `#0284c7` (blue-600)
  - Usado em: Links, ícones interativos
- **Ciano**: `#06b6d4` (cyan-500)
  - Usado em: Elementos secundários, indicadores

### Tons de Cinza
- **Fundo Claro**: `bg-white`
- **Fundo Escuro**: `bg-gray-900`
- **Texto Principal Claro**: `text-gray-900`
- **Texto Principal Escuro**: `text-white`
- **Texto Secundário Claro**: `text-gray-600`
- **Texto Secundário Escuro**: `text-gray-300`

## Tipografia
### Fonte Principal
- Família: `'Poppins', sans-serif`
- Pesos utilizados:
  - Regular (400)
  - Semibold (600)
  - Bold (700)

### Hierarquia de Textos
- **H1 (Título Principal)**: `text-5xl sm:text-6xl font-bold`
- **H2 (Subtítulos)**: `text-4xl font-bold`
- **H3 (Títulos de Seção)**: `text-xl font-bold`
- **Texto de Corpo**: `text-base`
- **Texto Pequeno**: `text-sm`

## Componentes

### Botões
#### Botão Primário
```jsx
<button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
  Texto do Botão
</button>
```

#### Botão Secundário
```jsx
<button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
  Texto do Botão
</button>
```

### Cards
```jsx
<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
  {/* Conteúdo do Card */}
</div>
```

### Inputs
```jsx
<input 
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
  type="text"
/>
```

## Layout

### Container Principal
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Conteúdo */}
</div>
```

### Grid System
- Grid de 3 colunas: `grid md:grid-cols-3 gap-8`
- Grid de 2 colunas: `grid md:grid-cols-2 gap-8`

### Espaçamento
- Espaço entre seções: `mb-16`
- Espaço entre elementos: `space-x-4` ou `space-y-4`

## Modo Escuro
A aplicação suporta modo escuro usando a classe `dark`. As variantes dark são definidas usando o prefixo `dark:`.

### Exemplo de Implementação
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Conteúdo */}
</div>
```

## Animações
### Fade In
```jsx
<div className="animate-fade-in">
  {/* Conteúdo */}
</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">
  {/* Conteúdo */}
</div>
```

## Plugins Tailwind Utilizados
- @tailwindcss/forms
- @tailwindcss/typography
- @tailwindcss/aspect-ratio

## Boas Práticas
1. Sempre usar as classes de cores definidas no tema
2. Manter consistência no espaçamento usando as classes do Tailwind
3. Implementar design responsivo usando os breakpoints padrão
4. Seguir a hierarquia de tipografia definida
5. Usar os componentes base como referência para novos elementos

## Acessibilidade
1. Manter contraste adequado entre texto e fundo
2. Usar atributos ARIA quando necessário
3. Garantir que todos os elementos interativos são acessíveis via teclado
4. Implementar estados hover/focus visíveis

## Responsividade
- Mobile First: Começar com layout mobile e expandir para desktop
- Breakpoints principais:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px 