import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

interface Testimonial {
  text: string;
  author: string;
  role: string;
  company: string;
}

const features: Feature[] = [
  {
    title: "Busca Inteligente",
    description: "Encontre leads qualificados com nossa tecnologia de busca avançada",
    icon: "🔍"
  },
  {
    title: "Dados Enriquecidos",
    description: "Informações completas e atualizadas sobre cada lead",
    icon: "📊"
  },
  {
    title: "Exportação Fácil",
    description: "Exporte seus leads em diversos formatos com um clique",
    icon: "📤"
  }
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "R$ 0",
    description: "Para começar a prospectar",
    features: [
      "100 buscas por mês",
      "Dados básicos dos leads",
      "Exportação CSV"
    ],
    buttonText: "Começar Grátis"
  },
  {
    name: "Pro",
    price: "R$ 97/mês",
    description: "Para profissionais",
    features: [
      "1000 buscas por mês",
      "Dados completos dos leads",
      "Exportação em todos formatos",
      "Suporte prioritário"
    ],
    buttonText: "Assinar Pro",
    popular: true
  },
  {
    name: "Escala",
    price: "R$ 297/mês",
    description: "Para times e empresas",
    features: [
      "Buscas ilimitadas",
      "API de integração",
      "Dados em tempo real",
      "Gerenciamento de equipe",
      "Suporte 24/7"
    ],
    buttonText: "Falar com Vendas"
  }
];

const testimonials: Testimonial[] = [
  {
    text: "Incrível como a ferramenta facilitou nossa prospecção. Conseguimos encontrar leads qualificados de forma muito mais eficiente. O ROI foi excepcional!",
    author: "João Silva",
    role: "Diretor Comercial",
    company: "TechCorp"
  },
  {
    text: "Os filtros avançados são fantásticos! Conseguimos segmentar perfeitamente nosso público-alvo e aumentamos nossa taxa de conversão em 150%.",
    author: "Maria Santos",
    role: "Marketing Manager",
    company: "GrowthLabs"
  },
  {
    text: "A melhor ferramenta de prospecção que já usei. A qualidade dos contatos é impressionante e o suporte é excelente. Recomendo fortemente!",
    author: "Pedro Costa",
    role: "CEO",
    company: "InnovateX"
  }
];

interface HeroSectionProps {
  title: string;
  description: string;
}

const HeroSection: FC<HeroSectionProps> = ({ title, description }) => (
  <div className="text-center max-w-4xl mx-auto mb-16">
    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {title}
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
      {description}
    </p>
    <div className="flex justify-center gap-4">
      <Link
        href="/register"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
      >
        Começar Agora
      </Link>
      <Link
        href="/demo"
        className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-200 transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
      >
        Ver Demo
      </Link>
    </div>
  </div>
);

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: FC<FeatureCardProps> = ({ feature }) => (
  <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800 transition-all hover:transform hover:scale-105">
    <div className="text-3xl mb-4">{feature.icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
      {feature.title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {feature.description}
    </p>
  </div>
);

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ testimonial }) => (
  <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
      {testimonial.text}
    </p>
    <div>
      <p className="font-bold text-gray-900 dark:text-white">
        {testimonial.author}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        {testimonial.role} - {testimonial.company}
      </p>
    </div>
  </div>
);

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard: FC<PricingCardProps> = ({ plan }) => (
  <div
    className={`rounded-2xl p-8 ${
      plan.popular
        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105'
        : 'bg-white dark:bg-gray-800'
    } shadow-xl transition-all hover:transform hover:scale-105`}
  >
    {plan.popular && (
      <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
        Mais Popular
      </span>
    )}
    <h3 className={`text-2xl font-bold mb-4 ${
      plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
    }`}>
      {plan.name}
    </h3>
    <p className={`text-4xl font-bold mb-6 ${
      plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
    }`}>
      {plan.price}
    </p>
    <p className={`mb-8 ${
      plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-300'
    }`}>
      {plan.description}
    </p>
    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, index) => (
        <li
          key={index}
          className={`flex items-center ${
            plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Link
      href="/register"
      className={`block w-full text-center py-3 rounded-lg font-semibold ${
        plan.popular
          ? 'bg-white text-blue-600 hover:bg-gray-100'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } transition-all`}
    >
      {plan.buttonText}
    </Link>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="fixed w-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Busca Cliente.ia
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <HeroSection
          title="Encontre seus clientes ideais de forma inteligente"
          description="Use nossa tecnologia avançada para identificar e conectar-se com leads qualificados que realmente importam para seu negócio."
        />

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Recursos que impulsionam seu sucesso
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              O que nossos clientes dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Escolha o plano ideal para você
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Produto</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Como funciona</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Preços</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Guias</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Webinars</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Sobre</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contato</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacidade</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Termos</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Busca Cliente.ia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 