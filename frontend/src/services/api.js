import { API_BASE_URL } from '../constants/index';

export const getApplications = async () => {
    const response = await fetch(`${API_BASE_URL}/applications`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
};

export const createApplication = async (application) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
    });
    if (!response.ok) throw new Error('Failed to create application');
    return response.json();
};

export const updateApplication = async (id, application) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
    });
    if (!response.ok) throw new Error('Failed to update application');
    return response.json();
};

export const getCompanies = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/companies?${query}`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
};

export const getRandomSuggestion = async () => {
    const response = await fetch(`${API_BASE_URL}/companies/random-suggestion`);
    if (response.status === 204) return null; // No content
    if (!response.ok) throw new Error('Failed to fetch suggestion');
    return response.json();
};

export const updateCompany = async (id, companyData) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json();
};

export const getCompanyById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch company by ID');
    return response.json();
};


export const deleteApplication = async (id) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
    });
    // No response body expected, just check status
    if (!response.ok) throw new Error('Failed to delete application');
    return true; // Indicate success
};