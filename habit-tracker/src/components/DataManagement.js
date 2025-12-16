import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DataManagement = ({ habits, categories, setHabits, customSuggestedHabits, addCustomSuggestedHabit, removeCustomSuggestedHabit, theme }) => {
  const [newSuggestedHabitName, setNewSuggestedHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const isDark = theme === 'dark';

  // --- Helper: Resolve Category Name (Handles IDs and Legacy Strings) ---
  const getCategoryName = (habitCategory) => {
    if (typeof habitCategory === 'number') {
      const cat = categories.find(c => c.id === habitCategory);
      return cat ? cat.name : 'Uncategorized';
    } 
    // Fallback for legacy string categories
    const cat = categories.find(c => c.name === habitCategory);
    return cat ? cat.name : 'Uncategorized';
  };

  // --- Filter Logic ---
  const getFilteredData = () => {
    return habits.filter(habit => {
      // 1. Category Filter
      if (selectedCategory !== 'All') {
        const targetCat = categories.find(c => c.name === selectedCategory);
        if (!targetCat) return false;
        
        // Match against ID or Name (for legacy compatibility)
        const isMatch = (habit.category === targetCat.id) || (habit.category === targetCat.name);
        if (!isMatch) return false;
      }
      return true;
    }).map(habit => {
      // 2. Date Range Filter (on History)
      const filteredHistory = habit.history.filter(entry => {
        if (!entry.date) return false;
        const entryDate = new Date(entry.date);
        entryDate.setHours(0,0,0,0);

        if (dateRange.start) {
            const start = new Date(dateRange.start);
            start.setHours(0,0,0,0);
            if (entryDate < start) return false;
        }
        if (dateRange.end) {
            const end = new Date(dateRange.end);
            end.setHours(0,0,0,0);
            if (entryDate > end) return false;
        }
        return true;
      });
      return { ...habit, history: filteredHistory };
    });
  };

  // --- Export Functions ---
  const exportHabitsToJson = () => {
    const data = getFilteredData();
    // Prepare data with resolved category names for clarity in JSON
    const cleanData = data.map(h => ({
        ...h,
        categoryName: getCategoryName(h.category)
    }));

    const dataStr = JSON.stringify(cleanData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `habits_export_${new Date().toISOString().slice(0,10)}.json`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportHabitsToCsv = () => {
    const data = getFilteredData();
    if (data.length === 0) {
      alert("No habits found matching your filters.");
      return;
    }

    const headers = ["Name", "Category", "Description", "Frequency", "Target", "Completions (Selected Period)", "History Dates"];
    const rows = data.map(habit => {
      const catName = getCategoryName(habit.category);
      const historyDates = habit.history.map(h => h.date).join('; ');
      const totalCompletions = habit.history.reduce((sum, h) => sum + h.completions, 0);

      return [
        `"${habit.name}"`,
        `"${catName}"`,
        `"${habit.description}"`,
        `"${habit.frequency}"`,
        habit.targetCompletions,
        totalCompletions,
        `"${historyDates}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `habits_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const data = getFilteredData();
    if (data.length === 0) {
        alert("No data available to export.");
        return;
    }

    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("Habit Tracker Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, 14, 28);
    
    let filterText = `Category: ${selectedCategory}`;
    if (dateRange.start || dateRange.end) {
        filterText += ` | Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'Present'}`;
    }
    doc.text(filterText, 14, 34);

    // -- Table Data Preparation --
    const tableColumn = ["Habit Name", "Category", "Frequency", "Target", "Completions", "Success Rate"];
    
    // sorting by Category for grouping
    data.sort((a, b) => {
        const catA = getCategoryName(a.category);
        const catB = getCategoryName(b.category);
        return catA.localeCompare(catB);
    });

    const tableRows = [];
    let currentCategory = null;

    data.forEach(habit => {
        const catName = getCategoryName(habit.category);
        const completions = habit.history.reduce((sum, e) => sum + (e.completions || 0), 0);
        
        // Group Header Row logic
        if (catName !== currentCategory) {
            tableRows.push([{ content: catName.toUpperCase(), colSpan: 6, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [50,50,50] } }]);
            currentCategory = catName;
        }

        // Calculate rate
        const entriesCount = habit.history.length;
        const successRate = entriesCount > 0 
            ? Math.round((completions / (entriesCount * habit.targetCompletions)) * 100) + '%' 
            : '0%';

        const row = [
            habit.name,
            catName,
            habit.frequency,
            habit.targetCompletions,
            completions,
            successRate
        ];
        tableRows.push(row);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [13, 110, 253] }, // Bootstrap Primary
        styles: { fontSize: 9 },
        // Custom styling for group headers is handled in tableRows data
    });

    doc.save(`habit_report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const handlePrintReport = () => {
     // Re-use logic or just redirect to PDF as it's better? 
     // Let's make Print View open the PDF in new tab or keep existing logic but filtered.
     exportToPDF(); // PDF is print-ready, simpler to unify.
  };

  const addCustomSuggestedHabitHandler = () => {
    if (!newSuggestedHabitName.trim()) return;
    addCustomSuggestedHabit(newSuggestedHabitName);
    setNewSuggestedHabitName('');
  };

  return (
    <div className={`data-management-container fade-in ${isDark ? 'text-white' : ''}`}>
      
      {/* Header Section */}
      <div className="mb-5">
        <h2 className={`fw-bold mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>Data Control</h2>
        <p className="text-muted">Manage your data, export reports, and customize your experience.</p>
      </div>

      <div className="row g-4">
        
        {/* Export & Reports Card */}
        <div className="col-lg-6">
           <div className="modern-card p-4 rounded-4 h-100 position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-3 opacity-10">
                  <i className="bi bi-file-earmark-text display-1 text-primary"></i>
              </div>

              <div className="d-flex align-items-center mb-4 position-relative z-1">
                 <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                    <i className="bi bi-cloud-download-fill fs-5"></i>
                 </div>
                 <h5 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Export & Reports</h5>
              </div>
              
              {/* --- Filters --- */}
              <div className="bg-light bg-opacity-50 p-3 rounded-3 mb-4 border z-1 position-relative">
                  <span className="text-uppercase fw-bold text-muted small-tracking mb-2 d-block" style={{fontSize: '0.7rem'}}>Filter Data</span>
                  <div className="row g-2">
                      <div className="col-12">
                          <select 
                            className="form-select form-select-sm border-0 shadow-sm"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                          >
                              <option value="All">All Categories</option>
                              {categories.map(c => (
                                  <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                          </select>
                      </div>
                      <div className="col-6">
                          <input 
                            type="date" 
                            className="form-control form-control-sm border-0 shadow-sm text-secondary" 
                            placeholder="Start Date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                          />
                      </div>
                      <div className="col-6">
                           <input 
                            type="date" 
                            className="form-control form-control-sm border-0 shadow-sm text-secondary" 
                            placeholder="End Date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                          />
                      </div>
                  </div>
              </div>

              {/* --- Actions --- */}
              <div className="d-flex flex-column gap-2 position-relative z-1">
                <button 
                  className="btn btn-primary d-flex align-items-center justify-content-center py-2.5 rounded-3 fw-bold shadow-sm"
                  onClick={exportToPDF}
                >
                   <i className="bi bi-file-earmark-pdf me-2"></i> Export as PDF
                </button>

                <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2 rounded-3 fw-medium flex-fill"
                      onClick={exportHabitsToJson}
                      style={{ fontSize: '0.9rem' }}
                    >
                       <i className="bi bi-filetype-json me-2"></i> JSON
                    </button>
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center py-2 rounded-3 fw-medium flex-fill"
                      onClick={exportHabitsToCsv}
                      style={{ fontSize: '0.9rem' }}
                    >
                        <i className="bi bi-filetype-csv me-2"></i> CSV
                    </button>
                </div>
              </div>
           </div>
        </div>

        {/* Templates Card */}
        <div className="col-lg-6">
            <div className="modern-card p-4 rounded-4 h-100 position-relative overflow-hidden">
                 <div className="position-absolute top-0 end-0 p-3 opacity-10">
                    <i className="bi bi-stars display-1 text-success"></i>
                 </div>

              <div className="d-flex align-items-center mb-4 position-relative z-1">
                 <div className="icon-box bg-success bg-opacity-10 text-success rounded-circle p-2 me-3">
                    <i className="bi bi-magic fs-5"></i>
                 </div>
                 <div>
                    <h5 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Smart Templates</h5>
                    <p className="text-muted small mb-0">Save your favorite habits for one-click reuse.</p>
                 </div>
              </div>

              <div className="d-flex flex-column gap-3 position-relative z-1">
                 <div className="bg-light bg-opacity-50 p-3 rounded-3 border">
                    <span className="text-uppercase fw-bold text-muted small-tracking mb-2 d-block" style={{fontSize: '0.7rem'}}>Create New Template</span>
                    <div className="d-flex flex-column gap-2">
                         <input
                           type="text"
                           className="form-control form-control-sm border-0 shadow-sm"
                           placeholder="Habit Name (e.g. 'Read 10 pages')"
                           value={newSuggestedHabitName}
                           onChange={(e) => setNewSuggestedHabitName(e.target.value)}
                         />
                         <div className="d-flex gap-2">
                             {/* Note: Simplified category selection for templates - defaults to first or Uncategorized if simpler, 
                                 but let's try to pass ID if possible. For now, just name string to keep it compatible with App.js 
                                 addCustomSuggestedHabit logic which might expect just a name or handled internally. 
                                 Wait, App.js addCustomSuggestedHabit only takes name. 
                                 We will just make the input look better for now. 
                                 To fully support categories in templates, App.js needs refactor.
                                 Let's stick to Name for now but make it look great.
                             */}
                             <button 
                                className="btn btn-success btn-sm fw-bold w-100 shadow-sm d-flex align-items-center justify-content-center" 
                                onClick={addCustomSuggestedHabitHandler}
                                disabled={!newSuggestedHabitName.trim()}
                             >
                                <i className="bi bi-plus-lg me-1"></i> Save Template
                             </button>
                         </div>
                    </div>
                 </div>
                 
                 <div className="flex-grow-1">
                    <label className="text-uppercase fw-bold text-muted small-tracking mb-2 d-block" style={{fontSize: '0.7rem'}}>Your Library</label>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                       {customSuggestedHabits.length > 0 ? (
                           customSuggestedHabits.map((habit, index) => (
                             <div key={index} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-white border shadow-sm animate-slide-in group-hover-action">
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                                        <i className="bi bi-check" style={{fontSize: '1rem'}}></i>
                                    </div>
                                    <span className="text-dark fw-medium text-truncate">{habit.name}</span>
                                </div>
                                <button 
                                  className="btn btn-link p-0 text-danger opacity-50 hover-opacity-100"
                                  onClick={() => removeCustomSuggestedHabit(index)}
                                  title="Delete Template"
                                >
                                   <i className="bi bi-trash"></i>
                                </button>
                             </div>
                           ))
                       ) : (
                           <div className="text-center py-4 text-muted border border-dashed rounded-3">
                               <i className="bi bi-inbox fs-4 d-block mb-1 opacity-50"></i>
                               <span className="small">No templates saved yet.</span>
                           </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DataManagement;

