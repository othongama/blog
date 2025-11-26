import Link from 'next/link';
import { FiMail, FiGithub, FiTwitter, FiFacebook } from 'react-icons/fi';
import NewsletterForm from '../Newsletter/NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Fique por dentro</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Receba nossos melhores artigos e dicas diretamente no seu email
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-lg font-bold">MonetizePro</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Blog otimizado para monetização com conteúdo de qualidade e estratégias de SEO.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidade" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {currentYear} MonetizePro. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">
              Desenvolvido com ❤️ usando Next.js 14
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
