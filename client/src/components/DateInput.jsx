import { useState } from 'react';

/**
 * Componente de input de data que aceita digitação manual (DD/MM/YYYY) e seleção por calendário
 */
const DateInput = ({ value, onChange, label, placeholder = "DD/MM/AAAA", className = "", required = false }) => {
  const [displayValue, setDisplayValue] = useState(value ? formatToDisplay(value) : '');

  // Converte ISO date (YYYY-MM-DD) para display (DD/MM/YYYY)
  function formatToDisplay(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Converte display (DD/MM/YYYY) para ISO (YYYY-MM-DD)
  function formatToISO(displayDate) {
    if (!displayDate) return '';
    const cleaned = displayDate.replace(/\D/g, '');
    if (cleaned.length !== 8) return '';
    
    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);
    
    // Validar data
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day) {
      return '';
    }
    
    return `${year}-${month}-${day}`;
  }

  // Formata automaticamente enquanto digita
  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    // Limita a 8 dígitos
    if (inputValue.length > 8) {
      inputValue = inputValue.substring(0, 8);
    }
    
    // Adiciona as barras automaticamente
    let formatted = '';
    if (inputValue.length >= 1) {
      formatted = inputValue.substring(0, 2);
    }
    if (inputValue.length >= 3) {
      formatted += '/' + inputValue.substring(2, 4);
    }
    if (inputValue.length >= 5) {
      formatted += '/' + inputValue.substring(4, 8);
    }
    
    setDisplayValue(formatted);
    
    // Se tiver 10 caracteres (DD/MM/YYYY), converte para ISO e envia
    if (formatted.length === 10) {
      const isoDate = formatToISO(formatted);
      if (isoDate) {
        onChange({ target: { value: isoDate } });
      }
    } else if (formatted.length === 0) {
      onChange({ target: { value: '' } });
    }
  };

  // Quando usa o calendário
  const handleDatePickerChange = (e) => {
    const isoDate = e.target.value;
    setDisplayValue(formatToDisplay(isoDate));
    onChange(e);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
        />
        <input
          type="date"
          value={value || ''}
          onChange={handleDatePickerChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ width: '40px', right: '8px', left: 'auto' }}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          📅
        </span>
      </div>
    </div>
  );
};

export default DateInput;
