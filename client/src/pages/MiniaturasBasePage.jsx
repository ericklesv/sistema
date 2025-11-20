import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export function MiniaturasBasePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [miniaturas, setMiniaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [selectedMiniaturaForClients, setSelectedMiniaturaForClients] = useState(null);
  const [clientsWithMiniatura, setClientsWithMiniatura] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchMiniaturas();
  }, [user, navigate]);

  const fetchMiniaturas = async () => {
    try {
      const res = await api.get('/api/miniaturas-base');
      setMiniaturas(res.data);
    } catch (err) {
      console.error('Erro ao buscar miniaturas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.brand.trim()) {
      alert('Nome e marca são obrigatórios');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await api.put(`/api/miniaturas-base/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Miniatura atualizada com sucesso!');
      } else {
        const res = await api.post('/api/miniaturas-base', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMiniaturas([...miniaturas, res.data]);
        alert(`✅ Miniatura criada com código: ${res.data.code}`);
      }
      
      resetForm();
      setShowAddModal(false);
      fetchMiniaturas();
    } catch (err) {
      console.error('Erro ao salvar miniatura:', err);
      alert('Erro ao salvar miniatura');
    }
  };

  const handleEdit = (miniatura) => {
    setEditingId(miniatura.id);
    setFormData({
      name: miniatura.name,
      brand: miniatura.brand,
      photoUrl: miniatura.photoUrl || ''
    });
    if (miniatura.photoUrl) {
      setPhotoPreview(miniatura.photoUrl);
    }
    setShowAddModal(true);
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Tem certeza que deseja deletar a miniatura ${code}?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/miniaturas-base/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMiniaturas(miniaturas.filter(m => m.id !== id));
      alert('Miniatura deletada com sucesso');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar miniatura');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', brand: '', photoUrl: '' });
    setPhotoPreview(null);
    setEditingId(null);
  };

  const handleShowClients = async (miniatura) => {
    setSelectedMiniaturaForClients(miniatura);
    setLoadingClients(true);
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/api/miniaturas-base/${miniatura.id}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientsWithMiniatura(res.data);
      setShowClientsModal(true);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      alert('Erro ao buscar clientes com esta miniatura');
    } finally {
      setLoadingClients(false);
    }
  };

  const filteredMiniaturas = miniaturas.filter(m =>
    m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📦 Banco de Miniaturas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerenciar o catálogo de miniaturas disponíveis
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
          >
            ➕ Nova Miniatura
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por código, nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabela de Miniaturas */}
        <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden">
          {filteredMiniaturas.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">Nenhuma miniatura cadastrada ainda</p>
              <p className="text-sm mt-2">Clique em "Nova Miniatura" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-slate-600 border-b border-gray-200 dark:border-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMiniaturas.map((miniatura, index) => (
                    <tr
                      key={miniatura.id}
                      className={`border-b border-gray-200 dark:border-slate-600 ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-slate-700'
                          : 'bg-gray-50 dark:bg-slate-600/50'
                      } hover:bg-blue-50 dark:hover:bg-slate-600/50 transition`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-mono font-bold">
                          {miniatura.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {miniatura.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {miniatura.brand}
                      </td>
                      <td className="px-6 py-4">
                        {miniatura.photoUrl ? (
                          <img
                            src={miniatura.photoUrl}
                            alt={miniatura.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleShowClients(miniatura)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition text-sm"
                            title="Ver clientes com esta miniatura"
                          >
                            👥
                          </button>
                          <button
                            onClick={() => handleEdit(miniatura)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(miniatura.id, miniatura.code)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Adicionar/Editar */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? '✏️ Editar Miniatura' : '➕ Nova Miniatura'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {editingId ? 'Atualize os dados da miniatura' : 'O código será gerado automaticamente'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Miniatura *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Ferrari F40"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Ex: Hot Wheels"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Foto da Miniatura
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white file:mr-4 file:px-4 file:py-2 file:bg-blue-500 file:text-white file:border-0 file:rounded file:cursor-pointer"
                  />
                  {photoPreview && (
                    <div className="mt-3">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingId ? 'Salvar Alterações' : 'Criar Miniatura'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Clientes com Miniatura */}
        {showClientsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  👥 Clientes com {selectedMiniaturaForClients?.name}
                </h2>
                <button
                  onClick={() => setShowClientsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              {loadingClients ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
                </div>
              ) : clientsWithMiniatura.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Total: <strong>{clientsWithMiniatura.length}</strong> cliente(s) com esta miniatura
                  </p>
                  <div className="space-y-3">
                    {clientsWithMiniatura.map((client) => (
                      <div key={client.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {client.username}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          📧 {client.email}
                        </div>
                        {client.whatsapp && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            📱 {client.whatsapp}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {client.type === 'pre-sales' ? '📋 Pré-Venda' : '🚗 Garagem'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum cliente tem esta miniatura no catálogo
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowClientsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
