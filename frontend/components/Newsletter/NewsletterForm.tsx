'use client';

import { useState, FormEvent } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import { newsletterApi } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';
import { toast } from 'react-toastify';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      await newsletterApi.subscribe(email);
      setSubscribed(true);
      setEmail('');
      toast.success('Inscrição realizada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao se inscrever');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <FiCheck className="w-5 h-5" />
        <p className="font-medium">Obrigado por se inscrever!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor email"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary whitespace-nowrap px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Inscrevendo...' : 'Inscrever'}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Receba nossos melhores artigos diretamente no seu email. Sem spam!
      </p>
    </form>
  );
}
