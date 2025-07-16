import api from "./popup/api/api";
import { APP_ID, Currencies } from "./popup/constants";
chrome.alarms.create('checkRates', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(['currency', 'threshold'], async ({ currency, threshold }) => {
    if (!currency || !threshold) return;
    try {
      const data = api.getLatestRates()
      const rate = 1 / data.rates[currency];
      // Basit eşik kontrolü
      const previous = 27;  // burada basit sabit
      const diffPercent = Math.abs(rate - previous) / previous * 100;

      if (diffPercent > threshold) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Currency Alert',
          message: `${currency} moved > ${threshold}%! Current rate: ${rate.toFixed(2)}`
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  });
});
