import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function MiniaturaThumbnail({ miniatura, onDelete, type }) {
  const { user } = useContext(AuthContext);
  const isGarage = type === 'garage';
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysUntilDelivery = (deliveryDate) => {
    if (!deliveryDate) return null;
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDelivery(miniatura.deliveryDate);
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border-t-4 border-blue-600 dark:border-blue-500">
      {/* Imagem/Placeholder */}
      <div className="mb-3 h-40 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
        {miniatura.photoUrl ? (
          <img 
            src={miniatura.photoUrl} 
            alt={miniatura.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">🏎️</span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Nome */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 truncate text-lg h-6">
          {miniatura.name}
        </h3>

        {/* Descrição */}
        {miniatura.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
            {miniatura.description}
          </p>
        )}

        {/* Informações */}
        <div className="space-y-2 mb-4 text-xs">
          {/* Data de Adição */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📅</span>
            <span>Adicionado: <strong>{formatDate(miniatura.addedDate)}</strong></span>
          </div>

          {/* Data de Entrega / Data de Entrada */}
          <div className={`flex items-center gap-2 p-2 rounded ${
            isOverdue 
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' 
              : isUrgent
              ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200'
              : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
          }`}>
            <span>📦</span>
            <div>
              <div>{isGarage ? 'Entrada' : 'Entrega'}: <strong>{formatDate(miniatura.deliveryDate)}</strong></div>
              {daysLeft !== null && !isGarage && (
                <div className="text-xs mt-1">
                  {isOverdue 
                    ? `⚠️ ${Math.abs(daysLeft)} dias atrasado` 
                    : `${daysLeft} dias restantes`}
                </div>
              )}
            </div>
          </div>

          {/* Valores - Diferentes para Garagem e Pré-Vendas */}
          {isGarage ? (
            <div className="bg-purple-50 dark:bg-purple-900 p-2 rounded space-y-1">
              {miniatura.totalValue && (
                <div className="text-gray-700 dark:text-purple-100">
                  📦 ESTOQUE: <strong>{miniatura.totalValue}</strong>
                </div>
              )}
              {miniatura.paidValue !== undefined && (
                <div className="text-orange-700 dark:text-orange-100">
                  💵 VALOR EM ABERTO: <strong>R$ {parseFloat(miniatura.paidValue).toFixed(2)}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded space-y-1">
              {miniatura.totalValue && (
                <div className="text-gray-700 dark:text-blue-100">
                  💰 Valor: <strong>R$ {parseFloat(miniatura.totalValue).toFixed(2)}</strong>
                </div>
              )}
              {miniatura.paidValue !== undefined && (
                <div className="text-green-700 dark:text-green-100">
                  ✅ Pago: <strong>R$ {parseFloat(miniatura.paidValue).toFixed(2)}</strong>
                </div>
              )}
              {miniatura.totalValue && miniatura.paidValue !== undefined && (
                <div className={`${
                  miniatura.totalValue - miniatura.paidValue > 0
                    ? 'text-red-700 dark:text-red-100'
                    : 'text-green-700 dark:text-green-100'
                }`}>
                  📊 Saldo: <strong>R$ {(miniatura.totalValue - miniatura.paidValue).toFixed(2)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Situação da Miniatura - Apenas para Pré-Vendas */}
          {!isGarage && miniatura.situation && (
            <div className="bg-indigo-50 dark:bg-indigo-900 p-2 rounded">
              <div className="text-indigo-700 dark:text-indigo-200">
                📍 Situação: <strong>{miniatura.situation}</strong>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <span>{miniatura.status === 'completed' ? '✅' : '⏳'}</span>
            <span className="font-semibold">
              {miniatura.status === 'completed' ? 'Concluído' : 'Pendente'}
            </span>
          </div>
        </div>

        {/* Botão Deletar */}
        {onDelete && user?.role === 'admin' && (
          <button
            onClick={() => onDelete(miniatura.id)}
            className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white py-2 rounded font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
          >
            🗑️ Deletar
          </button>
        )}
      </div>
    </div>
  );
}
