
// frontend/src/admin/pages/ManageAuditionsPage.js


// import React, { useState, useEffect, useMemo } from 'react';
// import auditionService from '../services/auditionService';
// import AuditionDetailModal from '../components/AuditionDetailModal';
// import SchedulingModal from '../components/SchedulingModal';
// import ReviewComparisonModal from '../components/ReviewComparisonModal';
// import { FaEye, FaSpinner, FaSearch, FaFilter, FaTrash, FaBalanceScale, FaClock, FaListUl, FaUndo, FaExclamationTriangle } from 'react-icons/fa';
// import './ManagePages.css';

// const ManageAuditionsPage = () => {
//     const [auditions, setAuditions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedAudition, setSelectedAudition] = useState(null);
//     const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//     const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
//     const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [judgeName, setJudgeName] = useState(localStorage.getItem('judgeName') || '');
    
//     const [viewMode, setViewMode] = useState('list'); // 'list' or 'slots'

//     const fetchAuditions = async () => {
//         try { 
//             setLoading(true); 
//             const response = await auditionService.getAll(); 
//             setAuditions(response.data); 
//         } catch (err) { 
//             setError("Failed to fetch audition entries."); 
//             console.error("Fetch Auditions Error:", err);
//         } finally { 
//             setLoading(false); 
//         }
//     };

//     useEffect(() => { 
//         fetchAuditions(); 
//     }, []);

//     const handleJudgeNameChange = (e) => {
//         setJudgeName(e.target.value);
//         localStorage.setItem('judgeName', e.target.value);
//     };
    
//     const handleViewDetails = (audition) => {
//         setSelectedAudition(audition);
//         setIsDetailModalOpen(true);
//     };

//     const handleCompareReviews = (audition) => {
//         setSelectedAudition(audition);
//         setIsCompareModalOpen(true);
//     };

//     const handleDeleteEntry = async (id, name) => {
//         if (window.confirm(`Are you sure you want to delete the entire entry for ${name}? This action cannot be undone.`)) {
//             try {
//                 await auditionService.removeEntry(id);
//                 alert("Entry deleted successfully.");
//                 fetchAuditions(); 
//             } catch (err) {
//                 const errorMessage = err.response?.data?.message || "Failed to delete entry.";
//                 setError(errorMessage);
//                 alert(`Error: ${errorMessage}`);
//             }
//         }
//     };
    
//     const handleBulkDelete = async () => {
//         const notSelectedCount = auditions.filter(a => a.status === 'Not Selected').length;
//         if (notSelectedCount === 0) {
//             alert("There are no candidates marked as 'Not Selected' to delete.");
//             return;
//         }

//         if (window.confirm(`Are you sure you want to permanently delete all ${notSelectedCount} "Not Selected" entries? This action cannot be undone.`)) {
//             try {
//                 const response = await auditionService.removeNotSelected();
//                 alert(response.data.message || "Bulk delete successful.");
//                 fetchAuditions();
//             } catch (err) {
//                 const errorMessage = err.response?.data?.message || "Failed to perform bulk delete.";
//                 setError(errorMessage);
//                 alert(`Error: ${errorMessage}`);
//             }
//         }
//     };

//     const handleRemoveSlotting = async () => {
//         if (window.confirm("Are you sure you want to remove all time slot assignments for pending candidates? This will require a backend feature to fully reset.")) {
//             // Note: This currently only switches the view. A full implementation would require a backend endpoint.
//             alert("Slot view removed. Displaying as a list.");
//             setViewMode('list');
//         }
//     };

//     const processedAuditions = useMemo(() => {
//         const filtered = auditions
//             .filter(audition => statusFilter === 'All' || audition.status === statusFilter)
//             .filter(audition => {
//                 const term = searchTerm.toLowerCase();
//                 return audition.fullName.toLowerCase().includes(term) || audition.rollNumber.toLowerCase().includes(term);
//             });

//         const groupedBySlot = filtered.reduce((acc, audition) => {
//             const slot = audition.timeSlot || 'Unassigned';
//             if (!acc[slot]) {
//                 acc[slot] = [];
//             }
//             acc[slot].push(audition);
//             return acc;
//         }, {});
        
//         const sortedSlotKeys = Object.keys(groupedBySlot).sort((a, b) => {
//             if (a === 'Unassigned') return 1;
//             if (b === 'Unassigned') return -1;
//             return a.localeCompare(b);
//         });

//         return { list: filtered, slots: groupedBySlot, sortedSlotKeys };

//     }, [auditions, searchTerm, statusFilter]);

//     const notSelectedCount = useMemo(() => auditions.filter(a => a.status === 'Not Selected').length, [auditions]);

//     if (loading) return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Audition Entries...</div>;

