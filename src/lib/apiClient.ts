import axios from "axios";

const apiClient = axios.create({
  baseURL:"http://localhost:4649/api",
  headers:{
    "Content-Type":"application/json"
  }
})

export {apiClient}