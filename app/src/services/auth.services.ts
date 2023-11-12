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

/*  const postUserApplication = async (formData: ContentCreatorApplication) => {
  return await axios.post("http://127.0.0.1:8888/api/applications", formData);
}; (OLD CODE)*/


const GetCCApplications = async () => {
  return await axios.get(`${BACKEND_URL}/api/applications/`);
};

const GetSingleCCApplication = async (url: string) => {
  return await axios.get(url)
  
};

/*const GetSingleUserApplication = async (url: string): Promise<CCApp.Datum> => {
  const response = await axios.get(url);
  return response.data.data;
};*/

const AcceptApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}approve`);
};

const RejectApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}reject`);
};

const AuthServices = Object.freeze({
  postUserLogin,
  postUserSignup,
  //postUserApplication,
  GetCCApplications,
  GetSingleCCApplication,
  AcceptApplication,
  RejectApplication,
});

export default AuthServices;
