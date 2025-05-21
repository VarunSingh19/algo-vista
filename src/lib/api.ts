import axios from 'axios';

// Create a base axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle specific error codes
    if (response?.status === 401) {
      // Unauthorized - could redirect to login or show message
      console.error('Authentication required');
    }

    if (response?.status === 403) {
      // Forbidden - could show access denied message
      console.error('Access denied');
    }

    return Promise.reject(error);
  }
);

// API function helpers
export const apiClient = {
  // Authentication
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  // User
  getCurrentUser: () =>
    api.get('/users/me'),

  updateUser: (data: any) =>
    api.patch('/users/me', data),

  uploadAvatar: (imageData: string) =>
    api.post('/upload-avatar', { image: imageData }),

  // Sheets
  getAllSheets: () =>
    api.get('/sheets'),

  getSheet: (id: string) =>
    api.get(`/sheets/${id}`),

  createSheet: (data: any) =>
    api.post('/sheets', data),

  updateSheet: (id: string, data: any) =>
    api.put(`/sheets/${id}`, data),

  deleteSheet: (id: string) =>
    api.delete(`/sheets/${id}`),

  // Progress
  getProgress: (sheetId: string) =>
    api.get(`/progress/${sheetId}`),

  toggleProblem: (data: { sheetId: string; problemId: string }) =>
    api.post('/progress/toggle', data),

  // Admin
  getAllUsers: () =>
    api.get('/users'),

  updateUserRole: (id: string, data: { role: string }) =>
    api.patch(`/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),
};

export default apiClient;
