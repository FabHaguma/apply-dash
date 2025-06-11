import React from 'react';
import styles from './Modal.module.css'; // Use shared modal styles

const SuggestionModal = ({ suggestionData, onDismiss, onTrack }) => {
    if (!suggestionData) return null; // Only render if data exists

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>Suggestion</h2>
                <h3>{suggestionData.companyName}</h3>
                <p><strong>Country:</strong> {suggestionData.hqCountry}</p>
                <p>{suggestionData.whatTheyDo}</p>
                <a href={suggestionData.websiteUrl} target="_blank" rel="noopener noreferrer">Visit Website</a>
                <div className={styles.modalActions}>
                    <button type="button" onClick={onDismiss}>Dismiss</button>
                    <button type="button" onClick={onTrack}>Track It</button>
                </div>
            </div>
        </div>
    );
};

export default SuggestionModal;