import React, { useState } from 'react';

const DataManagement = ({ habits, categories, setHabits, customSuggestedHabits, addCustomSuggestedHabit, removeCustomSuggestedHabit }) => {
  const [newSuggestedHabitName, setNewSuggestedHabitName] = useState('');
  const exportHabitsToJson = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'habits.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportHabitsToCsv = () => {
    if (habits.length === 0) {
      alert("No habits to export.");
      return;
    }

    const headers = ["id", "name", "description", "frequency", "isTimeBased", "targetDuration", "reminderTime", "category", "history", "notes"];
    const rows = habits.map(habit => {
      return headers.map(header => {
        if (header === "history" || header === "notes") {
          return JSON.stringify(habit[header]);
        } else if (header === "category") {
          const category = categories.find(cat => cat.id === habit.category);
          return category ? category.name : "";
        } else {
          return habit[header];
        }
      }).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "habits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importHabitsFromJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedHabits = JSON.parse(e.target.result);
          // Basic validation for imported habits structure
          if (Array.isArray(importedHabits) && importedHabits.every(h => h.id && h.name && h.history)) {
            setHabits(importedHabits);
            alert("Habits imported successfully!");
          } else {
            alert("Invalid JSON format for habits.");
          }
        } catch (error) {
          alert("Error parsing JSON file: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePrintReport = () => {
    const printContent = `
      <h1>Habit Report</h1>
      ${habits.map(habit => `
        <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
          <h2>${habit.name}</h2>
          <p><strong>Description:</strong> ${habit.description}</p>
          <p><strong>Frequency:</strong> ${habit.frequency}</p>
          <p><strong>Category:</strong> ${categories.find(cat => cat.id === habit.category)?.name || 'N/A'}</p>
          <h3>History:</h3>
          <ul>
            ${habit.history.map(entry => `<li>${new Date(entry.date).toLocaleDateString()}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Habit Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: sans-serif; margin: 20px; }
      h1 { color: #333; }
      h2 { color: #555; }
      ul { list-style: none; padding: 0; }
      li { margin-bottom: 5px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const addCustomSuggestedHabitHandler = () => {
    addCustomSuggestedHabit(newSuggestedHabitName);
    setNewSuggestedHabitName('');
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-primary text-white">
        <h3 className="mb-0">Data Management</h3>
      </div>
      <div className="card-body">
        <h4 className="mb-3">Export Habits</h4>
        <div className="d-grid gap-2 d-md-block mb-4">
          <button className="btn btn-primary me-md-2 mb-2 mb-md-0" onClick={exportHabitsToJson}>
            <i className="bi bi-file-earmark-arrow-down me-2"></i>Export to JSON
          </button>
          <button className="btn btn-primary me-md-2 mb-2 mb-md-0" onClick={exportHabitsToCsv}>
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>Export to CSV
          </button>
          <button className="btn btn-info" onClick={handlePrintReport}>
            <i className="bi bi-printer me-2"></i>Print Report
          </button>
        </div>

        <h4 className="mt-4 mb-3">Import Habits</h4>
        <div className="input-group mb-3">
          <input type="file" accept=".json" onChange={importHabitsFromJson} className="form-control" id="importJsonFile" />
          <label className="input-group-text" htmlFor="importJsonFile">Upload JSON</label>
        </div>
        <p className="text-muted">Importing habits will overwrite existing habits. Please back up your data first.</p>

        <h4 className="mt-4 mb-3">Custom Suggested Habits</h4>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new suggested habit (e.g., 'Go for a walk')"
            value={newSuggestedHabitName}
            onChange={(e) => setNewSuggestedHabitName(e.target.value)}
          />
          <button className="btn btn-success" onClick={addCustomSuggestedHabitHandler}>
            <i className="bi bi-plus-lg me-2"></i>Add
          </button>
        </div>
        <ul className="list-group">
          {customSuggestedHabits.map((habit, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {habit.name}
              <button className="btn btn-danger btn-sm" onClick={() => removeCustomSuggestedHabit(index)}>
                <i className="bi bi-trash me-2"></i>Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataManagement;
