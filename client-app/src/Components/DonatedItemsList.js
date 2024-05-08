import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Barcode from 'react-barcode';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';

function DonatedItemsList() {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [programOptions, setProgramOptions] = useState(['Youth Program', 'Retail Sales', 'Recycle', 'Earn-a-bicycle', 'Earn-a-computer']);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [assignProgramClicked, setAssignProgramClicked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleBarcodeClick = (itemId) => {
    const selectedItem = donatedItems.find(item => item.id === itemId);
    setSelectedItemDetails(selectedItem);
    setModalIsOpen(true);
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

  // Function to filter items by item name
  const handleFilterByItemName = (event) => {
    const filtered = donatedItems.filter(item => item.name === event.target.value);
    setFilteredItems(filtered);
  };

  // Function to filter items by program
  const handleFilterByProgram = (event) => {
    const filtered = donatedItems.filter(item => item.program === event.target.value);
    setFilteredItems(filtered);
  };

  // Function to filter items by status
  const handleFilterByStatus = (event) => {
    const filtered = donatedItems.filter(item => item.status === event.target.value);
    setFilteredItems(filtered);
  };

  // Function to toggle assign program section
  const toggleAssignProgram = () => {
    setAssignProgramClicked(!assignProgramClicked);
  };

  const handleAddDonationClick = () => {
    // Navigate to the DonationForm page
    navigate('/donation-form');
  }

  // Sample data for demonstration
  const [donatedItems, setDonatedItems] = useState([
    { id: 811253, name: 'Bicycle', donor: 'Mary', date: '2024-02-25', program: 'Not Assigned', status: 'Donated' },
    { id: 811249, name: 'Computer', donor: 'James', date: '2024-02-06', program: 'Not Assigned', status: 'In Storage Facility' },
    { id: 811247, name: 'Computer', donor: 'Vivian', date: '2024-01-26', program: 'Not Assigned', status: 'Refurbished' },
    { id: 811246, name: 'Bicycle', donor: 'Elizabeth', date: '2024-01-21', program: 'Not Assigned', status: 'Item Sold' },
    { id: 811240, name: 'Bicycle', donor: 'Peter', date: '2024-01-13', program: 'Not Assigned', status: 'Received' }
    // Add more items here...
  ]);
  const downloadBarcode = (id) => {
    const barcodeElement = document.getElementById(`barcode-${id}`);
    html2canvas(barcodeElement)
      .then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `barcode-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error('Error downloading the barcode: ', err));
  };

  return (
    <>
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
          <div className="options">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search using Item Id, Name, Donor, Date, Program, or Status"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}><FaSearch /></button>
            </div>

            <div className="dropdowns">
              <select className="sort-options" onChange={handleSort}>
                <option value="" disabled defaultValue>
                  Sort
                </option>
                <option value="dateAsc">Date Ascending</option>
                <option value="dateDesc">Date Descending</option>
              </select>

              {/* Filter by Item Name */}
              <select className="filter-options" onChange={handleFilterByItemName}>
                <option value="" disabled selected>
                  Filter by Item Name
                </option>
                <option value="Bicycle">Bicycle</option>
                <option value="Computer">Computer</option>
              </select>

              {/* Filter by Program */}
              <select className="filter-options" onChange={handleFilterByProgram}>
                <option value="" disabled selected>
                  Filter by Program
                </option>
                {programOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {/* Filter by Status */}
              <select className="filter-options" onChange={handleFilterByStatus}>
                <option value="" disabled selected>
                  Filter by Status
                </option>
                <option value="Donated">Donated</option>
                <option value="In Storage Facility">In Storage Facility</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Received">Received</option>
                <option value="Item Sold">Item Sold</option>
              </select>
            </div>
          </div>
        </div>

        <div class="div-updateprogram">

          {assignProgramClicked && (
            <div class="div-addprogram">
              <select value={selectedProgram} onChange={handleProgramChange}>
                <option value="">Select Program</option>
                {programOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button onClick={updatePrograms}>Update Programs</button>
            </div>
          )}
          <button onClick={toggleAssignProgram}>
            {assignProgramClicked ? "Hide Assign Program" : "Assign Program"}
          </button>
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
              <th>Barcode</th>
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
                
                <td>
                  <div onClick={() => handleBarcodeClick(item.id)}>
                  <div id={`barcode-${item.id}`}><Barcode value={item.id.toString()} /></div>
                        <button onClick={() => downloadBarcode(item.id)}>Download Barcode</button>
                  </div>
                
                </td>
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

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <h2>Details</h2>
          {selectedItemDetails && (
            <div>
              <p>Item ID: {selectedItemDetails.id}</p>
              <p>Item Name: {selectedItemDetails.name}</p>
              <p>Donor Name: {selectedItemDetails.donor}</p>
              <p>Donation Date: {selectedItemDetails.date}</p>
              <p>Program: {selectedItemDetails.program}</p>
              <p>Status: {selectedItemDetails.status}</p>
            </div>
          )}
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <button onClick={() => handleAddDonationClick()}>
            <FaPlus size={24} />
          </button>
        </div>
      </div>
    </>
  );
}

export default DonatedItemsList;