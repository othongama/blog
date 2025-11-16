import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-fantasy-primary flex items-center justify-center">
              <i className="fab fa-google text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-fantasy-dark">
              Monetize<span className="gradient-text">Pro</span>
            </h1>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Início
            </Link>
            <Link to="/category/estrategias" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Tutoriais
            </Link>
            <Link to="/category/ferramentas" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Ferramentas
            </Link>
            {user && (
              <>
                <Link to="/admin" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-fantasy-danger hover:text-red-700 font-medium"
                >
                  Sair
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden text-fantasy-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3">
            <Link to="/" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Início
            </Link>
            <Link to="/category/estrategias" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Tutoriais
            </Link>
            <Link to="/category/ferramentas" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
              Ferramentas
            </Link>
            {user && (
              <>
                <Link to="/admin" className="text-fantasy-dark hover:text-fantasy-primary font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-fantasy-danger hover:text-red-700 font-medium text-left"
                >
                  Sair
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="text-fantasy-primary font-medium">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
