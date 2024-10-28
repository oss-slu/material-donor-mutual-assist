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
    donorId: number;
    firstName: string;
    lastName: string;
    email: string;
}

const DonorList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<DonatedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedItemDetails, setSelectedItemDetails] = useState<DonatedItem | null>(null);

    const [assignProgramClicked, setAssignProgramClicked] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([
        {
            donorId: 811253,
            firstName: 'Jason',
            lastName: 'Todd',
            email: 'red@icloud.com',
        },
        {
            donorId: 811249,
            firstName: 'Selina',
            lastName: 'Kyle',
            email: 'cats@gmail.com',
        },
        {
            donorId: 811249,
            firstName: 'Kyle',
            lastName: 'James',
            email: 'kyle@hotmail.com',
        },
        {
            donorId: 811253,
            firstName: 'Wade',
            lastName: 'Zagoren',
            email: 'wade@cool.com',
        },
        {
            donorId: 811253,
            firstName: 'Mary',
            lastName: 'Cortesi',
            email: 'temp@email.com',
        },
    ]);
    const navigate = useNavigate();

    const handleSearch = () => {
        const filtered = donatedItems.filter(
            item =>
                item.donorId.toString().includes(searchInput) ||
                item.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.email.includes(searchInput)
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

    const handleAddNewDonationClick = () => {
        navigate('/donorform');
    };

    const handleViewDetailsClick = () => {
        navigate('/item');
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
                                placeholder="Search for donor"
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
                    </div>
                </div>

                <table className="item-list">
                    <thead>
                        <tr>
                            <th>Donor Number</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>More Details</th>
                            {assignProgramClicked && <th>Select</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredItems.length > 0
                            ? filteredItems
                            : donatedItems
                        ).map((item, index) => (
                            <tr key={item.donorId}>
                                <td>{item.donorId}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button onClick={() => handleViewDetailsClick()}>
                                        View More Details
                                     </button>
                                </td>

                                {assignProgramClicked && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.donorId,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(item.donorId)
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
                            <p>Donor ID: {selectedItemDetails.donorId}</p>
                            <p>Donor First Name: {selectedItemDetails.firstName}</p>
                            <p>Donor Last Name: {selectedItemDetails.lastName}</p>
                            <p>Donor Email: {selectedItemDetails.email}</p>
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

export default DonorList;