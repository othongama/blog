import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-fantasy-light">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-fantasy-primary flex items-center justify-center">
                  <i className="fas fa-tachometer-alt text-white text-xl"></i>
                </div>
                <h1 className="text-xl font-bold text-fantasy-dark">
                  Admin<span className="gradient-text">Panel</span>
                </h1>
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/admin"
                  className={`font-medium ${
                    location.pathname === '/admin'
                      ? 'text-fantasy-primary'
                      : 'text-fantasy-dark hover:text-fantasy-primary'
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Dashboard
                </Link>
                <Link
                  to="/admin/posts"
                  className={`font-medium ${
                    isActive('/admin/posts')
                      ? 'text-fantasy-primary'
                      : 'text-fantasy-dark hover:text-fantasy-primary'
                  }`}
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Artigos
                </Link>
                <Link
                  to="/admin/categories"
                  className={`font-medium ${
                    isActive('/admin/categories')
                      ? 'text-fantasy-primary'
                      : 'text-fantasy-dark hover:text-fantasy-primary'
                  }`}
                >
                  <i className="fas fa-folder mr-2"></i>
                  Categorias
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/" className="text-fantasy-dark hover:text-fantasy-primary">
                <i className="fas fa-home mr-2"></i>
                Ver Site
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-fantasy-dark">{user?.name}</p>
                  <p className="text-xs text-fantasy-dark opacity-70">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-fantasy-danger hover:text-red-700 font-medium"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
