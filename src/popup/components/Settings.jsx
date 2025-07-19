import React, { useState, useEffect } from "react";
import { Currencies } from "../constants";
import utils from "../utils";
import api from "../api/api";
import { Button, TextField, MenuItem } from "@mui/material";

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

  const Spacer = ({ size = 16 }) => <div style={{ width: size }} />;
  return (
    <div className="settings">
      <TextField
          id="outlined-select-currency"
          select
          label="Currency"
          size = 'small'
          sx={{ m: 1 }}
          defaultValue={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >{Currencies.map((option,idx) => (
            <MenuItem key={idx} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
      <TextField id="outlined-basic" size = 'small' sx={{ m: 1 }} label="Threshold (%)" variant="outlined" type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)}/>
      <Spacer size={10} />
      <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={handleSave}>Save Alarm</Button>
      {saved && <span>✅ Saved!</span>}
    </div>
  );
}
