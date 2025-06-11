import React, { useState, useEffect } from 'react';
import { STATUS_COLUMNS } from '../../constants/index';
import styles from './Modal.module.css'; // Use shared modal styles

const ApplicationModal = ({ isOpen, onClose, appData, onSave, onDelete }) => {
    const [editingApp, setEditingApp] = useState(appData);

    useEffect(() => {
        setEditingApp(appData); // Update form data when appData prop changes
    }, [appData]);

    if (!isOpen) return null;

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingApp(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editingApp);
    };

    const handleDeleteClick = async () => {
        if (editingApp.id) { // Only allow deleting existing applications
            const success = await onDelete(editingApp.id);
            if (success) {
                onClose(); // Close modal on successful delete
            }
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>{editingApp.id ? 'Edit Application' : 'Create Application'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={editingApp.companyName || ''}
                        onChange={handleFormChange}
                        required
                        disabled={!!editingApp.id} // Disable editing company name for existing apps
                    />
                    <label htmlFor="jobTitle">Job Title:</label>
                    <input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        placeholder="Job Title"
                        value={editingApp.jobTitle || ''}
                        onChange={handleFormChange}
                        required
                    />
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={editingApp.status || STATUS_COLUMNS[0]}
                        onChange={handleFormChange}
                        required
                    >
                        {STATUS_COLUMNS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="dateApplied">Date Applied:</label>
                            <input
                                id="dateApplied"
                                type="date"
                                name="dateApplied"
                                value={editingApp.dateApplied ? editingApp.dateApplied.split('T')[0] : ''} // Format for date input
                                onChange={handleFormChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="nextActionDate">Next Action Date:</label>
                            <input
                                id="nextActionDate"
                                type="date"
                                name="nextActionDate"
                                value={editingApp.nextActionDate ? editingApp.nextActionDate.split('T')[0] : ''} // Format for date input
                                onChange={handleFormChange}
                            />
                        </div>
                    </div>
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        placeholder="Notes..."
                        value={editingApp.notes || ''}
                        onChange={handleFormChange}
                    ></textarea>
                    <div className={styles.modalActions}>
                        {editingApp.id && ( // Only show delete button if it's an existing application
                            <button type="button" onClick={handleDeleteClick} className={styles.deleteButton}>
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;