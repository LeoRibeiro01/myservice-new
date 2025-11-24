"use client"

import { CheckCircle, Shield, TrendingUp, Users, Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const benefits = [
  {
    icon: TrendingUp,
    title: "Aumente sua renda",
    description: "Ganhe dinheiro extra oferecendo seus serviços para milhares de clientes",
  },
  {
    icon: Users,
    title: "Clientes qualificados",
    description: "Conecte-se com clientes que realmente precisam dos seus serviços",
  },
  {
    icon: Clock,
    title: "Flexibilidade total",
    description: "Trabalhe quando quiser, defina seus horários e preços",
  },
  {
    icon: Shield,
    title: "Segurança garantida",
    description: "Plataforma segura com verificação de clientes e sistema de avaliações",
  },
]

const requirements = [
  "Ser maior de 18 anos",
  "Ter CPF e RG válidos",
  "Comprovante de residência atualizado",
  "Certidão de antecedentes criminais",
  "Experiência comprovada na área",
  "Disponibilidade para atendimento",
]

const steps = [
  {
    number: "01",
    title: "Cadastro completo",
    description: "Preencha todas as informações pessoais e profissionais",
  },
  {
    number: "02",
    title: "Envio de documentos",
    description: "Envie todos os documentos necessários para verificação",
  },
  {
    number: "03",
    title: "Análise e aprovação",
    description: "Nossa equipe analisa seu perfil em até 48 horas",
  },
  {
    number: "04",
    title: "Comece a trabalhar",
    description: "Perfil aprovado! Receba solicitações e comece a ganhar",
  },
]

export default function BecomeProviderPage() {
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
              <Link href="/become-provider" className="text-indigo-600 font-medium">
                Seja um Prestador
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme seu talento em <span className="text-yellow-300">renda extra</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Junte-se a milhares de profissionais que já faturam mais com o MyService
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/provider-register">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
              >
                Saiba mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o MyService?</h2>
            <p className="text-xl text-gray-600">Vantagens exclusivas para profissionais como você</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Requisitos para se cadastrar</h2>
            <p className="text-xl text-gray-600">Verifique se você atende aos critérios básicos</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-xl text-gray-600">Processo simples em 4 etapas</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15.000+</div>
              <div className="text-indigo-200">Profissionais cadastrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">R$ 2.500</div>
              <div className="text-indigo-200">Renda média mensal</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-indigo-200 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                Avaliação média
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Cadastre-se agora e comece a receber solicitações de serviço ainda hoje
          </p>
          <Link href="/auth/provider-register">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
              Criar conta de prestador
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Cadastro gratuito • Sem taxas de adesão • Comece a ganhar hoje mesmo
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
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
                  <Link href="/become-provider">Seja um Prestador</Link>
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
