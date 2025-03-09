import React, { useState } from 'react';
import '../styles/Font.css';

const FontSize = ({setFontSize}) => {
  const [isOpen, setIsOpen] = useState(false);

  const fontSizes = [];
  for (let i = 14; i <= 35; i++) {
    fontSizes.push(i);
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFontSizeSelect = (size) => {
    setFontSize(size);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className='button font' onClick={toggleDropdown}></button>
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
