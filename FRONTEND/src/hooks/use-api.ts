import { useState, useCallback } from 'react';
import { apiClient, LoginRequest, GenerateRequest, ProjectCreateRequest, SlideUpdateRequest, ChatRequest, ChatResponse } from '@/lib/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
  }, []);

  const generateSlides = useCallback(async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.generateSlides(prompt);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: ProjectCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createProject(projectData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Project creation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProject(projectId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSlide = useCallback(async (slideId: number, updateData: SlideUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateSlide(slideId, updateData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Slide update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const chatRequest = useCallback(async (request: ChatRequest): Promise<ChatResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.chatRequest(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Chat request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      const response = await apiClient.healthCheck();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    // State
    loading,
    error,
    clearError,
    
    // Authentication
    login,
    logout,
    isAuthenticated: apiClient.isAuthenticated(),
    getToken: apiClient.getToken(),
    
    // API methods
    generateSlides,
    createProject,
    getProject,
    updateSlide,
    chatRequest,
    healthCheck,
  };
}; 