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
    return (
        <div className="program-card">
            <h2>{program.name}</h2>
            <p>
                <strong>Description:</strong> {program.description}
            </p>
            <p>
                <strong>Start Date:</strong> {program.startDate}
            </p>
            <p>
                <strong>Aim and Cause:</strong> {program.aimAndCause}
            </p>
        </div>
    );
};

export default ProgramCard;
