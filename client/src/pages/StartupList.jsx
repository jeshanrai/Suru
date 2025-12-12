import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import StartupCard from '../components/StartupCard';
import { Search, Filter } from 'lucide-react';
import './StartupList.css';

// Simple Loading component
const Loading = () => (
    <div className="loading">
        <p>Loading startups...</p>
    </div>
);

const StartupList = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        location: ''
    });

    const observer = useRef();
    const lastStartupElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    useEffect(() => {
        // Reset to page 1 when filters change
        setPage(1);
        setStartups([]);
        setHasMore(true);
    }, [filters]);

    useEffect(() => {
        fetchStartups();
    }, [page, filters]);

    const fetchStartups = async () => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', 9);

            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.location) params.append('location', filters.location);

            const { data } = await api.get(`/startups?${params.toString()}`);

            if (page === 1) {
                setStartups(data.startups);
            } else {
                setStartups(prev => [...prev, ...data.startups]);
            }

            setHasMore(data.pagination.hasMore);
        } catch (error) {
            console.error('Error fetching startups:', error);
            if (page === 1) {
                setStartups([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
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
                <>
                    <div className="startups-grid">
                        {startups.map((startup, index) => {
                            if (startups.length === index + 1) {
                                return (
                                    <div ref={lastStartupElementRef} key={startup._id}>
                                        <StartupCard startup={startup} />
                                    </div>
                                );
                            } else {
                                return <StartupCard key={startup._id} startup={startup} />;
                            }
                        })}
                    </div>
                    {loadingMore && (
                        <div className="loading-more">
                            <p>Loading more startups...</p>
                        </div>
                    )}
                    {!hasMore && startups.length > 0 && (
                        <div className="no-more-results">
                            <p>You've reached the end!</p>
                        </div>
                    )}
                </>
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

