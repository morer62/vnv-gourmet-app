import axios from "axios";

import { API_ROUTES } from "../config/apiRoutes";


export default async function changeAccountType(token, value) {


    try {
        let response = await axios.post(API_ROUTES.changeLevel, {
            level: value
        },  {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}
