import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { topics, lessons, lessonContents } from '../mocks/data';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup mock adapter
const mock = new MockAdapter(api, { delayResponse: 500 });

// Mock API endpoints
mock.onGet(/\/topics\/.*/).reply(200, { topics });
mock.onGet(/\/lessons\/.*\/content/).reply((config) => {
  const lessonId = config.url?.split('/')[2];
  const content = lessonContents[lessonId as string];
  return content ? [200, { content }] : [404];
});
mock.onGet(/\/lessons\/.*/).reply(200, { lessons });

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'New Achievement Unlocked!',
    message: 'You\'ve completed your first science lesson',
    type: 'success',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: '2',
    title: 'Daily Streak: 5 Days!',
    message: 'Keep going! You\'re on a roll!',
    type: 'info',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: true
  },
  {
    id: '3',
    title: 'Quiz Available',
    message: 'New gravity quiz is ready for you',
    type: 'warning',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: false
  }
];

// Mock notifications endpoints
mock.onGet('/notifications').reply(200, { notifications: mockNotifications });
mock.onPost(/\/notifications\/.*\/dismiss/).reply(200, { success: true });

// Mock student data
const mockStudentData = {
  id: '1',
  name: 'Vidyaarthi',
  points: 850,
  level: 5
};

// Mock student activity data
const mockStudentActivity = {
  type: 'lesson',
  title: 'Gravity Basics',
  description: 'Learn about the fundamental force that shapes our universe',
  points: 10,
  link: '/fundamentals/science/gravity/introduction-to-gravity/learn',
  progress: 0,
  timeEstimate: '15 minutes',
  performance: 'good'
};

// Mock student summary endpoints with query parameter handling
mock.onGet(/\/student-summary.*/).reply((config) => {
  const params = new URLSearchParams(config.url?.split('?')[1]);
  const studentId = params.get('studentId');
  
  if (studentId === '1') {
    return [200, mockStudentData];
  }
  return [404, { message: 'Student not found' }];
});

// Mock student activity endpoint
mock.onGet(/\/student-activity.*/).reply((config) => {
  const params = new URLSearchParams(config.url?.split('?')[1]);
  const studentId = params.get('studentId');
  
  if (studentId === '1') {
    return [200, mockStudentActivity];
  }
  return [404, { message: 'Student not found' }];
});

mock.onPost('/student-summary').reply((config) => {
  const data = JSON.parse(config.data);
  // Update mock student data
  if (data.studentId === '1') {
    mockStudentData.points = data.points;
    mockStudentData.level = Math.floor(data.points / 200) + 1;
    return [200, mockStudentData];
  }
  return [404, { message: 'Student not found' }];
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

export const getStudentSummary = async (studentId: string) => {
  try {
    const response = await api.get(`/student-summary?studentId=${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student summary:', error);
    throw error;
  }
};

export const getStudentActivity = async (studentId: string) => {
  try {
    const response = await api.get(`/student-activity?studentId=${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student activity:', error);
    throw error;
  }
};

export const updateStudentPoints = async (studentId: string, points: number) => {
  try {
    const response = await api.post('/student-summary', { studentId, points });
    return response.data;
  } catch (error) {
    console.error('Error updating student points:', error);
    throw error;
  }
};

export default api;