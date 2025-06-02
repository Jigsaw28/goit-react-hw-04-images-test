import { useState } from 'react';
import { toast } from 'react-toastify';

export const SearchBar = ({onSubmit}) => {
  const [inputSearch, setInputSearch] = useState('');

  const handleChange = ({ target: { value, name } }) => {
    setInputSearch(value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (inputSearch.trim() === '') {
      toast.error('Enter something')
      return
    }
    
    onSubmit(inputSearch);
    reset();
  };

 const reset = () => {
    setInputSearch('');
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handleSubmit}>
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

          <input
            className="SearchForm-input"
            type="text"
            name="inputSearch"
            value={inputSearch}
            onChange={handleChange}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }

