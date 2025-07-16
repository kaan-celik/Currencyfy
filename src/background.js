import api from "./popup/api/api";
import { DEC, INC } from "./popup/constants";
chrome.alarms.create('checkRates', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(['currency', 'threshold'], async ({ currency, threshold }) => {
    if (!currency || !threshold) return;
    try {
      const data = api.getLatestRates()
      const rate = 1 / data.rates[currency];
      const previous = 27;  //TODO: must be dynamic
      const diffPercent = (rate - previous) / previous;
      const message = diffPercent < 0 ? DEC : INC;
      if (Math.abs(diffPercent) > threshold) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Currency Alert',
          message: `${currency} ${message} ${Math.abs(diffPercent)}%! Current rate: ${rate.toFixed(2)}`
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  });
});
