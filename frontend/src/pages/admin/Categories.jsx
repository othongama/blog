import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoryService.create(formData);
        toast.success('Categoria criada com sucesso!');
      }

      setShowModal(false);
      setFormData({ name: '', slug: '', description: '' });
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Erro ao salvar categoria');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await categoryService.delete(id);
      toast.success('Categoria excluída com sucesso');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
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
        <h1 className="text-3xl font-bold text-fantasy-dark">Categorias</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Nova Categoria
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-fantasy-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Artigos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-fantasy-dark uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-fantasy-light">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-fantasy-dark">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-fantasy-dark opacity-70">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-fantasy-dark opacity-70">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-fantasy-primary bg-opacity-10 text-fantasy-primary">
                      {category.post_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-fantasy-primary hover:text-fantasy-primary-dark"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-fantasy-danger hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-fantasy-dark opacity-70">Nenhuma categoria encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-fantasy-dark mb-6">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  placeholder="Nome da categoria"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  placeholder="slug-da-categoria"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-fantasy-dark mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-fantasy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-fantasy-primary"
                  rows="3"
                  placeholder="Descrição da categoria"
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
