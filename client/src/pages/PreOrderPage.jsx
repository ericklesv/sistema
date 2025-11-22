import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export function PreOrderPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [preOrders, setPreOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendToClientModal, setShowSendToClientModal] = useState(false);
  const [selectedPreOrder, setSelectedPreOrder] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sendFormData, setSendFormData] = useState({
    totalValue: '',
    paidValue: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    brand: '',
    photoUrl: ''
  });
  const [quantityFormData, setQuantityFormData] = useState({
    stockQuantity: 0,
    releaseDate: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    brand: '',
    photoUrl: '',
    stockQuantity: 0,
    releaseDate: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [miniaturasRes, clientsRes] = await Promise.all([
        api.get('/api/miniaturas-base', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/admin/clients', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      // Filtrar apenas as pré-vendas
      const preOrderItems = miniaturasRes.data.filter(m => m.isPreOrder === true);
      console.log('📋 Pré-vendas encontradas:', preOrderItems.length);
      setPreOrders(preOrderItems);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      console.error('📋 Detalhes:', err.response?.data);
      alert('Erro ao carregar pré-vendas: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleShowSendModal = (preOrder) => {
    if ((preOrder.stockQuantity || 0) <= 0) {
      alert('⚠️ Esta pré-venda não tem estoque disponível');
      return;
    }
    setSelectedPreOrder(preOrder);
    setSelectedClient(null);
    setClientSearchTerm('');
    setSendFormData({ totalValue: '', paidValue: '' });
    setShowSendToClientModal(true);
  };

  const filteredClients = clients.filter(client => {
    if (!clientSearchTerm) return true;
    const search = clientSearchTerm.toLowerCase();
    return (
      client.username?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.phone?.toLowerCase().includes(search)
    );
  });

  const handleSelectClient = (client) => {
    setSelectedClient(client.id);
    setClientSearchTerm(`${client.username} (${client.email})`);
    setShowClientSuggestions(false);
  };

  const handleShowEditModal = (preOrder) => {
    setSelectedPreOrder(preOrder);
    setEditFormData({
      name: preOrder.name,
      brand: preOrder.brand,
      photoUrl: preOrder.photoUrl || ''
    });
    setShowEditModal(true);
  };

  const handleShowQuantityModal = (preOrder) => {
    setSelectedPreOrder(preOrder);
    setQuantityFormData({
      stockQuantity: preOrder.stockQuantity || 0,
      releaseDate: preOrder.releaseDate ? new Date(preOrder.releaseDate).toISOString().split('T')[0] : '',
      preOrderType: preOrder.preOrderType || ''
    });
    setShowQuantityModal(true);
  };

  const handleEditMiniatura = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await api.put(
        `/api/miniaturas-base/${selectedPreOrder.id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreOrders(prev => prev.map(p => 
        p.id === selectedPreOrder.id ? { ...p, ...response.data } : p
      ));

      setShowEditModal(false);
      alert('✅ Miniatura atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      alert('❌ ' + (err.response?.data?.error || 'Erro ao atualizar miniatura'));
    }
  };

  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await api.put(
        `/api/miniaturas-base/${selectedPreOrder.id}/status`,
        {
          isPreOrder: true,
          releaseDate: quantityFormData.releaseDate || null,
          stockQuantity: parseInt(quantityFormData.stockQuantity) || 0,
          preOrderType: quantityFormData.preOrderType || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreOrders(prev => prev.map(p => 
        p.id === selectedPreOrder.id ? { ...p, ...response.data } : p
      ));

      setShowQuantityModal(false);
      alert('✅ Quantidade atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      alert('❌ ' + (err.response?.data?.error || 'Erro ao atualizar quantidade'));
    }
  };

  const handleShowAddModal = () => {
    setAddFormData({
      name: '',
      brand: '',
      photoUrl: '',
      stockQuantity: 0,
      releaseDate: '',
      preOrderType: ''
    });
    setShowAddModal(true);
  };

  const handleCreateMiniatura = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!addFormData.name || !addFormData.brand) {
      alert('⚠️ Nome e marca são obrigatórios');
      return;
    }
    
    try {
      // Criar a miniatura
      const createResponse = await api.post(
        '/api/miniaturas-base',
        {
          name: addFormData.name,
          brand: addFormData.brand,
          photoUrl: addFormData.photoUrl || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Miniatura criada:', createResponse.data);

      // Atualizar para pré-venda com quantidade
      const updateResponse = await api.put(
        `/api/miniaturas-base/${createResponse.data.id}/status`,
        {
          isPreOrder: true,
          releaseDate: addFormData.releaseDate || null,
          stockQuantity: parseInt(addFormData.stockQuantity) || 0,
          preOrderType: addFormData.preOrderType || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Status atualizado:', updateResponse.data);

      // Adicionar na lista
      setPreOrders(prev => [...prev, updateResponse.data]);

      setShowAddModal(false);
      alert(`✅ Pré-venda criada com sucesso!\n🏷️ Código: ${createResponse.data.code}`);
    } catch (err) {
      console.error('❌ Erro ao criar:', err);
      console.error('📋 Detalhes:', err.response?.data);
      alert('❌ ' + (err.response?.data?.error || 'Erro ao criar pré-venda'));
    }
  };

  const handleSendToClient = async (e) => {
    e.preventDefault();
    
    if (!selectedClient) {
      alert('⚠️ Selecione um cliente');
      return;
    }

    if (!sendFormData.totalValue || parseFloat(sendFormData.totalValue) <= 0) {
      alert('⚠️ Informe o valor total');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await api.post(
        `/api/miniaturas-base/${selectedPreOrder.id}/add-to-client`,
        {
          userId: selectedClient,
          totalValue: sendFormData.totalValue,
          paidValue: sendFormData.paidValue || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualizar estoque localmente
      setPreOrders(prev => prev.map(p => 
        p.id === selectedPreOrder.id 
          ? { ...p, stockQuantity: response.data.newStockQuantity }
          : p
      ));

      setShowSendToClientModal(false);
      alert(`✅ Pré-venda adicionada ao cliente!\n📦 Estoque restante: ${response.data.newStockQuantity}`);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('❌ ' + (err.response?.data?.error || 'Erro ao enviar pré-venda ao cliente'));
    }
  };

  const filteredPreOrders = preOrders.filter(p => 
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📋 Pré-Vendas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerenciar miniaturas em pré-venda e enviar para clientes
            </p>
          </div>
          <button
            onClick={handleShowAddModal}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            ➕ Nova Miniatura
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Pesquisar por código, nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Tabela de Pré-Vendas */}
        <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden">
          {filteredPreOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">Nenhuma pré-venda cadastrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-100 dark:bg-yellow-900 border-b border-gray-200 dark:border-slate-500">
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
                      🏷️ Tipo
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                      📦 Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Data Lançamento
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
                  {filteredPreOrders.map((preOrder, index) => (
                    <tr
                      key={preOrder.id}
                      className={`border-b border-gray-200 dark:border-slate-600 ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-slate-700'
                          : 'bg-gray-50 dark:bg-slate-600/50'
                      } hover:bg-yellow-50 dark:hover:bg-slate-600/70 transition`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-mono font-bold">
                          {preOrder.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {preOrder.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {preOrder.brand}
                      </td>
                      <td className="px-6 py-4">
                        {preOrder.preOrderType ? (
                          <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-800 dark:text-purple-200 rounded text-xs font-semibold">
                            {preOrder.preOrderType}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          (preOrder.stockQuantity || 0) > 0
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          {preOrder.stockQuantity || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-sm">
                        {preOrder.releaseDate 
                          ? new Date(preOrder.releaseDate).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4">
                        {preOrder.photoUrl ? (
                          <img
                            src={preOrder.photoUrl}
                            alt={preOrder.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleShowEditModal(preOrder)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition text-sm"
                            title="Editar miniatura"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleShowQuantityModal(preOrder)}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition text-sm"
                            title="Editar quantidade"
                          >
                            📦
                          </button>
                          <button
                            onClick={() => handleShowSendModal(preOrder)}
                            disabled={(preOrder.stockQuantity || 0) <= 0}
                            className={`px-3 py-1 rounded transition text-sm ${
                              (preOrder.stockQuantity || 0) > 0
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                            title={(preOrder.stockQuantity || 0) > 0 ? "Enviar para cliente" : "Sem estoque"}
                          >
                            📤 Enviar
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

        {/* Modal de Criar Nova Miniatura */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ➕ Nova Pré-Venda
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateMiniatura}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="Ex: Ford Puma Rally1 #16"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={addFormData.brand}
                      onChange={(e) => setAddFormData({ ...addFormData, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="Ex: MINI GT"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL da Foto
                    </label>
                    <input
                      type="url"
                      value={addFormData.photoUrl}
                      onChange={(e) => setAddFormData({ ...addFormData, photoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🏷️ Tipo de Pré-Venda *
                    </label>
                    <select
                      value={addFormData.preOrderType}
                      onChange={(e) => setAddFormData({ ...addFormData, preOrderType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="PRÉ VENDA EUA">PRÉ VENDA EUA</option>
                      <option value="PRÉ VENDA MINI GT">PRÉ VENDA MINI GT</option>
                      <option value="PRÉ VENDA TARMAC">PRÉ VENDA TARMAC</option>
                      <option value="PRÉ VENDA MATTEL CREATIONS">PRÉ VENDA MATTEL CREATIONS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📦 Quantidade em Estoque
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addFormData.stockQuantity}
                      onChange={(e) => setAddFormData({ ...addFormData, stockQuantity: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📅 Data de Lançamento
                    </label>
                    <input
                      type="date"
                      value={addFormData.releaseDate}
                      onChange={(e) => setAddFormData({ ...addFormData, releaseDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                  >
                    ➕ Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Editar Miniatura */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ✏️ Editar Miniatura
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditMiniatura}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL da Foto
                    </label>
                    <input
                      type="url"
                      value={editFormData.photoUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, photoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Editar Quantidade */}
        {showQuantityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📦 Editar Quantidade
                </h2>
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{selectedPreOrder?.name}</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedPreOrder?.brand} • Código: {selectedPreOrder?.code}
                </p>
              </div>

              <form onSubmit={handleUpdateQuantity}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🏷️ Tipo de Pré-Venda *
                    </label>
                    <select
                      value={quantityFormData.preOrderType}
                      onChange={(e) => setQuantityFormData({ ...quantityFormData, preOrderType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="PRÉ VENDA EUA">PRÉ VENDA EUA</option>
                      <option value="PRÉ VENDA MINI GT">PRÉ VENDA MINI GT</option>
                      <option value="PRÉ VENDA TARMAC">PRÉ VENDA TARMAC</option>
                      <option value="PRÉ VENDA MATTEL CREATIONS">PRÉ VENDA MATTEL CREATIONS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📦 Quantidade em Estoque *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantityFormData.stockQuantity}
                      onChange={(e) => setQuantityFormData({ ...quantityFormData, stockQuantity: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Lançamento
                    </label>
                    <input
                      type="date"
                      value={quantityFormData.releaseDate}
                      onChange={(e) => setQuantityFormData({ ...quantityFormData, releaseDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowQuantityModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Enviar para Cliente */}
        {showSendToClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📤 Enviar para Cliente
                </h2>
                <button
                  onClick={() => setShowSendToClientModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{selectedPreOrder?.name}</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedPreOrder?.brand} • Código: {selectedPreOrder?.code}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  📦 Estoque: {selectedPreOrder?.stockQuantity || 0}
                </p>
              </div>

              <form onSubmit={handleSendToClient}>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cliente * (busque por nome, email ou celular)
                    </label>
                    <input
                      type="text"
                      value={clientSearchTerm}
                      onChange={(e) => {
                        setClientSearchTerm(e.target.value);
                        setShowClientSuggestions(true);
                        if (!e.target.value) setSelectedClient(null);
                      }}
                      onFocus={() => setShowClientSuggestions(true)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Digite para buscar..."
                      required
                    />
                    {showClientSuggestions && filteredClients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredClients.map(client => (
                          <div
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            className="px-3 py-2 hover:bg-green-50 dark:hover:bg-slate-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {client.username}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              📧 {client.email}
                            </div>
                            {client.phone && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                📱 {client.phone}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Total (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sendFormData.totalValue}
                      onChange={(e) => setSendFormData({ ...sendFormData, totalValue: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Pago (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sendFormData.paidValue}
                      onChange={(e) => setSendFormData({ ...sendFormData, paidValue: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowSendToClientModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    📤 Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
