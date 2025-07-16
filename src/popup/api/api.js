import { APP_ID, baseCurrency, Currencies } from "../constants";
import networkUtils from "./networkUtils"

const getMonthlyRates = (date) => {
    const query = `timeseries?api_key=${APP_ID}&start_date=${date.start.format('YYYY-MM-DD')}&end_date=${date.end.format('YYYY-MM-DD')}&base=${baseCurrency}&symbols=${Currencies.join(',')}`
    return networkUtils.handleRequest(query);
}

const getLatestRates = () => {
    const query = `latest?api_key=${APP_ID}`;
    return networkUtils.handleRequest(query);
}

export default {
    getMonthlyRates,
    getLatestRates
}