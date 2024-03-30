import axios from "axios";

const apiClient = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_IP,
    headers:{
        "Content-Type":"application/json"
    }
})

export {apiClient}