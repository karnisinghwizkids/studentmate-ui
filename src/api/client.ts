import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gurukul-sm-api-995034495677.asia-south1.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to update the token dynamically
const setAuthToken = (token) => {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
  console.log('Authorization:', api.defaults.headers['Authorization']); 
};

// Login function to fetch token and set it
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/students/auth', credentials);
    const newToken = response.data?.token;
    console.log('newToken:', newToken);
    if (newToken) {
      setAuthToken(newToken);
    }
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

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

export const getLessons = async (topicId: string) => {
  try {
   // const response = await api.get(`/lessons/${topicId}`);
   const response = await api.get(`api/students/kitems?studentId=2&topicId=1&lessonId=101`);
    return response;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getTopics = async (subjectId: string) => {
  try {
    const response = await api.get(`/topics/${subjectId}`);
    return response;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export default api;
