import React, { useState, useEffect } from 'react';
import { getCompanies, createApplication } from '../services/api';
import styles from './ExplorePage.module.css';

const ExplorePage = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAllCompanies = async () => {
            const data = await getCompanies({ search });
            setCompanies(data);
        };
        fetchAllCompanies();
    }, [search]);
    
    const handleAddToTrack = async (company) => {
        const newApp = {
            companyId: company.id,
            companyName: company.companyName,
            jobTitle: "To Be Determined", // Default value
            status: "Will Apply"
        };
        await createApplication(newApp);
        alert(`${company.companyName} has been added to your 'Will Apply' list!`);
    };

    return (
        <div className={styles.exploreContainer}>
            <h2>Explore Companies</h2>
            <input
                type="text"
                placeholder="Search by name, tech stack, or description..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <table className={styles.companyTable}>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Country</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id}>
                            <td>
                                <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    {company.companyName}
                                </a>
                            </td>
                            <td>{company.hqCountry}</td>
                            <td>{company.whatTheyDo}</td>
                            <td>
                                <button onClick={() => handleAddToTrack(company)}>+</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExplorePage;