import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { getApiUrl } from './apiRoutes';
import { withBusinessScope } from './businessConfig';

async function getAuthHeaders(extraHeaders = {}) {
  const token = await AsyncStorage.getItem('Token');
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function postForm(route, payload = {}, options = {}) {
  const body = new URLSearchParams(withBusinessScope(payload)).toString();
  const headers = await getAuthHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    ...(options.headers || {}),
  });

  return axios.post(getApiUrl(route), body, {
    ...options,
    headers,
  });
}

export async function postJson(route, payload = {}, options = {}) {
  const headers = await getAuthHeaders({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });

  return axios.post(getApiUrl(route), withBusinessScope(payload), {
    ...options,
    headers,
  });
}

export function getReadableApiError(error, fallback = 'Request failed. Please try again.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
