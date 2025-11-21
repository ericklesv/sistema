import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MiniaturaAutocomplete } from '../components/MiniaturaAutocomplete';
import DateInput from '../components/DateInput';

export function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [preSales, setPreSales] = useState([]);
  const [garage, setGarage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pre-sales');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    deliveryDate: '',
    totalValue: '',
    paidValue: '',
    entranceDate: '',
    stock: '',
    photoFile: null
  });
  const [selectedMiniatura, setSelectedMiniatura] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    paidValue: '',
    situation: ''
  });
  const [newClientData, setNewClientData] = useState({
    username: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    setSelectedUser(userId);
    const token = localStorage.getItem('token');
    try {
      const [preSalesRes, garageRes] = await Promise.all([
        api.get(`/api/admin/users/${userId}/pre-sales`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get(`/api/admin/users/${userId}/garage`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPreSales(preSalesRes.data);
      setGarage(garageRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  const handleAddMiniatura = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'pre-sales'
      ? `/api/admin/users/${selectedUser}/pre-sales`
      : `/api/admin/users/${selectedUser}/garage`;

    try {
      let photoUrl = selectedMiniatura?.photoUrl || null;

      // Se não tem miniatura selecionada E tem foto, criar nova miniatura no banco
      if (!selectedMiniatura && formData.photoFile) {
        // Comprimir imagem antes de enviar
        const compressed = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 600;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(formData.photoFile);
        });

        photoUrl = compressed;

        // Criar miniatura no banco de dados
        const miniaturaData = {
          name: formData.name,
          brand: formData.brand || 'N/A',
          photoUrl: photoUrl
        };
        
        await api.post('/api/miniaturas-base', miniaturaData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const dataToSend = {
        name: formData.name,
        description: formData.description,
        photoUrl: photoUrl
      };

      if (activeTab === 'pre-sales') {
        dataToSend.deliveryDate = formData.deliveryDate;
        dataToSend.totalValue = parseFloat(formData.totalValue) || 0;
        dataToSend.paidValue = parseFloat(formData.paidValue) || parseFloat(formData.totalValue) || 0;
      } else {
        dataToSend.deliveryDate = formData.entranceDate;
        const stockValue = parseFloat(formData.stock) || 0;
        dataToSend.totalValue = stockValue;
        dataToSend.paidValue = parseFloat(formData.paidValue) || stockValue;
      }

      await api.post(endpoint, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', brand: '', description: '', deliveryDate: '', totalValue: '', paidValue: '', entranceDate: '', stock: '', photoFile: null });
      setSelectedMiniatura(null);
      setShowAddModal(false);
      await handleSelectUser(selectedUser);
    } catch (err) {
      console.error('Erro ao adicionar:', err);
      alert('❌ Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'pre-sales'
      ? `/api/admin/pre-sales/${id}`
      : `/api/admin/garage/${id}`;

    try {
      await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await handleSelectUser(selectedUser);
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    
    if (newClientData.password !== newClientData.confirmPassword) {
      alert('❌ As senhas não conferem!');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.post('/api/admin/users/create-client', {
        username: newClientData.username,
        email: newClientData.email,
        whatsapp: newClientData.whatsapp,
        password: newClientData.password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewClientData({ username: '', email: '', whatsapp: '', password: '', confirmPassword: '' });
      setShowAddClientModal(false);
      fetchUsers();
      alert('✅ Cliente adicionado com sucesso!');
    } catch (err) {
      alert('❌ Erro ao adicionar cliente: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    }
  };

  const handleEditMiniatura = (item) => {
    setEditingItem(item);
    setEditFormData({
      paidValue: item.paidValue,
      situation: item.situation || 'Esperando lançamento'
    });
    setShowEditModal(true);
  };

  const handleUpdateMiniatura = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      // Usar a rota correta baseada na aba ativa
      const endpoint = activeTab === 'pre-sales' 
        ? `/api/admin/pre-sales/${editingItem.id}`
        : `/api/admin/garage/${editingItem.id}`;
      
      await api.put(endpoint, {
        paidValue: parseFloat(editFormData.paidValue) || 0,
        situation: editFormData.situation,
        status: editingItem.status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowEditModal(false);
      await handleSelectUser(selectedUser);
      alert('✅ Miniatura atualizada com sucesso!');
    } catch (err) {
      alert('❌ Erro ao atualizar: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    }
  };

  const handleTransferToGarage = async (preSale) => {
    const confirmMessage = `
🚚 Enviar para Garagem

Miniatura: ${preSale.name}
Valor Total: R$ ${parseFloat(preSale.totalValue || 0).toFixed(2)}
Já Pago: R$ ${parseFloat(preSale.paidValue || 0).toFixed(2)}
Saldo: R$ ${(preSale.totalValue - preSale.paidValue).toFixed(2)}

Confirma a transferência para a garagem?
    `;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await api.post(`/api/admin/pre-sales/${preSale.id}/transfer-to-garage`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await handleSelectUser(selectedUser);
      alert('✅ Miniatura transferida para garagem com sucesso!');
    } catch (err) {
      alert('❌ Erro ao transferir: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  const currentData = activeTab === 'pre-sales' ? preSales : garage;

  // Filtrar usuários baseado na busca
  const filteredUsers = users.filter((u) => {
    const searchLower = searchClient.toLowerCase();
    return (
      u.username.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      (u.whatsapp && u.whatsapp.includes(searchClient))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔧 Painel Admin
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de usuários */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Clientes
              </h2>
              <button
                onClick={() => setShowAddClientModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold transition-colors"
                title="Adicionar novo cliente"
              >
                +
              </button>
            </div>
            
            {/* Campo de busca */}
            <input
              type="text"
              placeholder="🔍 Buscar por nome, email ou WhatsApp..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
            />
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedUser === u.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-sm font-semibold">{u.username}</div>
                    <div className="text-xs opacity-75">{u.email}</div>
                    {u.whatsapp && <div className="text-xs opacity-75">📱 {u.whatsapp}</div>}
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            {selectedUser ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Miniaturas do Cliente
                  </h2>
                  <button
                    onClick={() => {
                      setFormData({ name: '', description: '', deliveryDate: '', totalValue: '', paidValue: '', entranceDate: '', stock: '' });
                      setSelectedMiniatura(null);
                      setShowAddModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    + Adicionar
                  </button>
                </div>

                {/* Abas */}
                <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('pre-sales')}
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                      activeTab === 'pre-sales'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    📋 Pré-Vendas ({preSales.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('garage')}
                    className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                      activeTab === 'garage'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    🚗 Garagem ({garage.length})
                  </button>
                </div>

                {/* Tabela de miniaturas */}
                {currentData.length > 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Adicionado
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Entrega
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Saldo
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentData.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(item.addedDate).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {item.deliveryDate
                                ? new Date(item.deliveryDate).toLocaleDateString('pt-BR')
                                : 'Sem data'}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                              R$ {parseFloat(item.totalValue || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold">
                              <span className={
                                (item.totalValue - item.paidValue) > 0
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-green-600 dark:text-green-400'
                              }>
                                R$ {(item.totalValue - item.paidValue).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  item.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                }`}
                              >
                                {item.status === 'completed' ? 'Concluído' : 'Pendente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleEditMiniatura(item)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold mr-4"
                              >
                                Editar
                              </button>
                              {activeTab === 'pre-sales' && (
                                <button
                                  onClick={() => handleTransferToGarage(item)}
                                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-semibold mr-4"
                                  title="Enviar para Garagem"
                                >
                                  🚚 Enviar
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-semibold"
                              >
                                Deletar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma miniatura adicionada
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Selecione um cliente para ver suas miniaturas
                </p>
              </div>
            )}

            {/* Modal de adicionar miniatura */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Adicionar {activeTab === 'pre-sales' ? 'Pré-Venda' : 'Miniatura'}
                  </h2>

                  <form onSubmit={handleAddMiniatura} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome
                      </label>
                      {selectedMiniatura && (
                        <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
                          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            ✅ Selecionada: {selectedMiniatura.name}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            {selectedMiniatura.brand} • Código: {selectedMiniatura.code}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMiniatura(null);
                              setFormData({ ...formData, name: '', description: '' });
                            }}
                            className="text-xs text-blue-600 dark:text-blue-300 hover:underline mt-2"
                          >
                            Desselecionar
                          </button>
                        </div>
                      )}
                      <MiniaturaAutocomplete
                        value={formData.name}
                        onChange={(value) => setFormData({ ...formData, name: value })}
                        onSelectMiniatura={(miniatura) => {
                          setSelectedMiniatura(miniatura);
                          setFormData({
                            ...formData,
                            name: miniatura.name,
                            brand: miniatura.brand || '',
                            description: miniatura.brand || formData.description
                          });
                        }}
                        placeholder="Pesquisar miniatura no banco de dados..."
                      />
                    </div>

                    {/* Marca - apenas se não tiver miniatura selecionada */}
                    {!selectedMiniatura && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Marca da Miniatura
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Hot Wheels, Matchbox, Tomica..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    {/* Foto - apenas se não tiver miniatura selecionada */}
                    {!selectedMiniatura && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Foto da Miniatura (Opcional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, photoFile: e.target.files[0] })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.photoFile && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            ✓ Foto selecionada: {formData.photoFile.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Se adicionar uma foto, a miniatura será salva no banco de dados
                        </p>
                      </div>
                    )}

                    <div>
                      {activeTab === 'pre-sales' ? (
                        <DateInput
                          label="Data de Entrega"
                          value={formData.deliveryDate}
                          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                          placeholder="DD/MM/AAAA"
                        />
                      ) : (
                        <DateInput
                          label="Data de Entrada"
                          value={formData.entranceDate}
                          onChange={(e) => setFormData({ ...formData, entranceDate: e.target.value })}
                          placeholder="DD/MM/AAAA"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {activeTab === 'pre-sales' ? 'Valor da Miniatura (R$)' : 'ESTOQUE'}
                        </label>
                        <input
                          type={activeTab === 'pre-sales' ? 'number' : 'text'}
                          step="0.01"
                          value={activeTab === 'pre-sales' ? formData.totalValue : formData.stock}
                          onChange={(e) => setFormData(activeTab === 'pre-sales'
                            ? { ...formData, totalValue: e.target.value }
                            : { ...formData, stock: e.target.value }
                          )}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={activeTab === 'pre-sales' ? '0.00' : 'Ex: Prateleira A1'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {activeTab === 'pre-sales' ? 'Valor Pago (R$)' : 'VALOR EM ABERTO'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.paidValue}
                          onChange={(e) => setFormData({ ...formData, paidValue: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de adicionar cliente */}
            {showAddClientModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    ➕ Novo Cliente
                  </h2>

                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome de Usuário *
                      </label>
                      <input
                        type="text"
                        value={newClientData.username}
                        onChange={(e) => setNewClientData({ ...newClientData, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Ex: cliente1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newClientData.email}
                        onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Ex: cliente@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={newClientData.whatsapp}
                        onChange={(e) => setNewClientData({ ...newClientData, whatsapp: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: (11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Senha *
                      </label>
                      <input
                        type="password"
                        value={newClientData.password}
                        onChange={(e) => setNewClientData({ ...newClientData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        value={newClientData.confirmPassword}
                        onChange={(e) => setNewClientData({ ...newClientData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Repita a senha"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
                      >
                        Criar Cliente
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddClientModal(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Editar Miniatura */}
            {showEditModal && editingItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    ✏️ Editar {editingItem.name}
                  </h2>

                  <form onSubmit={handleUpdateMiniatura} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Valor Pago (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.paidValue}
                        onChange={(e) => setEditFormData({ ...editFormData, paidValue: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    {activeTab === 'pre-sales' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Situação da Miniatura
                        </label>
                        <select
                          value={editFormData.situation}
                          onChange={(e) => setEditFormData({ ...editFormData, situation: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Esperando lançamento">Esperando lançamento</option>
                          <option value="Na garagem dos EUA">Na garagem dos EUA</option>
                          <option value="Enviada para o Brasil">Enviada para o Brasil</option>
                          <option value="Esperando pagamento">Esperando pagamento</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md"
                      >
                        💾 Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-lg transition-colors"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
