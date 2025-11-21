import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MiniaturaThumbnail } from '../components/MiniaturaThumbnail';
import { MiniaturaAutocomplete } from '../components/MiniaturaAutocomplete';
import DateInput from '../components/DateInput';

export function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [preSales, setPreSales] = useState([]);
  const [garage, setGarage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pre-sales');
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [preSalesRes, garageRes] = await Promise.all([
        api.get('/api/miniaturas/pre-sales', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/api/miniaturas/garage', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPreSales(preSalesRes.data);
      setGarage(garageRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMiniatura = async (e) => {
    e.preventDefault();
    if (user.role !== 'admin') {
      alert('❌ Apenas administradores podem adicionar miniaturas!');
      return;
    }
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'pre-sales' ? '/api/miniaturas/pre-sales' : '/api/miniaturas/garage';

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
      fetchData();
      alert('✅ Miniatura adicionada com sucesso!');
    } catch (err) {
      alert('❌ Erro ao adicionar miniatura: ' + (err.response?.data?.error || err.message));
      console.error('Erro:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'pre-sales' ? `/api/miniaturas/pre-sales/${id}` : `/api/miniaturas/garage/${id}`;

    try {
      await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('✅ Miniatura deletada!');
    } catch (err) {
      alert('❌ Erro ao deletar');
      console.error('Erro:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Carregando sua coleção...</p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'pre-sales' ? preSales : garage;
  const filteredData = currentData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = currentData.filter(item => item.status === 'completed').length;
  const pendingCount = currentData.filter(item => item.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com Estatísticas */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            🏎️ Minha Garagem
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Todas as suas reservas com EVS Minis
          </p>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Itens</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{currentData.length}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendentes</div>
              <div className="text-3xl font-bold text-yellow-500">{pendingCount}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Concluídos</div>
              <div className="text-3xl font-bold text-green-500">{completedCount}</div>
            </div>
          </div>
        </div>

        {/* Barra de Ações */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
          <input
            type="text"
            placeholder="🔍 Buscar miniatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => {
              setFormData({ name: '', description: '', deliveryDate: '', totalValue: '', paidValue: '', entranceDate: '', stock: '' });
              setSelectedMiniatura(null);
              setShowAddModal(true);
            }}
            className={`${
              user.role === 'admin'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
            } px-6 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
            disabled={user.role !== 'admin'}
            title={user.role !== 'admin' ? 'Apenas admins podem adicionar' : ''}
          >
            ➕ Adicionar
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300 dark:border-gray-700">
          <button
            onClick={() => { setActiveTab('pre-sales'); setSearchTerm(''); }}
            className={`px-6 py-3 font-bold border-b-4 transition-all ${
              activeTab === 'pre-sales'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            📋 Pré-Vendas ({preSales.length})
          </button>
          <button
            onClick={() => { setActiveTab('garage'); setSearchTerm(''); }}
            className={`px-6 py-3 font-bold border-b-4 transition-all ${
              activeTab === 'garage'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            🚗 Garagem ({garage.length})
          </button>
        </div>

        {/* Grid de miniaturas */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((miniatura) => (
              <MiniaturaThumbnail
                key={miniatura.id}
                miniatura={miniatura}
                onDelete={handleDelete}
                type={activeTab}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-6xl mb-4">
              {activeTab === 'pre-sales' ? '📋' : '🚗'}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">
              {searchTerm 
                ? 'Nenhuma miniatura encontrada com esse nome'
                : activeTab === 'pre-sales'
                ? 'Nenhuma pré-venda adicionada ainda'
                : 'Nenhuma miniatura na garagem ainda'}
            </p>
            {user.role === 'admin' && (
              <button
                onClick={() => {
                  setFormData({ name: '', brand: '', description: '', deliveryDate: '', totalValue: '', paidValue: '', entranceDate: '', stock: '', photoFile: null });
                  setSelectedMiniatura(null);
                  setShowAddModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                ➕ Adicionar Agora
              </button>
            )}
          </div>
        )}

        {/* Modal de adicionar */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                ➕ Adicionar {activeTab === 'pre-sales' ? 'Pré-Venda' : 'Miniatura'}
              </h2>

              <form onSubmit={handleAddMiniatura} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome da Miniatura *
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
                          setFormData({ ...formData, name: '', brand: '', description: '' });
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
                    placeholder="Ex: Escala 1:18, cor vermelha"
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

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    ✅ Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
  );
}
