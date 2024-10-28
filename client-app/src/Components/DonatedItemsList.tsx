import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Barcode from 'react-barcode';
import Modal from 'react-modal';
import ItemStatus from '../constants/Enums';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';

// Define types for the item and status enums
interface DonatedItem {
    id: number;
    name: string;
    donor: string;
    date: string;
    program: string;
    status: string;
}

const DonatedItemsList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<DonatedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedItemDetails, setSelectedItemDetails] = useState<DonatedItem | null>(null);
    const [programOptions, setProgramOptions] = useState<string[]>([
        'Youth Program',
        'Retail Sales',
        'Recycle',
        'Earn-a-bicycle',
        'Earn-a-computer',
    ]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [assignProgramClicked, setAssignProgramClicked] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([
        {
            id: 811253,
            name: 'Bicycle',
            donor: 'Mary',
            date: '2024-02-25',
            program: 'Not Assigned',
            status: ItemStatus.DONATED,
        },
        {
            id: 811249,
            name: 'Computer',
            donor: 'James',
            date: '2024-02-06',
            program: 'Not Assigned',
            status: ItemStatus.IN_STORAGE,
        },
        {
            id: 811247,
            name: 'Computer',
            donor: 'Vivian',
            date: '2024-01-26',
            program: 'Not Assigned',
            status: ItemStatus.REFURBISHED,
        },
        {
            id: 811246,
            name: 'Bicycle',
            donor: 'Elizabeth',
            date: '2024-01-21',
            program: 'Not Assigned',
            status: ItemStatus.SOLD,
        },
        {
            id: 811240,
            name: 'Bicycle',
            donor: 'Peter',
            date: '2024-01-13',
            program: 'Not Assigned',
            status: ItemStatus.RECEIVED,
        },
    ]);
    const navigate = useNavigate();

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
                (Object.values(ItemStatus).includes(item.status as any) &&
                    item.status
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())),
        );
        setFilteredItems(filtered);
    };

    const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
        // Sorting logic can go here
        console.log('Sorting by:', event.target.value);
    };

    const handleCheckboxChange = (itemId: number) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleProgramChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgram(event.target.value);
    };

    const handleBarcodeClick = (itemId: number) => {
        const selectedItem = donatedItems.find(item => item.id === itemId);
        setSelectedItemDetails(selectedItem || null);
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
        setSelectedItems([]);
        setAssignProgramClicked(false);
    };

    const handleFilterByItemName = (event: ChangeEvent<HTMLSelectElement>) => {
        const filtered = donatedItems.filter(item => item.name === event.target.value);
        setFilteredItems(filtered);
    };

    const handleFilterByProgram = (event: ChangeEvent<HTMLSelectElement>) => {
        const filtered = donatedItems.filter(item => item.program === event.target.value);
        setFilteredItems(filtered);
    };

    const handleFilterByStatus = (event: ChangeEvent<HTMLSelectElement>) => {
        const filtered = donatedItems.filter(item => item.status === event.target.value);
        setFilteredItems(filtered);
    };

    const toggleAssignProgram = () => {
        setAssignProgramClicked(!assignProgramClicked);
    };

    const handleAddNewDonationClick = () => {
        navigate('/adddonation');
    };

    const downloadBarcode = (id: number) => {
        const barcodeElement = document.getElementById(`barcode-${id}`);
        if (barcodeElement) {
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
                .catch(err => console.error('Error downloading the barcode: ', err));
        }
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
                                <option value="" disabled>
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
                                <option value="Bicycle">Bicycle</option>
                                <option value="Computer">Computer</option>
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
                                <option value={ItemStatus.DONATED}>
                                    Donated
                                </option>
                                <option value={ItemStatus.IN_STORAGE}>
                                    In Storage Facility
                                </option>
                                <option value={ItemStatus.REFURBISHED}>
                                    Refurbished
                                </option>
                                <option value={ItemStatus.RECEIVED}>
                                    Received
                                </option>
                                <option value={ItemStatus.SOLD}>
                                    Item Sold
                                </option>
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
                                <td>
                                    <Link
                                        to={`/item/${item.id}`}
                                        state={{ itemInfo: item }}
                                    >
                                        {item.id}
                                    </Link>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.donor}</td>
                                <td>{item.date}</td>
                                <td>{item.program}</td>
                                <td>{item.status}</td>

                                <td>
                                    <div
                                        onClick={() =>
                                            handleBarcodeClick(item.id)
                                        }
                                    >
                                        <div id={`barcode-${item.id}`}>
                                            <Barcode
                                                value={item.id.toString()}
                                            />
                                        </div>
                                        <button
                                            onClick={() =>
                                                downloadBarcode(item.id)
                                            }
                                        >
                                            Download Barcode
                                        </button>
                                    </div>
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

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                >
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
                <div
                    style={{ position: 'fixed', bottom: '20px', right: '20px' }}
                >
                    <button onClick={() => handleAddNewDonationClick()}>
                        <FaPlus size={24} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default DonatedItemsList;