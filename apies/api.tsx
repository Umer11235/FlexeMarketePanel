import axios from 'axios';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  // baseURL: 'https://flexemart.com/api/',
  baseURL:API_BASE_URL+'/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiY2Y4ZjMyMzAtNjA1ZC00ZmVkLWI4N2EtYzE2MzllNGYwMWQzIiwiZW1haWwiOiJhaS5haHNhbmlzbWFpbEBnbWFpbC5jb20iLCJuYW1lIjoiRmxleGVtYXJrZXQiLCJwcm9maWxlIjoiMTczMjMwNDM1MzkzNl8xNi5qcGciLCJpc1ZlbmRvciI6IlRydWUiLCJpc1ZlcmlmaWVkIjoiRmFsc2UiLCJpc1Bob25lQ29uZmlybSI6IlRydWUiLCJpc0VtYWlsQ29uZmlybSI6IlRydWUiLCJSb2xlQ2xhaW0iOlsiSGFzUm9sZUFkZCIsIkhhc1JvbGVEZWxldGUiLCJIYXNSb2xlRWRpdCIsIkhhc1JvbGVWaWV3Il0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjozMzI5MjEzNTY2NSwiaXNzIjoiaHR0cHM6Ly9mbGV4ZW1hcnQuY29tLyIsImF1ZCI6Imh0dHBzOi8vZmxleGVtYXJrZXQuY29tLyJ9.tU6CsPZZ9P2rP8FP3Z-XUEqkHNUcxfzOKDbIyWfKbzE'; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralize error handling here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);


export default apiClient;
