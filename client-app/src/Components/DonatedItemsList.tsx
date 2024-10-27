import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import ItemStatus from '../constants/Enums';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';
import html2canvas from 'html2canvas';

// Define interfaces for our data structures
interface Donor {
    id: number;
    firstName: string;
    email: string;
    name?: string;
}

interface Program {
    id: number;
    name: string;
}

interface Status {
    status: string;
    date: string;
}

interface DonatedItem {
    id: number;
    itemType: string;
    currentStatus: string;
    dateDonated: string;
    lastUpdated?: string;
    donor: Donor | null;
    program: Program | null;
    programId?: number;
    statuses?: Status[];
}

interface SelectedItemDetails extends DonatedItem {
    statuses: Status[];
}

const DonatedItemsList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<DonatedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedItemDetails, setSelectedItemDetails] = useState<SelectedItemDetails | null>(null);

    const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [programOptions, setProgramOptions] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [assignProgramClicked, setAssignProgramClicked] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [itemTypes, setItemTypes] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    const fetchDonatedItems = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/donatedItem');
            if (!response.ok) {
                throw new Error('Failed to fetch donated items');
            }
            const data: DonatedItem[] = await response.json();
            setDonatedItems(data);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            console.error('Error details:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchProgramOptions = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:4000/program');
            if (!response.ok) {
                throw new Error('Failed to fetch program options');
            }
            const data: Program[] = await response.json();
            setProgramOptions(data);
        } catch (err) {
            const error = err as Error;
            console.error('Error fetching program options:', error);
        }
    };

    useEffect(() => {
        fetchDonatedItems();
        fetchProgramOptions();
    }, []);

    useEffect(() => {
        const types = new Set(donatedItems.map(item => item.itemType));
        setItemTypes(types);
    }, [donatedItems]);

    const handleSearch = (): void => {
        const searchTerm = searchInput.toLowerCase();
        const filtered = donatedItems.filter(item =>
            item.id.toString().includes(searchTerm) ||
            item.itemType.toLowerCase().includes(searchTerm) ||
            item.currentStatus.toLowerCase().includes(searchTerm) ||
            new Date(item.dateDonated).toLocaleDateString().includes(searchTerm) ||
            (item.donor?.name || '').toLowerCase().includes(searchTerm) ||
            (item.program?.name || '').toLowerCase().includes(searchTerm)
        );
        setFilteredItems(filtered);
    };

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = event.target.value;
        const sorted = [...donatedItems].sort((a, b) => {
            const dateA = new Date(a.dateDonated);
            const dateB = new Date(b.dateDonated);

            if (value === 'dateAsc') {
                return dateA.getTime() - dateB.getTime();
            } else if (value === 'dateDesc') {
                return dateB.getTime() - dateA.getTime();
            }
            return 0;
        });
        setFilteredItems(sorted);
    };

    const handleCheckboxChange = (itemId: number): void => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(itemId)) {
                return prevSelected.filter(id => id !== itemId);
            } else {
                return [...prevSelected, itemId];
            }
        });
    };

    const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedProgram(event.target.value);
    };

    const updatePrograms = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:4000/program', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemIds: selectedItems,
                    programId: parseInt(selectedProgram),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update programs');
            }

            await fetchDonatedItems();
            setSelectedItems([]);
            setAssignProgramClicked(false);
        } catch (err) {
            const error = err as Error;
            console.error('Error updating programs:', error);
            setError('Failed to update programs. Please try again.');
        }
    };

    const handleFilterByItemName = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const filtered = donatedItems.filter(
            item => item.itemType.toLowerCase() === event.target.value.toLowerCase()
        );
        setFilteredItems(filtered);
    };

    const handleFilterByProgram = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const programId = parseInt(event.target.value);
        const filtered = donatedItems.filter(item => item.programId === programId);
        setFilteredItems(filtered);
    };

    const handleFilterByStatus = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (!event.target.value) {
            setFilteredItems([]);
            return;
        }
        const filtered = donatedItems.filter(
            item => item.currentStatus.toLowerCase() === event.target.value.toLowerCase()
        );
        setFilteredItems(filtered);
    };

    const toggleAssignProgram = (): void => {
        setAssignProgramClicked(!assignProgramClicked);
    };

    const handleAddNewDonationClick = (): void => {
        navigate('/adddonation');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                <div className="options">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search using Item Id, Name, Donor, Date, Program, or Status"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>

                    <div className="dropdowns">
                        <select className="sort-options" onChange={handleSort}>
                            <option value="" disabled defaultValue="">Sort</option>
                            <option value="dateAsc">Date Ascending</option>
                            <option value="dateDesc">Date Descending</option>
                        </select>

                        <select className="filter-options" onChange={handleFilterByItemName}>
                            <option value="" disabled>Filter by Item Type</option>
                            {Array.from(itemTypes).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select className="filter-options" onChange={handleFilterByProgram}>
                            <option value="" disabled>Filter by Program</option>
                            {programOptions.map(program => (
                                <option key={program.id} value={program.id}>
                                    {program.name}
                                </option>
                            ))}
                        </select>

                        <select className="filter-options" onChange={handleFilterByStatus}>
                            <option value="" disabled>Filter by Status</option>
                            <option value={ItemStatus.DONATED}>Donated</option>
                            <option value={ItemStatus.IN_STORAGE}>In Storage Facility</option>
                            <option value={ItemStatus.REFURBISHED}>Refurbished</option>
                            <option value={ItemStatus.RECEIVED}>Received</option>
                            <option value={ItemStatus.SOLD}>Item Sold</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="div-updateprogram">
                {assignProgramClicked && (
                    <div className="div-addprogram">
                        <select value={selectedProgram} onChange={handleProgramChange}>
                            <option value="">Select Program</option>
                            {programOptions.map(program => (
                                <option key={program.id} value={program.id}>
                                    {program.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={updatePrograms}>Update Programs</button>
                    </div>
                )}
                <button onClick={toggleAssignProgram}>
                    {assignProgramClicked ? 'Hide Assign Program' : 'Assign Program'}
                </button>
                <button onClick={handleAddNewDonationClick}>Add New Donation</button>
            </div>

            <table className="item-list">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Status</th>
                        <th>Donation Date</th>
                        <th>Donor Name</th>
                        <th>Program</th>
                        {assignProgramClicked && <th>Select</th>}
                    </tr>
                </thead>
                <tbody>
                    {(filteredItems.length > 0 ? filteredItems : donatedItems).map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                                <Link to={`/item/${item.id}`} state={{ itemInfo: item }}>
                                    {item.id}
                                </Link>
                            </td>
                            <td>{item.itemType}</td>
                            <td>{item.currentStatus}</td>
                            <td>{new Date(item.dateDonated).toLocaleDateString()}</td>
                            <td>{item.donor ? item.donor.firstName : 'N/A'}</td>
                            <td>{item.program ? item.program.name : 'Not Assigned'}</td>
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
                <h2>Item Details</h2>
                {selectedItemDetails && (
                    <div>
                        <p>Item ID: {selectedItemDetails.id}</p>
                        <p>Item Type: {selectedItemDetails.itemType}</p>
                        <p>Current Status: {selectedItemDetails.currentStatus}</p>
                        <p>Date Donated: {new Date(selectedItemDetails.dateDonated).toLocaleDateString()}</p>
                        {selectedItemDetails.lastUpdated && (
                            <p>Last Updated: {new Date(selectedItemDetails.lastUpdated).toLocaleDateString()}</p>
                        )}
                        <p>Donor Name: {selectedItemDetails.donor ? selectedItemDetails.donor.name : 'N/A'}</p>
                        <p>Program: {selectedItemDetails.program ? selectedItemDetails.program.name : 'Not Assigned'}</p>

                        {selectedItemDetails.statuses && selectedItemDetails.statuses.length > 0 && (
                            <>
                                <h3>Status History</h3>
                                <ul>
                                    {selectedItemDetails.statuses.map((status, index) => (
                                        <li key={index}>
                                            {status.status} - {new Date(status.date).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
            
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <button onClick={handleAddNewDonationClick}>
                    <FaPlus size={24} />
                </button>
            </div>
        </div>
    );
};

export default DonatedItemsList;