import axios from 'axios';

const apiClient = (method, url, body, params = {}) => {
  const baseUrl = 'https://reqres.in/api/';
  const headers = { 'Content-Type': 'application/json' };

  switch (method) {
    case 'get':
      return axios.get(baseUrl + url, { headers, params }).catch((error) => {
        throw error;
      });
    case 'post':
      return axios
        .post(baseUrl + url, body, { headers, params })
        .catch((error) => {
          throw error;
        });
    case 'delete':
      return axios({
        url: baseUrl + url,
        headers,
        method: 'DELETE',
        data: body,
      }).catch((error) => {
        throw error;
      });
    case 'put':
      return axios({
        url: baseUrl + url,
        headers,
        method: 'PUT',
        data: body,
      }).catch((error) => {
        throw error;
      });
    default:
  }
  return '';
};
export default apiClient;