//     return (
//         <div className="manage-page">
//             <div className="manage-page-header">
//                 <h1>Audition Entries</h1>
//                 <div className="header-actions">
//                     <button onClick={() => setIsScheduleModalOpen(true)} className="action-button primary">
//                         <FaClock /> Divide into Slots
//                     </button>
//                     <button 
//                         onClick={handleBulkDelete} 
//                         className="action-button delete-all"
//                         disabled={notSelectedCount === 0}
//                         title={notSelectedCount > 0 ? `Delete ${notSelectedCount} 'Not Selected' entries` : 'No entries to delete'}
//                     >
//                         <FaExclamationTriangle /> Delete Not Selected
//                     </button>
//                     {viewMode === 'slots' && (
//                         <button onClick={handleRemoveSlotting} className="action-button secondary">
//                             <FaUndo /> Remove Slotting
//                         </button>
//                     )}
//                     <div className="judge-name-input-container">
//                         <label htmlFor="judgeName">Judge:</label>
//                         <input type="text" id="judgeName" value={judgeName} onChange={handleJudgeNameChange} placeholder="Enter Name..." />
//                     </div>
//                 </div>
//             </div>
            
//             <div className="filters-container">
//                 <div className="search-box">
//                     <FaSearch />
//                     <input type="text" placeholder="Search by Name or Roll No..." onChange={(e) => setSearchTerm(e.target.value)} />
//                 </div>
//                 <div className="filter-box">
//                     <FaFilter />
//                     <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
//                         <option value="All">All Statuses</option>
//                         <option value="Pending">Pending</option>
//                         <option value="Selected">Selected</option>
//                         <option value="Not Selected">Not Selected</option>
//                     </select>
//                 </div>
//                 <div className="view-toggle-buttons">
//                     <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><FaListUl /> List View</button>
//                     <button onClick={() => setViewMode('slots')} className={viewMode === 'slots' ? 'active' : ''}><FaClock /> Slot View</button>
//                 </div>
//             </div>
            
//             {error && <p className="admin-error-message">{error}</p>}
            
//             {viewMode === 'list' ? (
//                 <div className="manage-table-container">
//                     <table className="manage-table">
//                         <thead><tr><th>S.No.</th><th>Name</th><th>Roll Number</th><th>Time Slot</th><th>Status</th><th>Reviews</th><th>Actions</th></tr></thead>
//                         <tbody>
//                             {processedAuditions.list.length > 0 ? processedAuditions.list.map((audition, index) => (
//                                 <tr key={audition._id}>
//                                     <td data-label="S.No.">{index + 1}</td>
//                                     <td data-label="Name">{audition.fullName}</td>
//                                     <td data-label="Roll No">{audition.rollNumber}</td>
//                                     <td data-label="Time Slot">{audition.timeSlot}</td>
//                                     <td data-label="Status"><span className={`status-badge ${audition.status.toLowerCase().replace(/\s+/g, '-')}`}>{audition.status}</span></td>
//                                     <td data-label="Reviews">{audition.reviews.length}</td>
//                                     <td data-label="Actions">
//                                         <div className="action-buttons">
//                                             <button onClick={() => handleViewDetails(audition)} className="action-button view" title="View Details & Add Review"><FaEye /></button>
//                                             <button onClick={() => handleCompareReviews(audition)} className="action-button compare" title="Compare Reviews" disabled={audition.reviews.length === 0}><FaBalanceScale /></button>
//                                             <button onClick={() => handleDeleteEntry(audition._id, audition.fullName)} className="action-button delete" title="Delete Entry"><FaTrash /></button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr><td colSpan="7" className="no-data-cell">No entries match your criteria.</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div className="slots-view-container">
//                     {processedAuditions.sortedSlotKeys.map((slot, slotIndex) => (
//                         <div key={slot} className="slot-group">
//                             <h3 className="slot-group-title">
//                                 Slot {slotIndex + 1}: {slot} <span>({processedAuditions.slots[slot].length} candidates)</span>
//                             </h3>
//                             <div className="manage-table-container">
//                                 <table className="manage-table">
//                                      <thead><tr><th>S.No.</th><th>Name</th><th>Roll Number</th><th>Status</th><th>Reviews</th><th>Actions</th></tr></thead>
//                                      <tbody>
//                                          {processedAuditions.slots[slot].map((audition, candIndex) => (
//                                             <tr key={audition._id}>
//                                                 <td data-label="S.No.">{candIndex + 1}</td>
//                                                 <td data-label="Name">{audition.fullName}</td>
//                                                 <td data-label="Roll No">{audition.rollNumber}</td>
//                                                 <td data-label="Status"><span className={`status-badge ${audition.status.toLowerCase().replace(/\s+/g, '-')}`}>{audition.status}</span></td>
//                                                 <td data-label="Reviews">{audition.reviews.length}</td>
//                                                 <td data-label="Actions">
//                                                     <div className="action-buttons">
//                                                         <button onClick={() => handleViewDetails(audition)} className="action-button view"><FaEye /></button>
//                                                         <button onClick={() => handleCompareReviews(audition)} className="action-button compare" disabled={audition.reviews.length === 0}><FaBalanceScale /></button>
//                                                         <button onClick={() => handleDeleteEntry(audition._id, audition.fullName)} className="action-button delete"><FaTrash /></button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                          ))}
//                                      </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {isDetailModalOpen && selectedAudition && ( <AuditionDetailModal isOpen={isDetailModalOpen} setIsOpen={setIsDetailModalOpen} audition={selectedAudition} onUpdate={() => { setIsDetailModalOpen(false); fetchAuditions(); }} judgeName={judgeName} /> )}
//             {isCompareModalOpen && selectedAudition && ( <ReviewComparisonModal isOpen={isCompareModalOpen} setIsOpen={setIsCompareModalOpen} reviews={selectedAudition.reviews} candidateName={selectedAudition.fullName} /> )}
//             <SchedulingModal isOpen={isScheduleModalOpen} setIsOpen={setIsScheduleModalOpen} onScheduleSuccess={() => { fetchAuditions(); setViewMode('slots'); }} />
//         </div>
//     );
// };

