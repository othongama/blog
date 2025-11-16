import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

const ArticlePage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const data = await postService.getBySlug(slug);
      setPost(data);
      setLikes(data.likes || 0);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Artigo não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const result = await postService.like(post.id);
      setLikes(result.likes);
      toast.success('Obrigado pelo seu like!');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-fantasy-dark mb-4">Artigo não encontrado</h2>
          <Link to="/" className="btn btn-primary">
            Voltar para o início
          </Link>
        </div>
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
            {post.category_slug && (
              <>
                <Link to={`/category/${post.category_slug}`} className="hover:text-fantasy-primary">
                  {post.category_name}
                </Link>
                <span className="mx-2 text-fantasy-secondary">/</span>
              </>
            )}
            <span className="text-fantasy-primary font-medium">{post.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <article className="md:w-3/4 mx-auto">
          <div className="card overflow-hidden">
            {/* Featured Image */}
            <div className="h-64 bg-gradient-to-r from-fantasy-primary to-fantasy-secondary flex items-center justify-center">
              <i className="fab fa-google text-white text-8xl opacity-20"></i>
            </div>

            {/* Article Header */}
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <span className="bg-fantasy-primary bg-opacity-10 text-fantasy-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category_name?.toUpperCase() || 'ARTIGO'}
                </span>
                <span className="mx-3 text-fantasy-secondary">•</span>
                <span className="text-fantasy-dark text-sm opacity-70">
                  Atualizado em:{' '}
                  <span className="font-medium">
                    {format(new Date(post.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-fantasy-dark mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center mb-6">
                <img
                  src={post.author_avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={post.author_name}
                  className="w-12 h-12 rounded-full border-3 border-white shadow mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-fantasy-dark">{post.author_name}</p>
                  <p className="text-xs text-fantasy-dark opacity-70">
                    {post.author_bio || 'Especialista em Monetização Digital'}
                  </p>
                </div>
              </div>

              {post.summary && (
                <div className="bg-fantasy-primary bg-opacity-5 border-l-4 border-fantasy-primary p-4 mb-6 rounded-r-lg">
                  <p className="text-fantasy-dark">
                    <span className="font-bold">Resumo:</span> {post.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div
              className="article-content px-6 pb-8 md:px-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <div className="px-6 py-6 md:px-8 border-t border-fantasy-light">
              {post.tags && post.tags.length > 0 && post.tags[0] && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    tag && tag.name && (
                      <span
                        key={tag.id}
                        className="bg-fantasy-light text-fantasy-dark text-sm px-3 py-1 rounded-full"
                      >
                        #{tag.name}
                      </span>
                    )
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button onClick={handleLike} className="text-fantasy-dark hover:text-fantasy-primary">
                    <i className="far fa-thumbs-up"></i> <span className="ml-1">{likes}</span>
                  </button>
                  <span className="text-fantasy-dark">
                    <i className="far fa-eye"></i> <span className="ml-1">{post.views || 0}</span>
                  </span>
                </div>

                <div className="flex space-x-3">
                  <a href="#" className="w-9 h-9 rounded-full bg-fantasy-light flex items-center justify-center hover:bg-fantasy-primary hover:text-white transition">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-fantasy-light flex items-center justify-center hover:bg-fantasy-primary hover:text-white transition">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-fantasy-light flex items-center justify-center hover:bg-fantasy-primary hover:text-white transition">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticlePage;
