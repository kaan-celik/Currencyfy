import React, { useState, useEffect } from "react";
import { Currencies } from "../constants";
import utils from "../utils";
import api from "../api/api";

export default function Settings({
  currency,
  setCurrency,
  threshold,
  setThreshold,
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (utils.isExtensionMode()) {
      chrome.storage.local.get(["currency", "threshold", "rate"], (result) => {
        if (result.currency) setCurrency(result.currency);
        if (result.threshold) setThreshold(result.threshold);
      });
    }
  }, []);

  const handleSave = () => {
    if (utils.isExtensionMode()) {
      chrome.local.storage.clear(() => {
        const response = api.getLatestRates();
        let rate = response.rates[currency];
        chrome.storage.local.set(
          { currency: currency, threshold: threshold, rate: rate },
          () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }
        );
      });
    }
  };

  return (
    <div className="settings">
      <label>
        Currency:
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Currencies.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label>
        Threshold (%):
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Save Alarm</button>
      {saved && <span>✅ Saved!</span>}
    </div>
  );
}
