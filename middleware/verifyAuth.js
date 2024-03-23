import axios from "axios";


export default async function (user) {

    console.log(user)

    const { data } = await axios.get('/api/auth/verifyToken')
    if (data.success) {
        console.log(data)
        if (user?.id == data.decodedValue.id) {
            return true
        }
        else {
            return false
        }
    }
}