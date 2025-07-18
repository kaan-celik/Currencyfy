import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './popup/components/Header';
import CurrencyChart from './popup/components/CurrencyChart';
import Settings from './popup/components/Settings';
import './popup/styles/popup.css';
import {defaultExcCurrency, defaultThreshold}  from './popup/constants';
import utils from './popup/utils';
import api from './popup/api/api';

function App() {
  const [currency, setCurrency] = useState(defaultExcCurrency);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchData();
  }, [currency]);

  const fetchData = async () => {
    try {
      const date = utils.getDates();
      const data = api.getMonthlyRates(date);
      setChartData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <Settings
        currency={currency}
        setCurrency={setCurrency}
        threshold={threshold}
        setThreshold={setThreshold}
      />
      <CurrencyChart data={chartData} currency={currency} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
