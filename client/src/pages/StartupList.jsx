import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import StartupCard from '../components/StartupCard';
import { Search, Filter } from 'lucide-react';
import './StartupList.css';
import Loading from '../components/Loading';

const StartupList = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: ''
    });

    useEffect(() => {
        fetchStartups();
    }, [filters]);

    const fetchStartups = async () => {
        setLoading(true); // Ensure loading shows every time fetch starts
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.location) params.append('location', filters.location);

            const { data } = await api.get(`/startups?${params.toString()}`);
            setStartups(data);
        } catch (error) {
            console.error('Error fetching startups:', error);
            setStartups([]); // Clear startups if error occurs
        } finally {
            setLoading(false); // Stop loading after fetch completes
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container page-container">
            <div className="filters-section card">
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search startups..."
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-group">
                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="">All Categories</option>
                        <option value="Tech">Tech</option>
                        <option value="Ecommerce">Ecommerce</option>
                        <option value="Health">Health</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                    </select>
                    <select name="location" value={filters.location} onChange={handleFilterChange}>
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        <option value="New York">New York</option>
                        <option value="San Francisco">San Francisco</option>
                        <option value="London">London</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <Loading />
            ) : startups.length > 0 ? (
                <div className="startups-grid">
                    {startups.map((startup) => (
                        <StartupCard key={startup._id} startup={startup} />
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <h3>No startups found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

export default StartupList;
