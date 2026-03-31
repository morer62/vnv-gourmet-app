// eslint-disable-next-line import/no-unresolved
import { API_URL } from "@env";

import axios from "axios";

const BASE = API_URL?.endsWith('/') ? API_URL : `${API_URL}/`;

axios.defaults.baseURL = BASE;