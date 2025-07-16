// src/App.js

import React, { useState, useCallback } from "react";
import MediaPlanForm from "./components/MediaPlanForm";
import MediaPlanDisplay from "./components/MediaPlanDisplay";
import { benchmarkData } from "./data/mediaData";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    industry: "",
    budget: 10000,
    selectedFormats: [],
  });
  const [mediaPlan, setMediaPlan] = useState(null);

  const generateMediaPlan = useCallback(() => {
    const { industry, budget, selectedFormats } = formData;

    if (!industry || selectedFormats.length === 0) {
      alert("Proszę wybrać branżę i przynajmniej jeden format reklamowy.");
      return;
    }

    const availableFormatsForIndustry = benchmarkData[industry];
    if (!availableFormatsForIndustry) {
        alert("Brak danych dla wybranej branży.");
        return;
    }

    const budgetPerFormat = budget / selectedFormats.length;

    const planItems = selectedFormats.map(formatName => {
      const formatDetails = availableFormatsForIndustry.find(f => f.name === formatName);
      if (!formatDetails) return null; // Zabezpieczenie

      let estimatedResult = 0;
      const { costModel, avgCost } = formatDetails;

      if (avgCost > 0) {
        switch (costModel) {
          case "CPM": // Koszt za 1000 wyświetleń
            estimatedResult = (budgetPerFormat / avgCost); // Wynik jest już w tysiącach
            break;
          case "CPC": // Koszt za kliknięcie
          case "CPA": // Koszt za akcję
          case "CPV": // Koszt za obejrzenie
          case "CPL": // Koszt za polubienie
          case "CPE": // Koszt za interakcję
            estimatedResult = budgetPerFormat / avgCost;
            break;
          default:
            estimatedResult = 0;
        }
      }
      
      return {
        // Zmieniono 'channel' na 'industry' dla zgodności
        channel: industry, 
        format: formatDetails.name,
        costModel: costModel,
        kpi: formatDetails.kpi,
        budget: budgetPerFormat,
        estimatedResult,
      };
    }).filter(Boolean); // Usuń ewentualne nulle

    setMediaPlan({
      totalBudget: parseFloat(budget),
      items: planItems,
    });

  }, [formData]);

  return (
    <div className="app-container">
      <header>
        <h1>Generator Media Planu (v2.0)</h1>
        <p>Wprowadź założenia, aby wygenerować plan oparty na realnych benchmarkach.</p>
      </header>
      <main>
        <MediaPlanForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={generateMediaPlan}
        />
        {/* Przekazujemy teraz cały obiekt planu, a branżę bierzemy z niego */}
        {mediaPlan && <MediaPlanDisplay plan={mediaPlan} />}
      </main>
      <footer>
        <p>Aplikacja demonstracyjna. Dane pochodzą z dostarczonego pliku.</p>
      </footer>
    </div>
  );
}

export default App;
