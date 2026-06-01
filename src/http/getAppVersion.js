import axios from 'axios';
import { API_ROUTES, getApiUrl } from '../config/apiRoutes';

/**
 * @returns {Promise<String | null>} app version name
 */
export default async function getAppVersion() {
  try {
    const { data } = await axios.get(getApiUrl(API_ROUTES.appVersion));
    console.log("🔥 Versión del endpoint:", data.version);
    return data.version || null;
  } catch (error) {
    console.warn("⚠️ getAppVersion failed:", error.message);
    return null;
  }
}
