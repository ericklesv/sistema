import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export function MiniaturaAutocomplete({ value, onChange, onSelectMiniatura, placeholder = "Pesquisar miniatura..." }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Buscar miniaturas quando o valor muda
  useEffect(() => {
    if (value.trim().length > 0) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get('/api/miniaturas-base');
      
      // Filtrar miniaturas que correspondem ao termo de busca
      const filtered = response.data.filter(m =>
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } catch (err) {
      console.error('Erro ao buscar miniaturas:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (miniatura) => {
    onChange(miniatura.name);
    onSelectMiniatura(miniatura);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim().length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin">⏳</div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((miniatura) => (
            <button
              key={miniatura.id}
              type="button"
              onClick={() => handleSelectSuggestion(miniatura)}
              className="w-full text-left px-4 py-3 hover:bg-blue-100 dark:hover:bg-slate-600 transition border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {miniatura.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {miniatura.brand}
                </div>
              </div>
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-mono text-xs font-bold whitespace-nowrap">
                {miniatura.code}
              </div>
              {miniatura.photoUrl && (
                <img
                  src={miniatura.photoUrl}
                  alt={miniatura.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.trim().length > 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
          Nenhuma miniatura encontrada
        </div>
      )}
    </div>
  );
}
