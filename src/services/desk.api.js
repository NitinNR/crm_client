import axios from "axios";
import { SERVER_API } from '../config';

const deskApi = axios.create({
  baseURL: `${SERVER_API}/api/desk`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3001",
  },
});

export default deskApi;