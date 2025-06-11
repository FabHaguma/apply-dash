import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyById, updateCompany, getApplications } from '../services/api';
import styles from './CompanyIntelligencePage.module.css';

const CompanyIntelligencePage = () => {
    const { id } = useParams(); // Get company ID from URL
    const [company, setCompany] = useState(null);
    const [applications, setApplications] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        vibes: '',
        techStack: '',
        hiringBar: '',
        interviewNotes: '',
        isInteresting: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const companyData = await getCompanyById(id);
            setCompany(companyData);
            setFormData({ // Populate form with existing data
                vibes: companyData.vibes || '',
                techStack: companyData.techStack || '',
                hiringBar: companyData.hiringBar || '',
                interviewNotes: companyData.interviewNotes || '',
                isInteresting: companyData.isInteresting || false
            });

            const allApps = await getApplications();
            const companyApps = allApps.filter(app => app.companyId == id);
            setApplications(companyApps);
        };
        fetchData();
    }, [id]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveIntelligence = async () => {
        await updateCompany(id, formData);
        setCompany(prev => ({ ...prev, ...formData })); // Update local state immediately
        setEditMode(false);
    };

    const handleTellAFriend = () => {
        if (!company) return;

        const subject = encodeURIComponent(`Job Opportunity at ${company.companyName}`);
        const body = encodeURIComponent(
            `Hey! I came across ${company.companyName} and thought it might be a good fit for you.\n\n` +
            (formData.vibes ? `They seem to have a "${formData.vibes}" vibe.\n` : '') +
            (formData.techStack ? `Their tech stack includes: ${formData.techStack}.\n` : '') +
            `\nHere's their website: ${company.websiteUrl}\n\n` +
            "Good luck!"
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    if (!company) {
        return <div className={styles.loading}>Loading company details...</div>;
    }

    return (
        <div className={styles.companyPageContainer}>
            <div className={styles.companyHeader}>
                <h2>{company.companyName}</h2>
                <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">Visit Website</a>
                <p>{company.hqCountry} - {company.whatTheyDo}</p>
                <button onClick={handleTellAFriend} className={styles.tellAFriendButton}>Tell a Friend</button>
            </div>

            <div className={styles.intelligenceSection}>
                <h3>Your Intelligence</h3>
                {!editMode ? (
                    <div className={styles.intelligenceDisplay}>
                        <p><strong>Vibes:</strong> {company.vibes || 'N/A'}</p>
                        <p><strong>Tech Stack:</strong> {company.techStack || 'N/A'}</p>
                        <p><strong>Hiring Bar:</strong> {company.hiringBar || 'N/A'}</p>
                        <p><strong>Interview Notes:</strong> {company.interviewNotes || 'N/A'}</p>
                        <p><strong>Interesting:</strong> {company.isInteresting ? 'Yes' : 'No'}</p>
                        <button onClick={() => setEditMode(true)} className={styles.editIntelButton}>Edit Intelligence</button>
                    </div>
                ) : (
                    <div className={styles.intelligenceForm}>
                        <label>Vibes:</label>
                        <textarea name="vibes" value={formData.vibes} onChange={handleFormChange}></textarea>
                        <label>Tech Stack:</label>
                        <textarea name="techStack" value={formData.techStack} onChange={handleFormChange}></textarea>
                        <label>Hiring Bar:</label>
                        <input type="text" name="hiringBar" value={formData.hiringBar} onChange={handleFormChange} />
                        <label>Interview Notes:</label>
                        <textarea name="interviewNotes" value={formData.interviewNotes} onChange={handleFormChange}></textarea>
                        <label>
                            <input type="checkbox" name="isInteresting" checked={formData.isInteresting} onChange={handleFormChange} />
                            Mark as Interesting
                        </label>
                        <div className={styles.formActions}>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                            <button onClick={handleSaveIntelligence}>Save</button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.applicationHistory}>
                <h3>Application History</h3>
                {applications.length > 0 ? (
                    <ul className={styles.appHistoryList}>
                        {applications.map(app => (
                            <li key={app.id}>
                                <strong>{app.jobTitle}</strong> ({app.status})
                                {app.dateApplied && ` - Applied: ${new Date(app.dateApplied).toLocaleDateString()}`}
                                {app.nextActionDate && ` - Next Action: ${new Date(app.nextActionDate).toLocaleDateString()}`}
                                {app.notes && <p>Notes: {app.notes}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No applications tracked for this company yet.</p>
                )}
            </div>
        </div>
    );
};

export default CompanyIntelligencePage;