import axios from "axios";

import { BUSINESS_CONFIG } from "./businessConfig";

axios.defaults.baseURL = BUSINESS_CONFIG.apiBaseUrl;
