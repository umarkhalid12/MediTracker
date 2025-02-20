import React, { useState } from 'react';
import Medicationaction from './Medicationaction'; // Import Medicationaction component

const ParentComponent = () => {
    const [medicationStatus, setMedicationStatus] = useState({});

    const handleUpdateStatus = (docId, status) => {
        // Handle the status update logic
        setMedicationStatus((prevState) => ({
            ...prevState,
            [docId]: status,
        }));
    };

    return (
        <Medicationaction
            onUpdate={handleUpdateStatus} // Pass the function here
        />
    );
};

export default ParentComponent;
