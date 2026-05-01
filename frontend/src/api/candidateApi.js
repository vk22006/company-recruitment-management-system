import api from './axios';

export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const uploadResume = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/candidates/${id}/resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
