import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/**
 * @returns {Promise<{
 *   id: number;
 *   name: string;
 *   lastname: string;
 *   email: string;
 *   phone: string;
 *   phone_code: string;
 *   phone_validation: number;
 *   level: number;
 *   membership_due_date: string;
 *   id_owner: number | null;
 *   created_at: string;
 *   updated_at: string;
 * } | null>}
 */
export default async function getUserData() {
  try {
    const token = await AsyncStorage.getItem('Token');
    if (!token) return null;

    const formBody = new URLSearchParams({ token }).toString();

    const { data } = await axios.post(`${API_URL}api/auth/validate-token`, formBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (data.success) {
      return data.user;
    }

    return null;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    const status = error.response?.status;
    console.log('getUserData error:', status ? `[${status}] ${msg}` : msg);
    return null;
  }
}
