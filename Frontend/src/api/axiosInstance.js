import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v1` // <-- Ganti dengan API URL
});

// Tambah interceptors
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = true;
  }
  return config;
});

export default axiosInstance;
