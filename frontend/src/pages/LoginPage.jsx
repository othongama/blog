import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fantasy-primary to-fantasy-secondary flex items-center justify-center py-12 px-4">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-fantasy-primary mx-auto flex items-center justify-center mb-4">
            <i className="fab fa-google text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-fantasy-dark mb-2">
            Monetize<span className="gradient-text">Pro</span>
          </h1>
          <p className="text-fantasy-dark opacity-70">Acesse o painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-fantasy-dark mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fantasy-dark mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-fantasy-dark opacity-70">
            Credenciais padrão: <br />
            <strong>admin@monetizepro.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
