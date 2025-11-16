import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await postService.getAll(params);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      await postService.delete(id);
      toast.success('Artigo excluído com sucesso');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erro ao excluir artigo');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-fantasy-dark">Artigos</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Novo Artigo
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-fantasy-primary text-white'
              : 'bg-white text-fantasy-dark hover:bg-fantasy-light'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'published'
              ? 'bg-fantasy-success text-white'
              : 'bg-white text-fantasy-dark hover:bg-fantasy-light'
          }`}
        >
          Publicados
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'draft'
              ? 'bg-fantasy-warning text-white'
              : 'bg-white text-fantasy-dark hover:bg-fantasy-light'
          }`}
        >
          Rascunhos
        </button>
      </div>

      {/* Posts List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-fantasy-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-fantasy-light">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-fantasy-dark">{post.title}</div>
                    <div className="text-xs text-fantasy-dark opacity-70">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-fantasy-dark">{post.category_name || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === 'published'
                        ? 'bg-fantasy-success bg-opacity-10 text-fantasy-success'
                        : 'bg-fantasy-warning bg-opacity-10 text-fantasy-warning'
                    }`}>
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fantasy-dark">
                    {post.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fantasy-dark">
                    {format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      to={`/post/${post.slug}`}
                      target="_blank"
                      className="text-fantasy-secondary hover:text-fantasy-secondary-dark"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="text-fantasy-primary hover:text-fantasy-primary-dark"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-fantasy-danger hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-fantasy-dark opacity-70">Nenhum artigo encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
