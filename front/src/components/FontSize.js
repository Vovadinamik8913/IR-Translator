import React, { useState } from 'react';
import '../styles/Font.css';

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
        <div className='font-overlay'>
          {fontSizes.map((size) => (
            <button
              key={size}
              className='font'
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
