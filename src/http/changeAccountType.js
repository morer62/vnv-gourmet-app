import axios from "axios";



export default async function changeAccountType(token, value) {


    try {
        let response = await axios.post('api/auth/change-level', {
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