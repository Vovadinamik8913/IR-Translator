import React, { useState } from 'react';

const FontSize = ({setFontSize}) => {
  const [isOpen, setIsOpen] = useState(false);   // Открытие/закрытие списка

  const fontSizes = [];
  for (let i = 14; i <= 35; i++) {
    fontSizes.push(i);
  }


  // Переключение видимости выпадающего списка
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Выбор размера шрифта
  const handleFontSizeSelect = (size) => {
    setFontSize(size);
    setIsOpen(false); // Закрываем список
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Кнопка, по нажатию на которую открывается/закрывается список */}
      <button className='button font' onClick={toggleDropdown}></button>

      {/* Выпадающий список, рендерится при isOpen === true */}
      {isOpen && (
        <div
        
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            border: '1px solid #ccc',
            padding: '4px',
            zIndex: '1000',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            overflowY: 'auto',
            height: '250px'
          }}
        >
          {fontSizes.map((size) => (
            <button
              key={size}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleFontSizeSelect(size)}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FontSize;
