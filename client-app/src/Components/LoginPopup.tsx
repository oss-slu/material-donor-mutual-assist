import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the context shape
interface PopupContextType {
    showPopup: boolean;
    message: string;
    triggerPopup: (message: string) => void;
}

// Create Context
const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Context Provider Component
export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        // Check localStorage if a popup should be shown
        const storedMessage = localStorage.getItem('popupMessage');
        if (storedMessage) {
            setMessage(storedMessage);
            setShowPopup(true);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                setShowPopup(false);
                localStorage.removeItem('popupMessage'); // Clear after showing
            }, 5000);
        }
    }, []);

    // Function to trigger popup globally
    const triggerPopup = (msg: string) => {
        setMessage(msg);
        setShowPopup(true);
        localStorage.setItem('popupMessage', msg); // Persist until shown
    };

    return (
        <PopupContext.Provider value={{ showPopup, message, triggerPopup }}>
            {children}

            {/* Global Popup */}
            {showPopup && <div className="popup">{message}</div>}
        </PopupContext.Provider>
    );
};

// Hook for using the popup in any component
export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};
