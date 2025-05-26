import axios from "axios";

// Create a base axios instance with default configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    console.error("API Error:", error);

    // Handle specific error codes
    if (response?.status === 401) {
      // Unauthorized - could redirect to login or show message
      console.error("Authentication required");
    }

    if (response?.status === 403) {
      // Forbidden - could show access denied message
      console.error("Access denied");
    }

    return Promise.reject(error);
  }
);

// API function helpers
const apiClient = {
  // Authentication
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  // User
  getCurrentUser: () => api.get("/users/me"),

  updateUser: (data: any) => api.patch("/users/me", data),

  uploadAvatar: (imageData: string) =>
    api.post("/upload-avatar", { image: imageData }),

  // User Activity & Streak
  getUserStreak: () => api.get("/users/streak"),

  getUserActivity: (days = 30) => api.get(`/users/activity?days=${days}`),

  // Sheets
  getAllSheets: () => api.get("/sheets"),

  getSheet: (id: string) => api.get(`/sheets/${id}`),

  createSheet: (data: any) => api.post("/sheets", data),

  updateSheet: (id: string, data: any) => api.put(`/sheets/${id}`, data),

  deleteSheet: (id: string) => api.delete(`/sheets/${id}`),

  // Progress
  getProgress: (sheetId: string) => api.get(`/progress/${sheetId}`),

  toggleProblem: (data: { sheetId: string; problemId: string }) =>
    api.post("/progress/toggle", data),

  getProgressReport: (sheetId: string) =>
    api.get(`/progress/report?sheetId=${sheetId}`),

  // Blogs
  getAllBlogs: () => api.get("/blogs"),

  getBlog: (id: string) => api.get(`/blogs/${id}`),

  createBlog: (data: any) => api.post("/blogs", data),

  updateBlog: (id: string, data: any) => api.put(`/blogs/${id}`, data),

  deleteBlog: (id: string) => api.delete(`/blogs/${id}`),

  markBlogAsRead: (blogId: string) => api.post(`/blogs/${blogId}/read`),

  // Coding Problems
  getAllProblems: () => api.get("/problems"),

  getProblem: (id: string) => api.get(`/problems/${id}`),

  createProblem: (data: any) => api.post("/problems", data),

  updateProblem: (id: string, data: any) => api.put(`/problems/${id}`, data),

  deleteProblem: (id: string) => api.delete(`/problems/${id}`),

  // Submissions
  submitSolution: (problemId: string, data: any) =>
    api.post(`/problems/${problemId}/submit`, data),

  // Updated getSubmissions to handle problem-specific submissions
  getSubmissions: (
    options: {
      problemId?: string;
      status?: string;
      allUsers?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    console.log("Getting submissions with options:", options);
    const params = new URLSearchParams();

    if (options.problemId) params.append("problemId", options.problemId);
    if (options.status) params.append("status", options.status);
    if (options.allUsers) params.append("allUsers", "true");
    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());

    const query = params.toString();
    return api.get(`/submissions${query ? `?${query}` : ""}`);
  },

  getUserSubmissions: (options: { status?: string } = {}) => {
    console.log("Getting user submissions with options:", options);
    const params = new URLSearchParams();
    if (options.status) params.append("status", options.status);
    const query = params.toString();
    return api.get(`/submissions${query ? `?${query}` : ""}`);
  },

  reviewSubmission: (submissionId: string, data: any) =>
    api.put(`/submissions/${submissionId}/review`, data),

  // Get user's submissions for a specific problem
  getProblemSubmissions: (problemId: string) =>
    api.get(`/problems/${problemId}/submissions`),

  // Submit code for a problem
  submitCode: (data: { problemId: string; code: string; language: string }) =>
    api.post(`/problems/${data.problemId}/submit`, data),

  // Admin
  getAllUsers: () => api.get("/users"),

  updateUserRole: (id: string, data: { role: string }) =>
    api.patch(`/users/${id}`, data),

  deleteUser: (id: string) => api.delete(`/users/${id}`),

  getAdminStats: () => api.get("/admin/stats"),
};

export default apiClient;
