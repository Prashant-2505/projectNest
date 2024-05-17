import axios from "axios";


export default async function (user) {


    const { data } = await axios.get('/api/auth/verifyToken')
   
    if (data.success) {
        if (user?.id === data.decodedValue.id) {
            return true
        }
        else {
            return false
        }
    }
}