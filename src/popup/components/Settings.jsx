import React, { useState, useEffect } from 'react';
import { Currencies } from '../constants';
import utils from '../utils';

export default function Settings({ currency, setCurrency, threshold, setThreshold}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (utils.isExtensionMode()) {
      chrome.storage.local.get(['currency', 'threshold'], (result) => {
        if (result.currency) setCurrency(result.currency);
        if (result.threshold) setThreshold(result.threshold);
      });
    }
  }, []);

  const handleSave = () => {
    if (utils.isExtensionMode()) {
      chrome.storage.local.set({ currency, threshold }, () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1000);
      });
    }
  };

  return (
    <div className="settings">
      <label>
        Currency:
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Currencies.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
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
      <button onClick={handleSave}>Save</button>
      {saved && <span>✅ Saved!</span>}
    </div>
  );
}
