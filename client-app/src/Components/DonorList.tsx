/*import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';

// Define types for the item and status enums
interface Donor {
    donorId: number;
    firstName: string;
    lastName: string;
    email: string;
}

const DonorList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
    const [donorDetails, selectedDonorDetails] = useState<Donor | null>(null);

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [currentDonors, setCurrentDonors] = useState<Donor[]>([
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
        const filtered = currentDonors.filter(
            item =>
                item.donorId.toString().includes(searchInput) ||
                item.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.email.includes(searchInput)
        );
        setFilteredDonors(filtered);
    };

    const handleSort = (event: ChangeEvent<HTMLSelectElement>) => {
        // Sorting logic can go here
        console.log('Sorting by:', event.target.value);
    };

    const handleAddNewDonorClick = () => {
        navigate('/donorform');
    };

    const handleViewDetailsClick = (donor: Donor) => {
        selectedDonorDetails(donor);
        setModalIsOpen(true);
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
                            <th>Donor ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>More Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredDonors.length > 0
                            ? filteredDonors
                            : currentDonors
                        ).map((donor, index) => (
                            <tr key={donor.donorId}>
                                <td>{donor.donorId}</td>
                                <td>{donor.firstName}</td>
                                <td>{donor.lastName}</td>
                                <td>{donor.email}</td>
                                <td>
                                <button onClick={() => handleViewDetailsClick(donor)}>
                                    View More Details
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                >
                    <h2>Details</h2>
                    {donorDetails && (
                        <div>
                            <p>Donor ID: {donorDetails.donorId}</p>
                            <p>Donor First Name: {donorDetails.firstName}</p>
                            <p>Donor Last Name: {donorDetails.lastName}</p>
                            <p>Donor Email: {donorDetails.email}</p>
                        </div>
                    )}
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </Modal>
                <div
                    style={{ position: 'fixed', bottom: '20px', right: '20px' }}
                >
                    <button onClick={() => handleAddNewDonorClick()}>
                        <FaPlus size={24} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default DonorList; */

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';
import '../css/AdminHeader.css';
import '../css/DonatedItemsList.css';

interface Donor {
    donorId: number;
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipcode: string;
    emailOptIn: boolean;
}

const DonorList: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
    const [donorDetails, selectedDonorDetails] = useState<Donor | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [currentDonors, setCurrentDonors] = useState<Donor[]>([]); // initially empty array
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch donor data from the backend API
        const fetchDonors = async () => {
            try {
                const response = await axios.get<Donor[]>(
                    //`${process.env.REACT_APP_BACKEND_API_BASE_URL}/donor`
                    'http://localhost:5000/donor'
                );
                setCurrentDonors(response.data); // Set the fetched data
            } catch (err) {
                //console.error('Error fetching donor data:', err.response ? err.response.data : err.message);
                console.error('Error fetching donors:', err);
                setError('Error fetching donor data');
            }
        };
        fetchDonors();
    }, []);

    const handleSearch = () => {
        const filtered = currentDonors.filter(
            item =>
                item.donorId.toString().includes(searchInput) ||
                item.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.email.includes(searchInput)
        );
        setFilteredDonors(filtered);
    };

    const handleAddNewDonorClick = () => {
        navigate('/donorform');
    };

    const handleViewDetailsClick = (donor: Donor) => {
        selectedDonorDetails(donor);
        setModalIsOpen(true);
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
                <div className="options">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for donor"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <table className="item-list">
                <thead>
                    <tr>
                        <th>Donor ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>More Details</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredDonors.length > 0 ? filteredDonors : currentDonors).map((donor, index) => (
                        <tr key={donor.donorId}>
                            <td>{donor.donorId}</td>
                            <td>{donor.firstName}</td>
                            <td>{donor.lastName}</td>
                            <td>{donor.email}</td>
                            <td>
                                <button onClick={() => handleViewDetailsClick(donor)}>
                                    View More Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>Details</h2>
                {donorDetails && (
                    <div>
                        <p>Donor ID: {donorDetails.donorId}</p>
                        <p>Donor First Name: {donorDetails.firstName}</p>
                        <p>Donor Last Name: {donorDetails.lastName}</p>
                        <p>Donor Email: {donorDetails.email}</p>
                        <p>Contact Number: {donorDetails.contact}</p>
                        <p>Address Line 1: {donorDetails.addressLine1}</p>
                        <p>Address Line 2: {donorDetails.addressLine2}</p>
                        <p>City: {donorDetails.city}</p>
                        <p>State: {donorDetails.state}</p>
                        <p>Zipcode: {donorDetails.zipcode}</p>
                        <p>Opted in for Emails: {donorDetails.emailOptIn}</p>
                    </div>
                )}
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>

            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <button onClick={() => handleAddNewDonorClick()}>
                    <FaPlus size={24} />
                </button>
            </div>
        </div>
    );
};

export default DonorList;