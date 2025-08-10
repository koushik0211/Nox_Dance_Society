
import React, { useState, useEffect, useMemo } from 'react';
import auditionService from '../services/auditionService';
import AuditionDetailModal from '../components/AuditionDetailModal';
import SchedulingModal from '../components/SchedulingModal';
import ReviewComparisonModal from '../components/ReviewComparisonModal';
import { 
    FaEye, 
    FaSpinner, 
    FaSearch, 
    FaFilter, 
    FaTrash, 
    FaBalanceScale, 
    FaClock, 
    FaListUl, 
    FaExclamationTriangle,
    FaFileExcel,
    FaWhatsapp, 
    FaEllipsisV 
} from 'react-icons/fa';
import { useIsMobile } from '../../hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import './ManagePages.css';

const ManageAuditionsPage = () => {
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAudition, setSelectedAudition] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [judgeName, setJudgeName] = useState(localStorage.getItem('judgeName') || '');
    const [viewMode, setViewMode] = useState('list');
    const [isExporting, setIsExporting] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isMobile = useIsMobile(992);

    const fetchAuditions = async () => {
        try { 
            setLoading(true); 
            const response = await auditionService.getAll(); 
            setAuditions(response.data); 
        } catch (err) { 
            setError("Failed to fetch audition entries."); 
            console.error("Fetch Auditions Error:", err);
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchAuditions(); 
    }, []);

    const handleJudgeNameChange = (e) => {
        setJudgeName(e.target.value);
        localStorage.setItem('judgeName', e.target.value);
    };
    
    const handleViewDetails = (audition) => {
        setSelectedAudition(audition);
        setIsDetailModalOpen(true);
    };

    const handleCompareReviews = (audition) => {
        setSelectedAudition(audition);
        setIsCompareModalOpen(true);
    };

    const handleDeleteEntry = async (id, name) => {
        // if (window.confirm(`Are you sure you want to delete the entire entry for ${name}?`)) {
            try {
                await auditionService.removeEntry(id);
                alert("Entry deleted successfully.");
                fetchAuditions(); 
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete entry.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        
    };

    const handleBulkDelete = async () => {
        const notSelectedCount = auditions.filter(a => a.status === 'Not Selected').length;
        if (notSelectedCount === 0) {
            alert("There are no candidates marked as 'Not Selected' to delete.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently delete all ${notSelectedCount} "Not Selected" entries?`)) {
            try {
                const response = await auditionService.removeNotSelected();
                alert(response.data.message || "Bulk delete successful.");
                fetchAuditions();
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to perform bulk delete.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await auditionService.exportToCsv();
        } catch (error) {
            alert(error.message || "Could not export data. There may be no slotted auditions.");
        } finally {
            setIsExporting(false);
        }
    };
    
    const formatPhoneNumberForWhatsApp = (phone) => {
        if (!phone) return null;
        let digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length === 10) { return `91${digitsOnly}`; }
        if (digitsOnly.length > 10) { return digitsOnly; }
        return null;
    };

    const processedAuditions = useMemo(() => {
        const filtered = auditions
            .filter(audition => statusFilter === 'All' || audition.status === statusFilter)
            .filter(audition => {
                const term = searchTerm.toLowerCase();
                return audition.fullName.toLowerCase().includes(term) || audition.rollNumber.toLowerCase().includes(term);
            });
        const groupedBySlot = filtered.reduce((acc, audition) => {
            const slot = audition.timeSlot || 'Unassigned';
            if (!acc[slot]) acc[slot] = [];
            acc[slot].push(audition);
            return acc;
        }, {});
        const sortedSlotKeys = Object.keys(groupedBySlot).sort((a, b) => {
            if (a === 'Unassigned') return 1;
            if (b === 'Unassigned') return -1;
            return a.localeCompare(b);
        });
        return { list: filtered, slots: groupedBySlot, sortedSlotKeys };
    }, [auditions, searchTerm, statusFilter]);

    const notSelectedCount = useMemo(() => auditions.filter(a => a.status === 'Not Selected').length, [auditions]);
    const hasSlottedAuditions = useMemo(() => auditions.some(a => a.timeSlot && a.timeSlot !== 'Unassigned'), [auditions]);

    if (loading) return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Audition Entries...</div>;

    const DesktopTable = ({ data }) => (
        <div className="manage-table-container">
            <table className="manage-table">
                <thead><tr><th>S.No.</th><th>Name</th><th>Roll Number</th><th>Time Slot</th><th>Status</th><th>Reviews</th><th>Actions</th></tr></thead>
                <tbody>
                    {data.length > 0 ? data.map((audition, index) => {
                        const whatsappNumber = formatPhoneNumberForWhatsApp(audition.phoneNumber);
                        return (
                            <tr key={audition._id}>
                                <td data-label="S.No.">{index + 1}</td>
                                <td data-label="Name">{audition.fullName}</td>
                                <td data-label="Roll No">{audition.rollNumber}</td>
                                <td data-label="Time Slot">{audition.timeSlot}</td>
                                <td data-label="Status"><span className={`status-badge ${audition.status.toLowerCase().replace(/\s+/g, '-')}`}>{audition.status}</span></td>
                                <td data-label="Reviews">{audition.reviews.length}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <button onClick={() => handleViewDetails(audition)} className="action-button view" title="View Details & Add Review"><FaEye /></button>
                                        <button onClick={() => handleCompareReviews(audition)} className="action-button compare" title="Compare Reviews" disabled={audition.reviews.length === 0}><FaBalanceScale /></button>
                                        {whatsappNumber && (<a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="action-button whatsapp" title={`Message on WhatsApp`}><FaWhatsapp /></a>)}
                                        <button onClick={() => handleDeleteEntry(audition._id, audition.fullName)} className="action-button delete" title="Delete Entry"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    }) : ( <tr><td colSpan="7" className="no-data-cell">No entries match criteria.</td></tr> )}
                </tbody>
            </table>
        </div>
    );

    const MobileCardList = ({ data }) => (
        <div className="mobile-audition-list">
            {data.length > 0 ? data.map((audition) => {
                const whatsappNumber = formatPhoneNumberForWhatsApp(audition.phoneNumber);
                return (
                    <div key={audition._id} className="audition-entry-card">
                        <div className="entry-card__main-info">
                            <span className="entry-card__name">{audition.fullName}</span>
                            <span className={`status-badge ${audition.status.toLowerCase().replace(/\s+/g, '-')}`}>{audition.status}</span>
                        </div>
                        <div className="entry-card__meta-info">
                            <span>Time Slot: <strong>{audition.timeSlot || 'Unassigned'}</strong></span>
                        </div>
                        <div className="entry-card__actions">
                             {whatsappNumber && (<a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="action-button whatsapp"><FaWhatsapp /> Message</a>)}
                             <button onClick={() => handleViewDetails(audition)} className="action-button view"><FaEye /> View Details</button>
                        </div>
                    </div>
                )
            }) : ( <p className="no-data-cell">No entries match your criteria.</p> )}
        </div>
    );

    const renderContent = (data) => {
        return isMobile ? <MobileCardList data={data} /> : <DesktopTable data={data} />;
    };
    
    const ActionButtons = ({ isDropdown = false }) => (
        <>
            <button onClick={() => { setIsScheduleModalOpen(true); setIsMobileMenuOpen(false); }} className={isDropdown ? "dropdown-action-button" : "action-button primary"}><FaClock /> Divide into Slots</button>
            <button onClick={() => { handleExport(); setIsMobileMenuOpen(false); }} className={isDropdown ? "dropdown-action-button" : "action-button secondary"} disabled={isExporting || !hasSlottedAuditions}>
                {isExporting ? <FaSpinner className="loading-spinner-inline" /> : <FaFileExcel />} Export to Excel
            </button>
            <button onClick={() => { handleBulkDelete(); setIsMobileMenuOpen(false); }} className={isDropdown ? "dropdown-action-button delete" : "action-button delete-all"} disabled={notSelectedCount === 0}>
                <FaExclamationTriangle /> Delete Not Selected
            </button>
            {/* {viewMode === 'slots' && !isMobile && (<button onClick={() => { handleRemoveSlotting(); setIsMobileMenuOpen(false); }} className="action-button secondary"><FaUndo /> Remove Slotting</button>)} */}
        </>
    );

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Audition Entries</h1>
                {isMobile ? (
                    <div className="mobile-actions-container">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mobile-actions-trigger"><FaEllipsisV /></button>
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div className="mobile-actions-dropdown" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                                    <ActionButtons isDropdown={true} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="header-actions"><ActionButtons /></div>
                )}
            </div>
            
            <div className="page-controls-bar">
                <div className="filters-container">
                    <div className="search-box"><FaSearch /><input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} /></div>
                    <div className="filter-box"><FaFilter /><select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}><option value="All">All</option><option value="Pending">Pending</option><option value="Selected">Selected</option><option value="Not Selected">Not Selected</option></select></div>
                </div>
                
                {/* Judge Input is now hidden on mobile */}
                {!isMobile && (
                    <div className="judge-name-input-container">
                        <label htmlFor="judgeName">Judge:</label>
                        <input type="text" id="judgeName" value={judgeName} onChange={handleJudgeNameChange} placeholder="Enter Name..." />
                    </div>
                )}

                {/* View Toggle is now ALWAYS visible */}
                <div className="view-toggle-buttons">
                    <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><FaListUl /> List</button>
                    <button onClick={() => setViewMode('slots')} className={viewMode === 'slots' ? 'active' : ''}><FaClock /> Slots</button>
                </div>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            {viewMode === 'list' ? renderContent(processedAuditions.list) : (
                <div className="slots-view-container">
                    {processedAuditions.sortedSlotKeys.map((slot, slotIndex) => (
                        <div key={slot} className="slot-group">
                            <h3 className="slot-group-title">
                                Slot {slotIndex + 1}: {slot} <span>({processedAuditions.slots[slot].length} candidates)</span>
                            </h3>
                            {renderContent(processedAuditions.slots[slot])}
                        </div>
                    ))}
                </div>
            )}

            {isDetailModalOpen && selectedAudition && ( <AuditionDetailModal isOpen={isDetailModalOpen} setIsOpen={setIsDetailModalOpen} audition={selectedAudition} onUpdate={() => { setIsDetailModalOpen(false); fetchAuditions(); }} judgeName={judgeName} /> )}
            {isCompareModalOpen && selectedAudition && ( <ReviewComparisonModal isOpen={isCompareModalOpen} setIsOpen={setIsCompareModalOpen} reviews={selectedAudition.reviews} candidateName={selectedAudition.fullName} /> )}
            <SchedulingModal isOpen={isScheduleModalOpen} setIsOpen={setIsScheduleModalOpen} onScheduleSuccess={() => { fetchAuditions(); setViewMode('slots'); }} />
        </div>
    );
};

export default ManageAuditionsPage;