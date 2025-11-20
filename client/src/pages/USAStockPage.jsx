import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MiniaturaAutocomplete } from '../components/MiniaturaAutocomplete';

export function USAStockPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stock');
  const [stockItems, setStockItems] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAddShipmentModal, setShowAddShipmentModal] = useState(false);
  const [showSelectShipmentModal, setShowSelectShipmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '1',
    price: '',
    weight: '',
    notes: ''
  });
  const [shipmentForm, setShipmentForm] = useState({
    shippingDate: '',
    shippingCost: '',
    taxCost: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [selectedStockItem, setSelectedStockItem] = useState(null);

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
      const [stockRes, shipmentsRes] = await Promise.all([
        axios.get('/api/admin/usa-stock', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/shipments', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStockItems(stockRes.data);
      setShipments(shipmentsRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShipmentInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({ ...prev, [name]: value }));
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
        weight: formData.weight ? parseFloat(formData.weight) : null,
        notes: formData.notes || null
      };

      if (editingId) {
        await axios.put(`/api/admin/usa-stock/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Item atualizado com sucesso!');
      } else {
        await axios.post('/api/admin/usa-stock', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Item adicionado com sucesso!');
      }

      resetFormStock();
      setShowAddStockModal(false);
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar item:', err);
      alert('❌ Erro ao salvar item: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmitShipment = async (e) => {
    e.preventDefault();

    if (!shipmentForm.shippingDate) {
      alert('Data de envio é obrigatória');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const dataToSend = {
        shippingDate: shipmentForm.shippingDate,
        shippingCost: parseFloat(shipmentForm.shippingCost) || 0,
        taxCost: parseFloat(shipmentForm.taxCost) || 0
      };

      await axios.post('/api/admin/shipments', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Envio criado com sucesso!');

      resetFormShipment();
      setShowAddShipmentModal(false);
      fetchData();
    } catch (err) {
      console.error('Erro ao criar envio:', err);
      alert('❌ Erro ao criar envio: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEditStock = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      brand: item.brand || '',
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      weight: item.weight ? item.weight.toString() : '',
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
      await axios.delete(`/api/admin/usa-stock/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStockItems(stockItems.filter(item => item.id !== id));
      alert('✅ Item deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('❌ Erro ao deletar item');
    }
  };

  const handleDeleteShipment = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este envio? Os itens voltarão ao estoque disponível.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/shipments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipments(shipments.filter(shipment => shipment.id !== id));
      alert('✅ Envio deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('❌ Erro ao deletar envio');
    }
  };

  const handleAddToShipment = async (shipmentId) => {
    if (!selectedStockItem) {
      alert('Selecione um item primeiro');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/admin/shipments/${shipmentId}/items`, 
        { stockItemId: selectedStockItem.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Item adicionado ao envio!');
      setShowSelectShipmentModal(false);
      fetchData();
    } catch (err) {
      console.error('Erro ao adicionar item ao envio:', err);
      alert('❌ Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRemoveFromShipment = async (shipmentId, itemId) => {
    if (!window.confirm('Remover este item do envio?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/shipments/${shipmentId}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Item removido do envio!');
      fetchData();
    } catch (err) {
      console.error('Erro ao remover item:', err);
      alert('❌ Erro ao remover item');
    }
  };

  const resetFormStock = () => {
    setFormData({
      name: '',
      brand: '',
      quantity: '1',
      price: '',
      weight: '',
      notes: ''
    });
    setEditingId(null);
    setSearchInput('');
    setSelectedMiniatura(null);
  };

  const resetFormShipment = () => {
    setShipmentForm({
      shippingDate: '',
      shippingCost: '',
      taxCost: ''
    });
  };

  const filteredStockItems = stockItems.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    !item.shipmentId
  );

  const unshippedItems = stockItems.filter(item => !item.shipmentId);
  const totalItems = unshippedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = unshippedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWeight = unshippedItems.reduce((sum, item) => sum + (item.weight || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚚 Estoque USA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Gerencie seu inventário de miniaturas nos EUA
        </p>

        {/* Abas */}
        <div className="flex border-b border-gray-300 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-6 py-3 font-semibold border-b-4 transition-colors ${
              activeTab === 'stock'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📦 Estoque
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-6 py-3 font-semibold border-b-4 transition-colors ${
              activeTab === 'shipments'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ✈️ Envios
          </button>
        </div>

        {/* ABA ESTOQUE */}
        {activeTab === 'stock' && (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Itens Disponíveis</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalItems}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">Valor Total Disponível</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">R$ {totalValue.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">Peso Total Disponível</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalWeight.toFixed(2)} kg</div>
              </div>
            </div>

            {/* Barra de ações */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
              <input
                type="text"
                placeholder="🔍 Buscar por nome ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => {
                  resetFormStock();
                  setShowAddStockModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                ➕ Adicionar Item
              </button>
            </div>

            {/* Tabela de estoque */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {filteredStockItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Nome</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Marca</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Qtd</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Preço Un.</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Peso (kg)</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredStockItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.brand || '-'}</td>
                          <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">R$ {item.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-600 dark:text-gray-400">{item.weight ? item.weight.toFixed(2) : '-'}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <button
                              onClick={() => {
                                setSelectedStockItem(item);
                                setShowSelectShipmentModal(true);
                              }}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold mr-2"
                              title="Enviar"
                            >
                              ✈️
                            </button>
                            <button
                              onClick={() => handleEditStock(item)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold mr-2"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteStock(item.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Nenhum item disponível no estoque</p>
                  <button
                    onClick={() => {
                      resetFormStock();
                      setShowAddStockModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    ➕ Adicionar Primeiro Item
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ABA ENVIOS */}
        {activeTab === 'shipments' && (
          <>
            {/* Botão para criar envio */}
            <div className="mb-6">
              <button
                onClick={() => {
                  resetFormShipment();
                  setShowAddShipmentModal(true);
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                ✈️ Criar Novo Envio
              </button>
            </div>

            {/* Lista de envios */}
            <div className="space-y-6">
              {shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <div key={shipment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {/* Cabeçalho do envio */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            Envio de {new Date(shipment.shippingDate).toLocaleDateString('pt-BR')}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
                            <div>
                              <span className="opacity-80">Total de Itens:</span>
                              <div className="font-bold text-lg">{shipment.totalItems}</div>
                            </div>
                            <div>
                              <span className="opacity-80">Valor da Carga:</span>
                              <div className="font-bold text-lg">R$ {shipment.totalStockValue.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="opacity-80">Frete:</span>
                              <div className="font-bold text-lg">R$ {shipment.shippingCost.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="opacity-80">Impostos:</span>
                              <div className="font-bold text-lg">R$ {shipment.taxCost.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteShipment(shipment.id)}
                          className="text-red-200 hover:text-red-100 text-2xl transition-colors"
                          title="Deletar envio"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Lista de itens do envio */}
                    <div className="p-6">
                      {shipment.items.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Nome</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Marca</th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-white">Qtd</th>
                                <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">Preço Un.</th>
                                <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">Peso</th>
                                <th className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-white">Ação</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {shipment.items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-2 text-gray-900 dark:text-white">{item.name}</td>
                                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{item.brand || '-'}</td>
                                  <td className="px-4 py-2 text-center text-gray-900 dark:text-white">{item.quantity}</td>
                                  <td className="px-4 py-2 text-right text-gray-900 dark:text-white">R$ {item.price.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">{item.weight ? item.weight.toFixed(2) + ' kg' : '-'}</td>
                                  <td className="px-4 py-2 text-center">
                                    <button
                                      onClick={() => handleRemoveFromShipment(shipment.id, item.id)}
                                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold"
                                      title="Remover do envio"
                                    >
                                      ❌
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum item neste envio</p>
                      )}
                    </div>

                    {/* Resumo do envio */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Peso Total:</span>
                          <div className="font-bold text-gray-900 dark:text-white">{shipment.totalWeight.toFixed(2)} kg</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Valor Frete + Imposto:</span>
                          <div className="font-bold text-gray-900 dark:text-white">R$ {shipment.totalCost.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Valor Total do Envio:</span>
                          <div className="font-bold text-green-600 dark:text-green-400">
                            R$ {(shipment.totalStockValue + shipment.totalCost).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Nenhum envio criado ainda</p>
                  <button
                    onClick={() => {
                      resetFormShipment();
                      setShowAddShipmentModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    ✈️ Criar Primeiro Envio
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* MODAL ADICIONAR ITEM AO ESTOQUE */}
        {showAddStockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {editingId ? '✏️ Editar Item' : '➕ Adicionar Item'}
              </h2>

              <form onSubmit={handleSubmitStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Miniatura *
                  </label>
                  <MiniaturaAutocomplete
                    value={searchInput}
                    onChange={handleMiniaturasearch}
                    onSelectMiniatura={handleSelectMiniatura}
                    placeholder="Buscar miniatura por código, nome ou marca..."
                  />
                  {selectedMiniatura && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Selecionada:</strong> {selectedMiniatura.name} ({selectedMiniatura.code})
                      </p>
                    </div>
                  )}
                </div>

                <input
                  type="hidden"
                  name="name"
                  value={formData.name}
                />
                <input
                  type="hidden"
                  name="brand"
                  value={formData.brand}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notas
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qualquer observação importante..."
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
                  >
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStockModal(false);
                      resetFormStock();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CRIAR ENVIO */}
        {showAddShipmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                ✈️ Criar Novo Envio
              </h2>

              <form onSubmit={handleSubmitShipment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Data de Envio *
                  </label>
                  <input
                    type="date"
                    name="shippingDate"
                    value={shipmentForm.shippingDate}
                    onChange={handleShipmentInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Valor do Frete (R$)
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    step="0.01"
                    value={shipmentForm.shippingCost}
                    onChange={handleShipmentInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Valor do Imposto (R$)
                  </label>
                  <input
                    type="number"
                    name="taxCost"
                    step="0.01"
                    value={shipmentForm.taxCost}
                    onChange={handleShipmentInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
                  >
                    Criar Envio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddShipmentModal(false);
                      resetFormShipment();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL SELECIONAR ENVIO */}
        {showSelectShipmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                ✈️ Selecionar Envio
              </h2>

              {selectedStockItem && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Item:</strong> {selectedStockItem.name}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Quantidade:</strong> {selectedStockItem.quantity}
                  </p>
                </div>
              )}

              {shipments.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {shipments.map((shipment) => (
                    <button
                      key={shipment.id}
                      onClick={() => handleAddToShipment(shipment.id)}
                      className="w-full p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-left transition-colors text-gray-900 dark:text-white"
                    >
                      <div className="font-semibold">📅 {new Date(shipment.shippingDate).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {shipment.totalItems} itens • Frete: R$ {shipment.shippingCost.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum envio disponível</p>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowSelectShipmentModal(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
