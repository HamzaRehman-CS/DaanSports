export const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL)
  ? process.env.REACT_APP_BACKEND_URL
  : "https://daan-sports-98ol.vercel.app";
