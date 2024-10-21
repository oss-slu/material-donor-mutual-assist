import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Barcode from 'react-barcode';
import Modal from 'react-modal';
import ItemStatus from '../constants/Enums.js';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';

function DonatedItemsList() {
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [programOptions, setProgramOptions] = useState([
        'Youth Program',
        'Retail Sales',
        'Recycle',
        'Earn-a-bicycle',
        'Earn-a-computer',
    ]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [assignProgramClicked, setAssignProgramClicked] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [donatedItems, setDonatedItems] = useState([]); // Initialize as an empty array
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonatedItems = async () => {
            try {
                const response = await fetch(
                    '${process.env.REACT_APP_BACKEND_API_BASE_URL}/donatedItem',
                ); // Adjust the URL as needed
                const data = await response.json();
                console.log('Fetched Data:', data); // Check if the data looks correct
                setDonatedItems(data); // Assuming the API returns an array of donated items
            } catch (error) {
                console.error('Error fetching donated items:', error);
            }
        };
        console.log('Donated Items:', donatedItems);

        fetchDonatedItems();
    }, []);
    useEffect(() => {
        console.log('Donated Items Updated:', donatedItems); // This will log whenever the state changes
    }, [donatedItems]); // This useEffect will run every time donatedItems is updated

    const handleSearch = () => {
        const filtered = donatedItems.filter(
            item =>
                item.id.toString().includes(searchInput) ||
                item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.donor.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.date.includes(searchInput) ||
                item.program
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                (Object.values(ItemStatus).includes(item.status) &&
                    item.status
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())),
        );
        setFilteredItems(filtered);
    };

    const handleSort = event => {
        // Implement your sorting logic here
        console.log('Sorting by:', event.target.value);
    };

    const handleCheckboxChange = itemId => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleProgramChange = event => {
        setSelectedProgram(event.target.value);
    };

    const handleBarcodeClick = itemId => {
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
    const handleFilterByItemName = event => {
        const filtered = donatedItems.filter(
            item => item.name === event.target.value,
        );
        setFilteredItems(filtered);
    };

    // Function to filter items by program
    const handleFilterByProgram = event => {
        const filtered = donatedItems.filter(
            item => item.program === event.target.value,
        );
        setFilteredItems(filtered);
    };

    // Function to filter items by status
    const handleFilterByStatus = event => {
        const filtered = donatedItems.filter(
            item => item.status === event.target.value,
        );
        setFilteredItems(filtered);
    };

    // Function to toggle assign program section
    const toggleAssignProgram = () => {
        setAssignProgramClicked(!assignProgramClicked);
    };

    const handleAddDonationClick = () => {
        // Navigate to the DonationForm page
        navigate('/donation-form');
    };

    const handleAddNewDonationClick = () => {
        // Navigate to NewItemForm page
        navigate('/adddonation');
    };

    const downloadBarcode = id => {
        const barcodeElement = document.getElementById(`barcode-${id}`);
        html2canvas(barcodeElement)
            .then(canvas => {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `barcode-${id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err =>
                console.error('Error downloading the barcode: ', err),
            );
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
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    ></div>
                    <div className="options">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search using Item Id, Name, Donor, Date, Program, or Status"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <button
                                className="search-button"
                                onClick={handleSearch}
                            >
                                <FaSearch />
                            </button>
                        </div>

                        <div className="dropdowns">
                            <select
                                className="sort-options"
                                onChange={handleSort}
                            >
                                <option value="" disabled defaultValue>
                                    Sort
                                </option>
                                <option value="dateAsc">Date Ascending</option>
                                <option value="dateDesc">
                                    Date Descending
                                </option>
                            </select>

                            {/* Filter by Item Name */}
                            <select
                                className="filter-options"
                                onChange={handleFilterByItemName}
                            >
                                <option value="" disabled selected>
                                    Filter by Item Name
                                </option>
                                {Array.from(
                                    new Set(
                                        donatedItems.map(item => item.name),
                                    ),
                                ).map(name => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>

                            {/* Filter by Program */}
                            <select
                                className="filter-options"
                                onChange={handleFilterByProgram}
                            >
                                <option value="" disabled selected>
                                    Filter by Program
                                </option>
                                {programOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            {/* Filter by Status */}
                            <select
                                className="filter-options"
                                onChange={handleFilterByStatus}
                            >
                                <option value="" disabled selected>
                                    Filter by Status
                                </option>
                                {Object.values(ItemStatus).map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="div-updateprogram">
                    {assignProgramClicked && (
                        <div className="div-addprogram">
                            <select
                                value={selectedProgram}
                                onChange={handleProgramChange}
                            >
                                <option value="">Select Program</option>
                                {programOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button onClick={updatePrograms}>
                                Update Programs
                            </button>
                        </div>
                    )}
                    <button onClick={toggleAssignProgram}>
                        {assignProgramClicked
                            ? 'Hide Assign Program'
                            : 'Assign Program'}
                    </button>

                    <button onClick={handleAddNewDonationClick}>
                        Add New Donation
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
                        
                        {(filteredItems.length > 0
                            ? filteredItems
                            : donatedItems
                        ).map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.donor}</td>
                                <td>{item.date}</td>
                                <td>{item.program}</td>
                                <td>{item.status}</td>
                                <td>
                                    <div
                                        id={`barcode-${item.id}`}
                                        onClick={() =>
                                            handleBarcodeClick(item.id)
                                        }
                                    >
                                        <Barcode value={item.id.toString()} />
                                    </div>
                                    <button
                                        onClick={() => downloadBarcode(item.id)}
                                    >
                                        Download Barcode
                                    </button>
                                </td>
                                {assignProgramClicked && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(item.id)
                                            }
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for displaying item details */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Item Details"
                >
                    <h2>Item Details</h2>
                    {selectedItemDetails && (
                        <div>
                            <p>
                                <strong>Item ID:</strong>{' '}
                                {selectedItemDetails.id}
                            </p>
                            <p>
                                <strong>Name:</strong>{' '}
                                {selectedItemDetails.name}
                            </p>
                            <p>
                                <strong>Donor:</strong>{' '}
                                {selectedItemDetails.donor}
                            </p>
                            <p>
                                <strong>Date:</strong>{' '}
                                {selectedItemDetails.date}
                            </p>
                            <p>
                                <strong>Program:</strong>{' '}
                                {selectedItemDetails.program}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                {selectedItemDetails.status}
                            </p>
                        </div>
                    )}
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </Modal>
            </div>
        </>
    );
}

export default DonatedItemsList;

