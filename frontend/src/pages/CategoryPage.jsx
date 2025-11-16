import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      const [postsData, categoryData] = await Promise.all([
        postService.getAll({ status: 'published', category: slug }),
        categoryService.getBySlug(slug)
      ]);

      setPosts(postsData.posts || []);
      setCategory(categoryData);
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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-fantasy-secondary bg-opacity-10 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-fantasy-dark">
            <Link to="/" className="hover:text-fantasy-primary">Início</Link>
            <span className="mx-2 text-fantasy-secondary">/</span>
            <span className="text-fantasy-primary font-medium">{category?.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {category && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-fantasy-dark mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-fantasy-dark opacity-70 text-lg">{category.description}</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/post/${post.slug}`} className="block">
              <div className="card overflow-hidden h-full">
                <div className="h-40 bg-gradient-to-r from-fantasy-success to-fantasy-primary"></div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-fantasy-dark mb-2 line-clamp-2">
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-fantasy-dark opacity-70">Nenhum artigo encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
