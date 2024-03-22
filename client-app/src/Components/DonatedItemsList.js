import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';

function DonatedItemsList() {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = () => {
    const filtered = donatedItems.filter(item =>
      item.id.toString().includes(searchInput) ||
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.donor.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.date.includes(searchInput) ||
      item.program.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.status.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleSort = (event) => {
    // Implement your sorting logic here
    console.log('Sorting by:', event.target.value);
  };

  const handleOpenFilters = () => {
    // Implement your filter logic here
    console.log('Opening filters...');
  };

  // Sample data for demonstration
  const donatedItems = [
    { id: 811253, name: 'Bicycle', donor: 'Mary', date: '2024-02-25', program: 'Not Assigned', status: 'Donated' },
    { id: 811249, name: 'Computer', donor: 'James', date: '2024-02-06', program: 'Not Assigned', status: 'In Storage Facility' },
    { id: 811247, name: 'Computer', donor: 'Vivian', date: '2024-01-26', program: 'Not Assigned', status: 'Refurbished' },
    { id: 811246, name: 'Bicycle', donor: 'Elizabeth', date: '2024-01-21', program: 'Not Assigned', status: 'Item Sold' },
    { id: 811240, name: 'Bicycle', donor: 'Peter', date: '2024-01-13', program: 'Not Assigned', status: 'Received' }
    // Add more items here...
  ];

  return (
    <div>
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
            placeholder="Search using Item Id, Name, Donor, Date, Program, or Status"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}><FaSearch /></button>
        </div>

        <div className="options">
          <div className="dropdowns">
            <select className="sort-options" onChange={handleSort}>
              <option value="" disabled defaultValue>
                Sort
              </option>
              <option value="dateAsc">Date Ascending</option>
              <option value="dateDesc">Date Descending</option>
            </select>

            <button className="set-program-button" onClick={handleOpenFilters}>Filters</button>
          </div>
        </div>
      </div>

      <table className="item-list">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item_ID</th>
            <th>Item_Name</th>
            <th>Donor Name</th>
            <th>Donation Date</th>
            <th>Program</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(filteredItems.length > 0 ? filteredItems : donatedItems).map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td><Link to={`/item/${item.id}`} state={{ itemInfo: item }}>{item.id}</Link></td>
              <td>{item.name}</td>
              <td>{item.donor}</td>
              <td>{item.date}</td>
              <td>{item.program}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DonatedItemsList;
