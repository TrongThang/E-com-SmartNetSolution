import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const GHN_API_URL = API_CONFIG.GHN_BASE_URL || '';
const GHN_TOKEN = API_CONFIG.GHN_TOKEN;

export const requestGHN = async (url, opts = {}) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Token: GHN_TOKEN,
    ...(opts.headers || {}),
  };

  try {
    const response = await axios({
      method: opts.method || 'GET',
      url: `${GHN_API_URL}${url}`,
      data: opts.data || null,
      params: opts.params || null,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error('GHN API error:', error);
    throw error;
  }
};
