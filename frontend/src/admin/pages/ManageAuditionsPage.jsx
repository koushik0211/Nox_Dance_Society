// frontend/src/admin/pages/ManageAuditionsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import auditionService from '../services/auditionService';
import AuditionDetailModal from '../components/AuditionDetailModal';
import ReviewComparisonModal from '../components/ReviewComparisonModal'; // Import the comparison modal
import { FaEye, FaSpinner, FaSearch, FaFilter, FaTrash, FaBalanceScale } from 'react-icons/fa'; // Added FaBalanceScale
import './ManagePages.css';

const ManageAuditionsPage = () => {
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAudition, setSelectedAudition] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // NEW: State for the comparison modal
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [judgeName, setJudgeName] = useState(localStorage.getItem('judgeName') || '');

    const fetchAuditions = async () => {
        try { setLoading(true); const response = await auditionService.getAll(); setAuditions(response.data); } 
        catch (err) { setError("Failed to fetch audition entries."); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAuditions(); }, []);

    const handleJudgeNameChange = (e) => {
        setJudgeName(e.target.value);
        localStorage.setItem('judgeName', e.target.value);
    };
    
    // This handler now only opens the detailed view/review form modal
    const handleViewDetails = (audition) => {
        setSelectedAudition(audition);
        setIsDetailModalOpen(true);
    };

    // NEW: Handler to open the comparison modal
    const handleCompareReviews = (audition) => {
        setSelectedAudition(audition);
        setIsCompareModalOpen(true);
    };

    const handleDeleteEntry = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the entire entry for ${name}?`)) {
            try {
                await auditionService.removeEntry(id); // Assumes removeEntry exists in your service
                alert("Entry deleted successfully.");
                fetchAuditions(); 
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete entry.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    const filteredAuditions = useMemo(() => {
        return auditions
            .filter(audition => statusFilter === 'All' || audition.status === statusFilter)
            .filter(audition => {
                const term = searchTerm.toLowerCase();
                return audition.fullName.toLowerCase().includes(term) || audition.rollNumber.toLowerCase().includes(term);
            });
    }, [auditions, searchTerm, statusFilter]);

    if (loading) return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Audition Entries...</div>;

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Audition Entries</h1>
                <div className="judge-name-input-container">
                    <label htmlFor="judgeName">Your Judge Name:</label>
                    <input 
                        type="text" 
                        id="judgeName"
                        value={judgeName}
                        onChange={handleJudgeNameChange}
                        placeholder="Enter your name to review"
                    />
                </div>
            </div>
            
            <div className="filters-container">
                <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search by Name or Roll No..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-box">
                    <FaFilter />
                    <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Selected">Selected</option>
                        <option value="Not Selected">Not Selected</option>
                    </select>
                </div>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            <div className="manage-table-container">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Name</th><th>Roll Number</th><th>Status</th><th>Reviews</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAuditions.length > 0 ? filteredAuditions.map((audition, index) => (
                            <tr key={audition._id}>
                                <td data-label="S.No.">{index + 1}</td>
                                <td data-label="Name">{audition.fullName}</td>
                                <td data-label="Roll No">{audition.rollNumber}</td>
                                <td data-label="Status">
                                    <span className={`status-badge ${audition.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {audition.status}
                                    </span>
                                </td>
                                <td data-label="Reviews">{audition.reviews.length}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <button onClick={() => handleViewDetails(audition)} className="action-button view" title="View Details & Add Review">
                                            <FaEye />
                                        </button>
                                        {/* NEW: Compare Reviews Button */}
                                        <button 
                                            onClick={() => handleCompareReviews(audition)} 
                                            className="action-button compare" 
                                            title="Compare Reviews"
                                            disabled={audition.reviews.length === 0}
                                        >
                                            <FaBalanceScale />
                                        </button>
                                        <button onClick={() => handleDeleteEntry(audition._id, audition.fullName)} className="action-button delete" title="Delete Entry">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="no-data-cell">No entries match your criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing details AND adding a review */}
            {isDetailModalOpen && selectedAudition && (
                <AuditionDetailModal 
                    isOpen={isDetailModalOpen}
                    setIsOpen={setIsDetailModalOpen}
                    audition={selectedAudition}
                    onUpdate={() => { 
                        setIsDetailModalOpen(false); 
                        fetchAuditions();      
                    }}
                    judgeName={judgeName}
                />
            )}

            {/* NEW: Modal for comparing all reviews for the selected candidate */}
            {isCompareModalOpen && selectedAudition && (
                <ReviewComparisonModal
                    isOpen={isCompareModalOpen}
                    setIsOpen={setIsCompareModalOpen}
                    reviews={selectedAudition.reviews}
                    candidateName={selectedAudition.fullName}
                />
            )}
        </div>
    );
};

export default ManageAuditionsPage;