const isExtensionMode = () => {
     return typeof chrome !== 'undefined' && chrome.storage;
}

if (isExtensionMode()) {
  chrome.alarms.create("checkRates", { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get(
      ["currency", "threshold", "rate"],
      async ({ currency, threshold, rate }) => {
        createAlarm(currency, threshold, rate);
      }
    );
  });
}

const getLatestRates = async () => {
  const APP_ID = '';
  const query = `latest?api_key=${APP_ID}`;
  const baseURL = `https://api.fxfeed.io/v1/`;
  const response = await fetch(baseURL+query);
  return await response.json();
}

const createAlarm = (currency, threshold, rate) => {
  if (!currency || !threshold || !rate) return;
  try {
    const data = getLatestRates();
    const currentRate = 1 / data.rates[currency];
    const diffPercent = (rate - currentRate) / currentRate;
    const message = diffPercent < 0 ? 'Decreased by' : 'Increased by';
    const iconUrl = diffPercent < 0 ? "icons/dec.png" : "icons/inc.png";
    if (Math.abs(diffPercent) > threshold) {
      chrome.notifications.create({
        type: "basic",
        title: "Currency Alert",
        iconUrl: iconUrl,
        message: `${currency} ${message} ${Math.abs(
          diffPercent
        )}%! Current rate: ${rate.toFixed(2)}`,
      });
    }
  } catch (error) {
    console.error("Alarm created an error:", error);
  }
};
