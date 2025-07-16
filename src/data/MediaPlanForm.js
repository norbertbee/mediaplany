// src/components/MediaPlanForm.js

import React, { useEffect, useState } from "react";
import { benchmarkData } from "../data/mediaData";

function MediaPlanForm({ formData, setFormData, onSubmit }) {
  const [availableFormats, setAvailableFormats] = useState([]);
  const industries = Object.keys(benchmarkData);

  // Efekt, który aktualizuje listę dostępnych formatów po zmianie branży
  useEffect(() => {
    if (formData.industry && benchmarkData[formData.industry]) {
      setAvailableFormats(benchmarkData[formData.industry]);
    } else {
      setAvailableFormats([]);
    }
    // Resetuj wybrane formaty przy zmianie branży
    setFormData((prev) => ({ ...prev, selectedFormats: [] }));
  }, [formData.industry, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const selectedFormats = new Set(prev.selectedFormats);
      if (checked) {
        selectedFormats.add(value);
      } else {
        selectedFormats.delete(value);
      }
      return { ...prev, selectedFormats: [...selectedFormats] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="media-plan-form">
      <div className="form-group">
        <label htmlFor="industry">1. Wybierz branżę (dostosuje dostępne formaty i stawki):</label>
        <select id="industry" name="industry" value={formData.industry} onChange={handleInputChange} required>
          <option value="" disabled>-- Wybierz --</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="budget">2. Wpisz całkowity budżet mediowy (PLN):</label>
        <input
          id="budget"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleInputChange}
          min="100"
          required
        />
      </div>

      {formData.industry && (
        <div className="form-group">
          <label>3. Wybierz formaty reklamowe dla branży "{formData.industry}":</label>
          <div className="channels-container">
            {availableFormats.length > 0 ? (
              availableFormats.map((format) => (
                <div key={format.name} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={format.name}
                    value={format.name}
                    onChange={handleCheckboxChange}
                    checked={formData.selectedFormats.includes(format.name)}
                  />
                  <label htmlFor={format.name}>
                    {format.name}
                  </label>
                </div>
              ))
            ) : (
              <p>Brak dostępnych formatów dla tej branży.</p>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={!formData.industry || formData.selectedFormats.length === 0}>
        🚀 Generuj Media Plan
      </button>
    </form>
  );
}

export default MediaPlanForm;
