import { API_URL } from '@env';
import axios from 'axios';

/**
 * @returns {Promise<String | null>} app version name
 */
export default async function getAppVersion() {
  try {
    const { data } = await axios.get(`${API_URL}/api/version`);
    console.log("🔥 Versión del endpoint:", data.version);
    return data.version || null;
  } catch (error) {
    console.warn("⚠️ getAppVersion failed:", error.message);
    return null;
  }
}
