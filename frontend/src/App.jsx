import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ExplorePage from './pages/ExplorePage';
import CompanyIntelligencePage from './pages/CompanyIntelligencePage';
import styles from './App.module.css';

function App() {
    return (
        <Router>
            <div className={styles.app}>
                <header className={styles.header}>
                    <Link to="/" className={styles.logo}><h1>ApplyDash</h1></Link>
                    <nav className={styles.nav}>
                        <Link to="/">Dashboard</Link>
                        <Link to="/explore">Explore</Link>
                    </nav>
                </header>
                <main className={styles.mainContent}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/company/:id" element={<CompanyIntelligencePage />} /> 
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
export default App;