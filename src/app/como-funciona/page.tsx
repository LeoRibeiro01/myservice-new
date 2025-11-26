"use client"

import {
  Search,
  MessageCircle,
  Calendar,
  Star,
  Shield,
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const clientSteps = [
  {
    icon: Search,
    title: "1. Busque o profissional",
    description: "Use nossa busca inteligente para encontrar o prestador ideal para seu serviço",
    details: [
      "Filtros por localização, preço e avaliação",
      "Visualize perfis completos com portfólio",
      "Compare diferentes profissionais",
      "Veja avaliações de outros clientes",
    ],
  },
  {
    icon: MessageCircle,
    title: "2. Entre em contato",
    description: "Converse diretamente com o profissional através do nosso chat",
    details: [
      "Chat em tempo real",
      "Negocie preços e condições",
      "Tire todas as suas dúvidas",
      "Compartilhe fotos e localização",
    ],
  },
  {
    icon: Calendar,
    title: "3. Agende o serviço",
    description: "Escolha data e horário que funcionem para ambos",
    details: [
      "Calendário com horários disponíveis",
      "Confirmação automática",
      "Lembretes por e-mail e SMS",
      "Reagendamento fácil se necessário",
    ],
  },
  {
    icon: Star,
    title: "4. Avalie o serviço",
    description: "Após a conclusão, avalie o profissional e ajude outros clientes",
    details: [
      "Sistema de avaliação de 1 a 5 estrelas",
      "Comentários detalhados",
      "Fotos do resultado final",
      "Histórico de todos os serviços",
    ],
  },
]

const providerSteps = [
  {
    icon: Users,
    title: "1. Cadastre-se",
    description: "Complete seu perfil profissional com todas as informações",
    details: [
      "Documentos verificados",
      "Portfólio de trabalhos",
      "Certificações e experiência",
      "Definição de preços e horários",
    ],
  },
  {
    icon: MessageCircle,
    title: "2. Receba solicitações",
    description: "Clientes interessados entrarão em contato através da plataforma",
    details: [
      "Notificações em tempo real",
      "Detalhes completos do serviço",
      "Localização do cliente",
      "Histórico de avaliações do cliente",
    ],
  },
  {
    icon: Calendar,
    title: "3. Confirme o agendamento",
    description: "Aceite o trabalho e confirme data e horário",
    details: [
      "Gestão de agenda integrada",
      "Confirmação automática",
      "Lembretes de compromissos",
      "Possibilidade de reagendar",
    ],
  },
  {
    icon: CreditCard,
    title: "4. Receba o pagamento",
    description: "Após concluir o serviço, receba o pagamento de forma segura",
    details: [
      "Pagamento direto ao profissional",
      "PIX, dinheiro ou cartão",
      "Sem taxas abusivas",
      "Comprovante automático",
    ],
  },
]

const benefits = [
  {
    icon: Shield,
    title: "Segurança garantida",
    description: "Todos os profissionais são verificados com documentos e antecedentes criminais",
  },
  {
    icon: Star,
    title: "Qualidade comprovada",
    description: "Sistema de avaliações real de clientes que já utilizaram os serviços",
  },
  {
    icon: Clock,
    title: "Rapidez no atendimento",
    description: "Encontre profissionais disponíveis para atendimento imediato ou agendado",
  },
  {
    icon: CreditCard,
    title: "Preços justos",
    description: "Compare preços e negocie diretamente com o profissional",
  },
]

const faqs = [
  {
    question: "Como funciona a verificação dos profissionais?",
    answer:
      "Todos os prestadores passam por um processo rigoroso de verificação que inclui análise de documentos (CPF, RG, comprovante de residência), verificação de antecedentes criminais e validação de experiência profissional. Apenas profissionais aprovados podem oferecer serviços na plataforma.",
  },
  {
    question: "O MyService cobra alguma taxa?",
    answer:
      "Para clientes, o uso da plataforma é 100% gratuito. Para prestadores, cobramos apenas uma pequena taxa de sucesso quando um serviço é concluído, garantindo que você só pague quando realmente ganhar dinheiro.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é feito diretamente entre cliente e prestador. Aceitamos dinheiro, PIX, cartão de débito e crédito. O valor é combinado antes do serviço e pago após a conclusão satisfatória.",
  },
  {
    question: "E se eu não ficar satisfeito com o serviço?",
    answer:
      "Temos uma política de satisfação do cliente. Caso não fique satisfeito, entre em contato conosco em até 24 horas. Analisaremos o caso e, se procedente, ajudaremos a resolver a situação ou encontrar outro profissional.",
  },
  {
    question: "Posso cancelar ou reagendar um serviço?",
    answer:
      "Sim! Tanto clientes quanto prestadores podem cancelar ou reagendar serviços através da plataforma. Recomendamos avisar com pelo menos 2 horas de antecedência para evitar transtornos.",
  },
  {
    question: "Como posso me tornar um prestador verificado?",
    answer:
      "Para se tornar verificado, complete todo o processo de cadastro, envie todos os documentos solicitados e aguarde nossa análise. O processo leva até 48 horas e você receberá o resultado por e-mail.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              MyService
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-indigo-600">
                Encontrar Serviços
              </Link>
              <Link href="/seja-prestador" className="text-gray-700 hover:text-indigo-600">
                Seja um Prestador
              </Link>
              <Link href="/how-it-works" className="text-indigo-600 font-medium">
                Como Funciona
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Como funciona o <span className="text-yellow-300">MyService</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Conectamos você aos melhores profissionais de forma simples, rápida e segura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                Começar agora
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
              >
                Buscar profissionais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Para Clientes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Para Clientes</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como contratar um serviço</h2>
            <p className="text-xl text-gray-600">Processo simples em 4 passos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientSteps.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < clientSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Para Prestadores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Para Prestadores</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como oferecer seus serviços</h2>
            <p className="text-xl text-gray-600">Ganhe dinheiro com seu talento</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {providerSteps.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < providerSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/seja-prestador">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Quero ser um prestador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o MyService?</h2>
            <p className="text-xl text-gray-600">Vantagens que fazem a diferença</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas frequentes</h2>
            <p className="text-xl text-gray-600">Tire suas dúvidas sobre a plataforma</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Junte-se a milhares de pessoas que já encontraram o profissional ideal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                Encontrar profissionais
              </Button>
            </Link>
            <Link href="/seja-prestador">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
              >
                Oferecer serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">MyService</h4>
              <p className="text-gray-400">A plataforma que conecta você aos melhores profissionais da sua região.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Para Clientes</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/services">Encontrar Serviços</Link>
                </li>
                <li>
                  <Link href="/how-it-works">Como Funciona</Link>
                </li>
                <li>
                  <Link href="/safety">Segurança</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Para Profissionais</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/seja-prestador">Seja um Prestador</Link>
                </li>
                <li>
                  <Link href="/pricing">Preços</Link>
                </li>
                <li>
                  <Link href="/resources">Recursos</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Central de Ajuda</Link>
                </li>
                <li>
                  <Link href="/contact">Contato</Link>
                </li>
                <li>
                  <Link href="/terms">Termos de Uso</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyService. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
