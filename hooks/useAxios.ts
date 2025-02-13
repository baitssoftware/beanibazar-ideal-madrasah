import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
