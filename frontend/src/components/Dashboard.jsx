import React, { useState } from 'react'; // useEffect no longer directly needed
import { getRandomSuggestion } from '../services/api'; // createApplication only for suggestion
import { Link } from 'react-router-dom';
import ApplicationModal from './modals/ApplicationModal';
import SuggestionModal from './modals/SuggestionModal';
import useApplications from '../hooks/useApplications';
import { STATUS_COLUMNS } from '../constants/index';
import styles from './Dashboard.module.css';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ApplicationCard = ({ application, onEdit }) => {
    const isOverdue = application.nextActionDate && new Date(application.nextActionDate) < new Date();
    const cardClass = `${styles.card} ${isOverdue ? styles.overdue : ''}`;

    return (
        <div className={cardClass} draggable="true" id={application.id} onDragStart={e => e.dataTransfer.setData('applicationId', application.id)}>
            <h4>{application.jobTitle}</h4>
            <Link to={`/company/${application.companyId}`} className={styles.companyLink}>
                <p>{application.companyName}</p>
            </Link>
            {application.nextActionDate && (
                <p className={styles.nextActionDate}>Next action: {formatDate(application.nextActionDate)}</p>
            )}
            <button onClick={() => onEdit(application)} className={styles.editButton}>Edit</button>
        </div>
    );
};

const Dashboard = () => {
    const { applications, loading, error, addApplication, updateApplicationStatus, updateApplicationDetails, removeApplication  } = useApplications(); // Use the hook

    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [suggestion, setSuggestion] = useState(null);

    const handleOnDrop = async (e, status) => {
        const applicationId = e.dataTransfer.getData('applicationId');
        await updateApplicationStatus(applicationId, status); // Use hook function
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleOpenApplicationModal = (app = null) => {
        setEditingApp(app ? app : { 
            companyName: '', 
            jobTitle: '', 
            status: 'Will Apply', 
            notes: '', 
            dateApplied: '', 
            nextActionDate: '' 
        });
        setIsApplicationModalOpen(true);
    };

    const handleCloseApplicationModal = () => {
        setIsApplicationModalOpen(false);
        setEditingApp(null);
    };

    const handleSaveApplication = async (appToSave) => {
        if (appToSave.id) {
            await updateApplicationDetails(appToSave.id, appToSave); // Use hook function
        } else {
            await addApplication(appToSave); // Use hook function
        }
        handleCloseApplicationModal();
    };

    const handleGetSuggestion = async () => {
        const suggestedCompany = await getRandomSuggestion();
        setSuggestion(suggestedCompany);
    };

    const handleDismissSuggestion = () => {
        setSuggestion(null);
    };

    const handleTrackSuggestion = async () => {
        if (!suggestion) return;
        const newApp = {
            companyId: suggestion.id,
            companyName: suggestion.companyName,
            jobTitle: "To Be Determined",
            status: "Will Apply",
            dateApplied: new Date().toISOString().split('T')[0]
        };
        await addApplication(newApp); // Use hook function
        setSuggestion(null);
        alert(`${suggestion.companyName} added to 'Will Apply'!`);
    };

    if (loading) return <div className={styles.loading}>Loading applications...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    return (
        <div>
            <button onClick={() => handleOpenApplicationModal()} className={styles.addButton}>+ Add Application</button>
            <button onClick={handleGetSuggestion} className={styles.suggestButton}>Suggest a Company!</button>
            <div className={styles.board}>
                {STATUS_COLUMNS.map(status => (
                    <div
                        key={status}
                        className={styles.column}
                        onDrop={(e) => handleOnDrop(e, status)}
                        onDragOver={handleDragOver}
                    >
                        <h3>{status}</h3>
                        {applications
                            .filter(app => app.status === status)
                            .map(app => <ApplicationCard key={app.id} application={app} onEdit={handleOpenApplicationModal} />)
                        }
                    </div>
                ))}
            </div>

            <SuggestionModal
                suggestionData={suggestion}
                onDismiss={handleDismissSuggestion}
                onTrack={handleTrackSuggestion}
            />

            {isApplicationModalOpen && (
                <ApplicationModal
                    isOpen={isApplicationModalOpen}
                    onClose={handleCloseApplicationModal}
                    appData={editingApp}
                    onSave={handleSaveApplication}
                    onDelete={removeApplication}
                />
            )}
        </div>
    );
};

export default Dashboard;