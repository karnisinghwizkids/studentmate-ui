import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.29.253:3000/',
  baseURL: 'https://gurukul-sm-api-995034495677.asia-south1.run.app',
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjIsInN0dWRlbnRDbGFzcyI6Niwic3R1ZGVudExldmVsIjoiTDYiLCJndXJ1a3VsVHlwZSI6IkcyIiwiaWF0IjoxNzQxNDI2ODEyLCJleHAiOjE3NDE1MTMyMTJ9.MvR09Cmn7kNp7HKvAR1a2a8E_J6k0mnLSoN2i3qSSkE',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    }
    throw error?.response?.data?.message || new Error('An error occurred while fetching data');
  }
);

export const getLessons = async () => {
  try {
    const response = await api.get('/lessons');
    return response;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getTopics = async () => {
  try {
    const response = await api.get('/topics');
    return response;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export default api;