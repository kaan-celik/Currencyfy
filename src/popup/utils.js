 import dayjs from 'dayjs';

 const getDates = () => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(7, 'day');
    return {start: startDate, end: endDate};
  }

  const isExtensionMode = () => {
     return typeof chrome !== 'undefined' && chrome.storage;
  }

  export default {
    getDates,
    isExtensionMode
  }