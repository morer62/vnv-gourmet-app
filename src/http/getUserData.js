import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTES, getApiUrl } from '../config/apiRoutes';
import { withBusinessScope } from '../config/businessConfig';

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

    const formBody = new URLSearchParams(withBusinessScope({ token })).toString();

    const { data } = await axios.post(getApiUrl(API_ROUTES.validateToken), formBody, {
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