// export default ManageAuditionsPage;



// frontend/src/admin/pages/ManageAuditionsPage.js
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
    FaFileExcel 
} from 'react-icons/fa';
import './ManagePages.css';

const ManageAuditionsPage = () => {
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAudition, setSelectedAudition] = useState(null);
    
    // State for modals
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    // State for UI controls
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [judgeName, setJudgeName] = useState(localStorage.getItem('judgeName') || '');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'slots'
    const [isExporting, setIsExporting] = useState(false);

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
        if (window.confirm(`Are you sure you want to delete the entire entry for ${name}? This action cannot be undone.`)) {
            try {
                await auditionService.removeEntry(id);
                alert("Entry deleted successfully.");
                fetchAuditions(); 
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete entry.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    const handleBulkDelete = async () => {
        const notSelectedCount = auditions.filter(a => a.status === 'Not Selected').length;
        if (notSelectedCount === 0) {
            alert("There are no candidates marked as 'Not Selected' to delete.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently delete all ${notSelectedCount} "Not Selected" entries? This action cannot be undone.`)) {
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

    // const handleRemoveSlotting = async () => {
    //     if (window.confirm("This only switches the view. A full reset requires a backend implementation. Continue?")) {
    //         setViewMode('list');
    //     }
    // };

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

    const renderTable = (data) => (
        <div className="manage-table-container">
            <table className="manage-table">
                <thead><tr><th>S.No.</th><th>Name</th><th>Roll Number</th><th>Time Slot</th><th>Status</th><th>Reviews</th><th>Actions</th></tr></thead>
                <tbody>
                    {data.length > 0 ? data.map((audition, index) => (
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
                                    <button onClick={() => handleDeleteEntry(audition._id, audition.fullName)} className="action-button delete" title="Delete Entry"><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="no-data-cell">No entries match your criteria.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Audition Entries</h1>
                <div className="header-actions">
                    <button onClick={() => setIsScheduleModalOpen(true)} className="action-button primary"><FaClock /> Divide into Slots</button>
                    <button onClick={handleExport} className="action-button secondary" disabled={isExporting || !hasSlottedAuditions} title={hasSlottedAuditions ? "Export slotted auditions to CSV" : "No slotted auditions to export"}>
                        {isExporting ? <FaSpinner className="loading-spinner-inline" /> : <FaFileExcel />} Export to Excel
                    </button>
                    <button onClick={handleBulkDelete} className="action-button delete-all" disabled={notSelectedCount === 0} title={notSelectedCount > 0 ? `Delete ${notSelectedCount} 'Not Selected' entries` : 'No entries to delete'}>
                        <FaExclamationTriangle /> Delete Not Selected
                    </button>
                    {/* {viewMode === 'slots' && (<button onClick={handleRemoveSlotting} className="action-button secondary"><FaUndo /> Remove Slotting</button>)} */}
                    <div className="judge-name-input-container">
                        <label htmlFor="judgeName">Judge:</label>
                        <input type="text" id="judgeName" value={judgeName} onChange={handleJudgeNameChange} placeholder="Enter Name..." />
                    </div>
                </div>
            </div>
            
            <div className="filters-container">
                <div className="search-box"><FaSearch /><input type="text" placeholder="Search by Name or Roll No..." onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="filter-box"><FaFilter /><select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}><option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Selected">Selected</option><option value="Not Selected">Not Selected</option></select></div>
                <div className="view-toggle-buttons">
                    <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><FaListUl /> List View</button>
                    <button onClick={() => setViewMode('slots')} className={viewMode === 'slots' ? 'active' : ''}><FaClock /> Slot View</button>
                </div>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            {viewMode === 'list' ? renderTable(processedAuditions.list) : (
                <div className="slots-view-container">
                    {processedAuditions.sortedSlotKeys.map((slot, slotIndex) => (
                        <div key={slot} className="slot-group">
                            <h3 className="slot-group-title">
                                Slot {slotIndex + 1}: {slot} <span>({processedAuditions.slots[slot].length} candidates)</span>
                            </h3>
                            {renderTable(processedAuditions.slots[slot])}
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