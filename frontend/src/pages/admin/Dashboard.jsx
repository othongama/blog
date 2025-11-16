import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { categoryService } from '../../services/categoryService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allPosts, categories] = await Promise.all([
        postService.getAll({ limit: 100 }),
        categoryService.getAll()
      ]);

      const posts = allPosts.posts || [];
      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        draftPosts: posts.filter(p => p.status === 'draft').length,
        totalCategories: categories.length
      });

      setRecentPosts(posts.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-fantasy-dark">Dashboard</h1>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Novo Artigo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fantasy-dark opacity-70 text-sm mb-1">Total de Artigos</p>
              <p className="text-3xl font-bold text-fantasy-dark">{stats.totalPosts}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-fantasy-primary bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-file-alt text-fantasy-primary text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fantasy-dark opacity-70 text-sm mb-1">Publicados</p>
              <p className="text-3xl font-bold text-fantasy-success">{stats.publishedPosts}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-fantasy-success bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-check-circle text-fantasy-success text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fantasy-dark opacity-70 text-sm mb-1">Rascunhos</p>
              <p className="text-3xl font-bold text-fantasy-warning">{stats.draftPosts}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-fantasy-warning bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-edit text-fantasy-warning text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fantasy-dark opacity-70 text-sm mb-1">Categorias</p>
              <p className="text-3xl font-bold text-fantasy-secondary">{stats.totalCategories}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-fantasy-secondary bg-opacity-10 flex items-center justify-center">
              <i className="fas fa-folder text-fantasy-secondary text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="p-6 border-b border-fantasy-light">
          <h2 className="text-xl font-bold text-fantasy-dark">Artigos Recentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-fantasy-light rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-fantasy-dark mb-1">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-fantasy-dark opacity-70">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {post.author_name}
                    </span>
                    <span>
                      <i className="fas fa-folder mr-1"></i>
                      {post.category_name || 'Sem categoria'}
                    </span>
                    <span>
                      <i className="fas fa-eye mr-1"></i>
                      {post.views || 0} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'published'
                      ? 'bg-fantasy-success bg-opacity-10 text-fantasy-success'
                      : 'bg-fantasy-warning bg-opacity-10 text-fantasy-warning'
                  }`}>
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="text-fantasy-primary hover:text-fantasy-primary-dark"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {recentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-fantasy-dark opacity-70">Nenhum artigo encontrado</p>
              <Link to="/admin/posts/new" className="btn btn-primary mt-4">
                Criar Primeiro Artigo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
