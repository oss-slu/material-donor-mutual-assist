import React, { useState } from 'react';
import '../css/AdminHeader.css'; // Import your CSS file for styling
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons/fa
import { FaIconName } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';



function AdminHeader({ onSearch, onSort, onOpenFilters }) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleSort = (event) => {
    const selectedSortOption = event.target.value;
    onSort(selectedSortOption);
  };

  return (
    <div className="header">
      <div className="logo-container">
      <img
                src="https://www.bworks.org/wp-content/themes/bworks/library/images/logo-bworks.png" 
                alt="BWorks Logo"
                className="logo"
            />
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search using Item Id"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}><FaSearch /></button> {/* Search icon */}
      </div>

      <div className="options">
        <div className="dropdowns">
          <select className="sort-options" onChange={handleSort}>
            <option value="" disabled selected>
              Sort
            </option>
            <option value="dateAsc">Date Ascending</option>
            <option value="dateDesc">Date Descending</option>
            {/* Add more sort options as needed */}
          </select>

          <select className="filters-options" onChange={onOpenFilters}>
            <option value="" disabled selected>
              Filters
            </option>
            {/* Add filter options here */}
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;