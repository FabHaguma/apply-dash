import { useState, useEffect, useCallback } from 'react';
import { getApplications, createApplication, updateApplication } from '../services/api';

const useApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getApplications();
            setApplications(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const addApplication = useCallback(async (app) => {
        try {
            // Convert date strings to YYYY-MM-DD for backend if they are not empty
            const preparedApp = {
                ...app,
                dateApplied: app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : null,
                nextActionDate: app.nextActionDate ? new Date(app.nextActionDate).toISOString().split('T')[0] : null
            };
            const newApp = await createApplication(preparedApp);
            setApplications(prev => [...prev, newApp]);
            return newApp;
        } catch (err) {
            setError(err);
            throw err; // Re-throw to allow component to handle
        }
    }, []);

    const updateApplicationStatus = useCallback(async (applicationId, newStatus) => {
        try {
            const appToUpdate = applications.find(app => app.id == applicationId);
            if (!appToUpdate) throw new Error("Application not found for update.");

            const updatedApp = { ...appToUpdate, status: newStatus };
            const result = await updateApplication(applicationId, updatedApp);
            setApplications(prev => prev.map(app => (app.id === applicationId ? result : app)));
            return result;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [applications]); // Dependency on applications to find the correct appToUpdate

    const updateApplicationDetails = useCallback(async (applicationId, updatedFields) => {
        try {
            const appToUpdate = applications.find(app => app.id == applicationId);
            if (!appToUpdate) throw new Error("Application not found for update.");

            // Convert date strings to YYYY-MM-DD for backend if they are not empty
            const preparedFields = {
                ...updatedFields,
                dateApplied: updatedFields.dateApplied ? new Date(updatedFields.dateApplied).toISOString().split('T')[0] : null,
                nextActionDate: updatedFields.nextActionDate ? new Date(updatedFields.nextActionDate).toISOString().split('T')[0] : null
            };

            const result = await updateApplication(applicationId, { ...appToUpdate, ...preparedFields });
            setApplications(prev => prev.map(app => (app.id === applicationId ? result : app)));
            return result;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [applications]);

    const deleteApplication = useCallback(async (applicationId) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this application?");
            if (!confirmed) return false;

            await deleteApplication(applicationId);
            setApplications(prev => prev.filter(app => app.id !== applicationId));
            return true;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    return { applications, loading, error, fetchApplications, addApplication, updateApplicationStatus, updateApplicationDetails, deleteApplication };
};

export default useApplications;