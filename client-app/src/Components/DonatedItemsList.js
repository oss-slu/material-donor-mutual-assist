import React from 'react';
import { Link } from 'react-router-dom';
import '../css/DonatedItemsList.css';

function DonatedItemsList() {
  // Sample data for demonstration
  const donatedItems = [
    { id: 811253, name: 'Bicycle', donor: 'Mary', date: '2024-02-25', status: 'Donated' },
    { id: 811249, name: 'Computer', donor: 'James', date: '2024-02-06', status: 'In Storage Facility' },
    { id: 811247, name: 'Computer', donor: 'Vivian', date: '2024-01-26', status: 'Refurbished' },
    { id: 811246, name: 'Bicycle', donor: 'Elizabeth', date: '2024-01-21', status: 'Item Sold' },
    { id: 811240, name: 'Bicycle', donor: 'Peter', date: '2024-01-13', status: 'Received' }
    // Add more items here...
  ];

  return (
    <table className="item-list">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Item_ID</th>
          <th>Item_Name</th>
          <th>Donor Name</th>
          <th>Donation Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {donatedItems.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td><Link to={`/item/${item.id}`} state={{ itemInfo: item }}>{item.id}</Link></td>
            <td>{item.name}</td>
            <td>{item.donor}</td>
            <td>{item.date}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DonatedItemsList;