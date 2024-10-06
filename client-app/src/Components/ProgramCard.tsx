import React from 'react';
import '../css/ProgramCard.css';

interface ProgramProps {
    program: {
        id: number;
        name: string;
        description: string;
        startDate: string;
        aimAndCause: string;
    };
}

const ProgramCard: React.FC<ProgramProps> = ({ program }) => {
    // Function to format date and remove time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)
    };

    return (
        <div className="program-card">
            <h2>{program.name}</h2>
            <p>
                <strong>Description:</strong> {program.description}
            </p>
            <p>
                <strong>Start Date:</strong> {formatDate(program.startDate)}
            </p>
            <p>
                <strong>Aim and Cause:</strong> {program.aimAndCause}
            </p>
        </div>
    );
};

export default ProgramCard;
