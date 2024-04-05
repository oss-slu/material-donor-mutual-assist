import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProgramsPage.css'; // Import your CSS file for styling

function ProgramsPage() {
    const [programs] = useState([
        {
            name: 'Youth Program',
            description: 'Empowering youth through education and skill development.',
            startDate: '2024-01-01',
            aimAndCause: 'To provide underprivileged youth with opportunities for growth and development.',
        },
        {
            name: 'Retail Sales',
            description: 'Generating revenue through the sale of donated items.',
            startDate: '2024-02-15',
            aimAndCause: 'To fund organizational programs and initiatives through retail sales.',
        },
        {
            name: 'Recycle',
            description: 'Promoting environmental sustainability through recycling initiatives.',
            startDate: '2024-03-10',
            aimAndCause: 'To reduce waste and preserve natural resources by encouraging recycling practices.',
        },
        {
            name: 'Earn-a-bicycle',
            description: 'Teaching bike repair skills to individuals in need.',
            startDate: '2024-04-05',
            aimAndCause: 'To provide transportation options to those who cannot afford them while promoting bicycle maintenance skills.',
        },
        {
            name: 'Earn-a-computer',
            description: 'Providing computers to individuals through skill-building programs.',
            startDate: '2024-05-20',
            aimAndCause: 'To bridge the digital divide by providing access to technology and computer literacy education.',
        },
    ]);

    return (
        <div className="programs-container">
            <h1>Programs Page</h1>
            <div className="program-list">
                {programs.map((program, index) => (
                    <div className="program-card" key={index}>
                        <h2>{program.name}</h2>
                        <p><strong>Description:</strong> {program.description}</p>
                        <p><strong>Start Date:</strong> {program.startDate}</p>
                        <p><strong>Aim and Cause:</strong> {program.aimAndCause}</p>
                        
                    </div>
                ))}
                <div className='program-card'>
                    <Link to="/addprogram" >
                        <button>Add Program</button>
                    </Link>  
                </div>
                 
               
                
                
            </div>
        </div>
    );
}

export default ProgramsPage;
