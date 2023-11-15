import axios from "axios";
import {BACKEND_URL} from "../helpers/environment"

export interface ContentCreatorApplication {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
}


const postUserLogin = async (credentials: any) => {
  return await axios.post(`${BACKEND_URL}/api/auth/login`, credentials);
};

const postUserApplication = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/applications`, formData);
};

const postUserCredentialsLogin = async (credentials: any) => {
  return await axios.post(`${BACKEND_URL}/api/credentials/login`, credentials);
};

const postUserSignup = async(formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/signup`, formData)
}

const GetCCApplications = async () => {
  return await axios.get(`${BACKEND_URL}/api/applications`);
};

const GetSingleCCApplication = async (url: string) => {
  return await axios.get(url)
};

const AcceptApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}approve`);
};

const RejectApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}reject`);
};

const AuthServices = Object.freeze({
  postUserLogin,
  postUserSignup,
  GetCCApplications,
  GetSingleCCApplication,
  AcceptApplication,
  RejectApplication,
});

export default AuthServices;
