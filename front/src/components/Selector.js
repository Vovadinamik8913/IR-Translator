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
      width: '150px',
      minWidth: '150px',
      maxWidth: '150px',
      backgroundColor: '#3C3C3C',
      color: '#fff',
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
        ? '#555'
        : '#3C3C3C',
      color: '#fff', 
      '&:active': {
        backgroundColor: '#777',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#bbb',
    }),
    input: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#fff',
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
