import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-fantasy-dark text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-fantasy-primary flex items-center justify-center">
                <i className="fab fa-google text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold">
                Monetize<span className="gradient-text">Pro</span>
              </h3>
            </div>
            <p className="text-fantasy-light opacity-70 text-sm">
              O guia definitivo para monetizar seu conteúdo online com estratégias comprovadas e dicas de especialistas.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-fantasy-light opacity-70">
              <li>
                <Link to="/" className="hover:text-white hover:opacity-100">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/category/google-adsense" className="hover:text-white hover:opacity-100">
                  Google Adsense
                </Link>
              </li>
              <li>
                <Link to="/category/estrategias" className="hover:text-white hover:opacity-100">
                  Estratégias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-opacity-20 bg-white rounded-full flex items-center justify-center text-white hover:bg-opacity-30">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-opacity-20 bg-white rounded-full flex items-center justify-center text-white hover:bg-opacity-30">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-opacity-20 bg-white rounded-full flex items-center justify-center text-white hover:bg-opacity-30">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-fantasy-light opacity-70 text-sm mb-3">
              Receba as últimas novidades sobre monetização.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="px-3 py-2 bg-opacity-20 bg-white text-white rounded-l focus:outline-none focus:ring-1 focus:ring-fantasy-primary w-full"
              />
              <button className="bg-fantasy-primary text-white px-3 py-2 rounded-r hover:bg-opacity-90">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-opacity-20 border-white mt-8 pt-8 text-center text-fantasy-light opacity-70 text-sm">
          <p>© 2023 MonetizePro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
