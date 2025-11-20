import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MiniaturaAutocomplete } from '../components/MiniaturaAutocomplete';

export function ReadyStockPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showSendToGarageModal, setShowSendToGarageModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '1',
    price: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearchInput, setClientSearchInput] = useState('');

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
      console.log('🔄 Buscando dados...');
      const [stockRes, clientsRes] = await Promise.all([
        api.get('/api/admin/ready-stock', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/admin/clients', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      console.log('✅ Dados obtidos - Itens de estoque:', stockRes.data.length);
      setStockItems(stockRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMiniaturasearch = (newValue) => {
    setSearchInput(newValue);
  };

  const handleSelectMiniatura = (miniatura) => {
    setSelectedMiniatura(miniatura);
    setFormData(prev => ({
      ...prev,
      name: miniatura.name,
      brand: miniatura.brand || ''
    }));
    setSearchInput('');
  };

  const handleSubmitStock = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const dataToSend = {
        miniaturaBaseId: selectedMiniatura?.id || null,
        name: formData.name,
        brand: formData.brand || null,
        quantity: parseInt(formData.quantity) || 1,
        price: parseFloat(formData.price) || 0,
        notes: formData.notes || null
      };

      console.log('📤 Enviando dados:', dataToSend);

      if (editingId) {
        await api.put(`/api/admin/ready-stock/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Item atualizado com sucesso!');
      } else {
        const response = await api.post('/api/admin/ready-stock', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Resposta do servidor:', response.data);
        alert('✅ Item adicionado com sucesso!');
      }

      resetFormStock();
      setShowAddStockModal(false);
      
      // Pequeno delay para garantir que os dados foram salvos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      fetchData();
    } catch (err) {
      console.error('❌ Erro ao salvar item:', err);
      console.error('📋 Detalhes:', err.response?.data);
      alert('❌ Erro ao salvar item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSendToGarage = async () => {
    if (!selectedClient) {
      alert('Selecione um cliente');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.post(
        '/api/admin/ready-stock/send-to-garage',
        {
          readyStockId: selectedStockItem.id,
          userId: selectedClient.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ ${selectedStockItem.name} enviado para garagem de ${selectedClient.username}!`);
      setShowSendToGarageModal(false);
      setSelectedClient(null);
      setSelectedStockItem(null);
      fetchData();
    } catch (err) {
      console.error('Erro ao enviar para garagem:', err);
      alert('❌ Erro ao enviar: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEditStock = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      brand: item.brand || '',
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      notes: item.notes || ''
    });
    setShowAddStockModal(true);
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/admin/ready-stock/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStockItems(stockItems.filter(item => item.id !== id));
      alert('✅ Item deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('❌ Erro ao deletar item');
    }
  };

  const resetFormStock = () => {
    setFormData({
      name: '',
      brand: '',
      quantity: '1',
      price: '',
      notes: ''
    });
    setEditingId(null);
    setSelectedMiniatura(null);
    setSearchInput('');
  };

  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredClients = clients.filter(client =>
    client.username.toLowerCase().includes(selectedClient?.username?.toLowerCase() || '') ||
    client.email.toLowerCase().includes(selectedClient?.email?.toLowerCase() || '')
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            📦 Estoque à Pronta Entrega
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Miniaturas disponíveis para entrega imediata
          </p>

          {/* Botões de Ação */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                resetFormStock();
                setShowAddStockModal(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <span>➕</span> Adicionar Item
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Pesquisar por nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Tabela de Estoque */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {filteredStockItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xl mb-2">📭 Nenhum item no estoque</p>
              <p>Clique em "Adicionar Item" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Foto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Marca</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Qtd</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Preço</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        {item.miniatura?.photoUrl ? (
                          <img
                            src={item.miniatura.photoUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-2xl">📦</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.brand || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                        R$ {item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedStockItem(item);
                              setShowSendToGarageModal(true);
                            }}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-semibold transition-colors"
                            title="Enviar para garagem do cliente"
                          >
                            📤 Enviar
                          </button>
                          <button
                            onClick={() => handleEditStock(item)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm font-semibold transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteStock(item.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors"
                          >
                            🗑️ Deletar
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
      </div>

      {/* Modal - Adicionar/Editar Item */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? '✏️ Editar Item' : '➕ Adicionar Item'}
              </h2>
            </div>

            <form onSubmit={handleSubmitStock} className="p-6 space-y-4">
              {/* Campo de Autocomplete */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Selecionar Miniatura (Opcional)
                </label>
                <MiniaturaAutocomplete
                  value={searchInput}
                  onChange={handleMiniaturasearch}
                  onSelectMiniatura={handleSelectMiniatura}
                />
                {selectedMiniatura && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ <strong>Miniatura selecionada:</strong> {selectedMiniatura.name} ({selectedMiniatura.brand})
                    </p>
                  </div>
                )}
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Ferrari F40"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: Bburago"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Quantidade e Preço */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Adicione observações sobre o item..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {editingId ? '✅ Atualizar' : '✅ Adicionar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStockModal(false);
                    resetFormStock();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Enviar para Garagem */}
      {showSendToGarageModal && selectedStockItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                📤 Enviar para Garagem
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>Miniatura:</strong> {selectedStockItem.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Preço:</strong> R$ {selectedStockItem.price.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pesquisar Cliente *
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome ou email do cliente..."
                  value={clientSearchInput}
                  onChange={(e) => setClientSearchInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                
                {clientSearchInput.trim().length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    {clients
                      .filter(c =>
                        c.username.toLowerCase().includes(clientSearchInput.toLowerCase()) ||
                        c.email.toLowerCase().includes(clientSearchInput.toLowerCase())
                      )
                      .map(client => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(client);
                            setClientSearchInput('');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 transition border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {client.username}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {client.email}
                          </div>
                        </button>
                      ))}
                    
                    {clients.filter(c =>
                      c.username.toLowerCase().includes(clientSearchInput.toLowerCase()) ||
                      c.email.toLowerCase().includes(clientSearchInput.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        Nenhum cliente encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedClient && (
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ✅ Será enviado para a garagem de <strong>{selectedClient.username}</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendToGarage}
                  disabled={!selectedClient}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  ✅ Enviar
                </button>
                <button
                  onClick={() => {
                    setShowSendToGarageModal(false);
                    setSelectedStockItem(null);
                    setSelectedClient(null);
                    setClientSearchInput('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
