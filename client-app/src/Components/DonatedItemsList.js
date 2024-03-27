import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';

function DonatedItemsList() {
 const [searchInput, setSearchInput] = useState('');
 const [filteredItems, setFilteredItems] = useState([]);
 const [selectedItems, setSelectedItems] = useState([]);
 const [programOptions, setProgramOptions] = useState(['Youth Program', 'Retail Sales', 'Recycle', 'Earn-a-bicycle', 'Earn-a-computer']);
 const [selectedProgram, setSelectedProgram] = useState('');
 const [assignProgramClicked, setAssignProgramClicked] = useState(false);
 const [donatedItems, setDonatedItems] = useState([
    { id: 811253, name: 'Bicycle', donor: 'Mary', date: '2024-02-25', program: 'Not Assigned', status: 'Donated' },
    { id: 811249, name: 'Computer', donor: 'James', date: '2024-02-06', program: 'Not Assigned', status: 'In Storage Facility' },
    { id: 811247, name: 'Computer', donor: 'Vivian', date: '2024-01-26', program: 'Not Assigned', status: 'Refurbished' },
    { id: 811246, name: 'Bicycle', donor: 'Elizabeth', date: '2024-01-21', program: 'Not Assigned', status: 'Item Sold' },
    { id: 811240, name: 'Bicycle', donor: 'Peter', date: '2024-01-13', program: 'Not Assigned', status: 'Received' }
 ]);

 useEffect(() => {
    handleSort(); // Trigger sorting logic on initial render
 }, []); // Empty dependency array ensures this effect runs only once after the initial render

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

 const handleSort = () => {
    const sortingOption = document.getElementById("sortOptions").value;
    let sortedItems = [...donatedItems]; // Create a copy of donatedItems to avoid mutating state directly
  
    if (sortingOption === "dateAsc") {
      sortedItems.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortingOption === "dateDesc") {
      sortedItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  
    // Update state with sorted items
    setDonatedItems(sortedItems);
 };

 const handleOpenFilters = () => {
    console.log('Opening filters...');
 };

 const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
 };

 const handleProgramChange = (event) => {
    setSelectedProgram(event.target.value);
 };

 const updatePrograms = () => {
    const updatedItems = donatedItems.map(item => {
      if (selectedItems.includes(item.id)) {
        return { ...item, program: selectedProgram };
      }
      return item;
    });
    setDonatedItems(updatedItems);
    setSelectedItems([]); // Clear selected items after updating
    setAssignProgramClicked(false); // Hide assign program section
 };

 const toggleAssignProgram = () => {
    setAssignProgramClicked(!assignProgramClicked);
 };

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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}></div>
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
            <select id="sortOptions" className="sort-options" onChange={handleSort}>
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

      <div style={{ textAlign: 'right' }}>
        <button onClick={toggleAssignProgram}>
          {assignProgramClicked ? "Hide Assign Program" : "Assign Program"}
        </button>
      </div>
      {assignProgramClicked && (
        <div>
          <select value={selectedProgram} onChange={handleProgramChange}>
            <option value="">Select Program</option>
            {programOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button onClick={updatePrograms}>Update Programs</button>
        </div>
      )}

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
            {assignProgramClicked && <th>Select</th>}
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
              {assignProgramClicked && (
                <td>
                 <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                 />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 );
}

export default DonatedItemsList;