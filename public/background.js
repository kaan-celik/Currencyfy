import api from "../src/popup/api/api";
import { DEC, INC } from "../src/popup/constants";
import utils from "../src/popup/utils";
if (utils.isExtensionMode()) {
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

const createAlarm = (currency, threshold, rate) => {
  if (!currency || !threshold || !rate) return;
  try {
    const data = api.getLatestRates();
    const currentRate = 1 / data.rates[currency];
    const diffPercent = (rate - currentRate) / currentRate;
    const message = diffPercent < 0 ? DEC : INC;
    if (Math.abs(diffPercent) > threshold) {
      chrome.notifications.create({
        type: "basic",
        title: "Currency Alert",
        message: `${currency} ${message} ${Math.abs(
          diffPercent
        )}%! Current rate: ${rate.toFixed(2)}`,
      });
    }
  } catch (error) {
    console.error("Alarm created an error:", error);
  }
};
