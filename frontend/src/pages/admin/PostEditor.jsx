import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postService } from '../../services/postService';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category_id: '',
    status: 'draft',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadCategories();
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPost = async () => {
    try {
      // For now, we'll fetch from the list since we don't have a getById endpoint
      const data = await postService.getAll({ limit: 100 });
      const post = data.posts.find(p => p.id === parseInt(id));

      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          summary: post.summary || '',
          content: post.content,
          category_id: post.category_id || '',
          status: post.status,
          tags: post.tags || []
        });
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Erro ao carregar artigo');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = {
        name: tagInput.trim(),
        slug: generateSlug(tagInput.trim())
      };

      if (!formData.tags.find(t => t.slug === newTag.slug)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (slug) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t.slug !== slug)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await postService.update(id, formData);
        toast.success('Artigo atualizado com sucesso!');
      } else {
        await postService.create(formData);
        toast.success('Artigo criado com sucesso!');
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Erro ao salvar artigo');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fantasy-dark">
          {id ? 'Editar Artigo' : 'Novo Artigo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  placeholder="Digite o título do artigo"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  placeholder="slug-do-artigo"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Resumo
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-3 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  rows="3"
                  placeholder="Breve resumo do artigo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Conteúdo *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={modules}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="card p-6">
              <h3 className="font-bold text-fantasy-dark mb-4">Publicação</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Salvando...' : id ? 'Atualizar' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/posts')}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="card p-6">
              <h3 className="font-bold text-fantasy-dark mb-4">Categoria</h3>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="card p-6">
              <h3 className="font-bold text-fantasy-dark mb-4">Tags</h3>

              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary text-sm"
                  placeholder="Adicionar tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  tag && tag.name && (
                    <span
                      key={tag.slug}
                      className="bg-fantasy-light text-fantasy-dark text-sm px-3 py-1 rounded-full flex items-center space-x-2"
                    >
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.slug)}
                        className="text-fantasy-danger hover:text-red-700"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
