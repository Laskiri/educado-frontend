import axios from "axios";
import {BACKEND_URL} from "../helpers/environment"

import { NewApplication } from "../pages/Application";

const postNewApplication = async (data: NewApplication) => {
  return await axios.post(`${BACKEND_URL}/api/applications/newapplication`, data);
};

const AdminService = Object.freeze({
    postNewApplication,
  });
export default AdminService