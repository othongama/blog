import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        postService.getAll({ status: 'published', limit: 10 }),
        categoryService.getAll()
      ]);

      setPosts(postsData.posts || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-fantasy-secondary bg-opacity-10 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-fantasy-dark">
            <Link to="/" className="hover:text-fantasy-primary">Início</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="md:flex md:space-x-8">
          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Featured Post */}
            {featuredPost && (
              <Link to={`/post/${featuredPost.slug}`} className="block mb-8">
                <div className="card overflow-hidden">
                  <div className="h-64 bg-gradient-to-r from-fantasy-primary to-fantasy-secondary flex items-center justify-center">
                    <i className="fab fa-google text-white text-8xl opacity-20"></i>
                  </div>
                  <div className="p-6">
                    <span className="bg-fantasy-primary bg-opacity-10 text-fantasy-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {featuredPost.category_name || 'MONETIZAÇÃO'}
                    </span>
                    <h2 className="text-3xl font-bold text-fantasy-dark mt-4 mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-fantasy-dark opacity-70 mb-4">
                      {featuredPost.summary}
                    </p>
                    <div className="flex items-center text-sm text-fantasy-dark opacity-60">
                      <span>{featuredPost.author_name}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {format(new Date(featuredPost.published_at || featuredPost.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{featuredPost.views || 0} visualizações</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Recent Posts */}
            <h3 className="text-2xl font-bold text-fantasy-dark mb-6">Artigos Recentes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {otherPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.slug}`} className="block">
                  <div className="card overflow-hidden h-full">
                    <div className="h-40 bg-gradient-to-r from-fantasy-success to-fantasy-primary"></div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-fantasy-primary">
                        {post.category_name?.toUpperCase() || 'ARTIGO'}
                      </span>
                      <h4 className="font-bold text-lg text-fantasy-dark mt-2 mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-fantasy-dark opacity-70 text-sm line-clamp-3 mb-4">
                        {post.summary}
                      </p>
                      <div className="flex items-center text-sm text-fantasy-dark opacity-60">
                        <span>
                          {format(new Date(post.published_at || post.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{post.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:w-1/4 mt-8 md:mt-0">
            <div className="card p-6 mb-6">
              <h3 className="font-bold text-lg text-fantasy-dark mb-4">Categorias</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-fantasy-dark hover:text-fantasy-primary flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                      <span className="bg-fantasy-light text-fantasy-dark text-xs px-2 py-1 rounded-full">
                        {category.post_count || 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-lg text-fantasy-dark mb-4">Newsletter</h3>
              <p className="text-fantasy-dark opacity-70 text-sm mb-4">
                Receba dicas exclusivas de monetização diretamente no seu e-mail.
              </p>
              <form>
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-4 py-2 border border-fantasy-light rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-fantasy-primary focus:border-transparent"
                />
                <button type="submit" className="btn btn-primary w-full">
                  Assinar
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
