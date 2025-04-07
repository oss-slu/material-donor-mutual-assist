import React from 'react';
import { useEffect, useState } from 'react';

interface Profile {
    id: string;
    name: string;
    email: string;
}

interface Donation {
    id: number;
    itemType: string;
    donorId: number;
    donatedAt: string;
}

const DonorDashboard = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You are not logged in.');
            setLoading(false);
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_API_BASE_URL}donor/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async res => {
                if (!res.ok) throw new Error('Failed to fetch dashboard data.');
                const data = await res.json();
                setProfile(data.profile);
                setDonations(data.donations);
            })
            .catch(err => {
                console.error('Dashboard fetch error:', err);
                setError('Failed to load your data. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading your dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!profile) return <p>No profile found.</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Welcome, {profile.name}</h2>
            <p>
                <strong>Email:</strong> {profile.email}
            </p>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Your Donations</h3>
            {donations.length === 0 ? (
                <p>You haven't made any donations yet.</p>
            ) : (
                <ul>
                    {donations.map(donation => (
                        <li key={donation.id}>
                            <strong> Id:</strong> {donation.id}
                            <strong>ItemType:</strong> {donation.itemType} |
                            <strong> donorId:</strong> {donation.donorId} |
                            {new Date(donation.donatedAt).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DonorDashboard;
