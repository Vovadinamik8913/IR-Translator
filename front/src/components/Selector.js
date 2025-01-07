import React from 'react';
import Select from 'react-select';

const Selector = ({ onChange, elem, src, text }) => {
  const options = src.map((elem) => ({
    value: elem,
    label: elem,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '150px', // Установите желаемую ширину
      minWidth: '150px',
      maxWidth: '150px',
      backgroundColor: '#3C3C3C',
      color: '#fff', // Цвет текста внутри control
      borderColor: state.isFocused ? '#666' : '#444',
      boxShadow: state.isFocused ? '0 0 0 1px #666' : null,
      '&:hover': {
        borderColor: '#666',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#3C3C3C',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? '#555' // Цвет фона при наведении на опцию
        : '#3C3C3C',
      color: '#fff', // Цвет текста опций
      '&:active': {
        backgroundColor: '#777', // Цвет фона при выборе опции
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#fff', // Цвет выбранного значения
    }),
    placeholder: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#bbb', // Цвет текста placeholder
    }),
    input: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#fff', // Цвет текста при вводе поиска
    }),
  };
  

  const selectedOption = options.find((option) => option.value === elem);

  return (
    <div className="margin-right-15">
      <Select
        onChange={onChange}
        value={selectedOption}
        options={options}
        className="selector"
        placeholder={text}
        isSearchable
        styles={customStyles}
      />
    </div>
  );
};

export default Selector;
