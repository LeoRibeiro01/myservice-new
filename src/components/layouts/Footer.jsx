import Link from "next/link"

export function Footer() {
  return (
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
                <Link href="/services" className="hover:text-white">
                  Encontrar Serviços
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white">
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Para Profissionais</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/become-provider" className="hover:text-white">
                  Seja um Prestador
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Suporte</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MyService. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
