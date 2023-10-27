import axios from "axios";

// Interfaces
import { CCApp } from "../interfaces/CCApp";
import {BACKEND_URL} from "../helpers/environment"




export interface ContentCreatorApplication {
  firstName: String;
  lastName: String;
  email: String;
  motivation: String;
}

// Authenticate with JWT login
const postUserLogin = async (credentials: any) => {
  return await axios.post(`${BACKEND_URL}/auth/jwt`, credentials);
};

const postUserApplication = async (formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/applications`, formData);
};

const GetCCApplications = async (): Promise<CCApp.RootObject> => {
  return await axios.get(
    `${BACKEND_URL}/api/applications?approved=false&isRejected=false`
  );
};

const GetSingleUserApplication = async (url: string): Promise<CCApp.Datum> => {
  const response = await axios.get(url);
  return response.data.data;
};

const PostDelcineContentCreator = async (id: string): Promise<unknown> => {
  return await axios.put(
    `${BACKEND_URL}/api/applications/${id}?action=reject`,
    { data: { reason: `No` } }
  );
};

const PostAcceptContentCreator = async (id: string): Promise<unknown> => {
  return await axios.put(
    `${BACKEND_URL}/api/applications/${id}?action=approve`,
    { data: { reason: `Yes` } }
  );
};

const AuthServices = Object.freeze({
  postUserLogin,
  postUserApplication,
  GetCCApplications,
  GetSingleUserApplication,
  PostDelcineContentCreator,
  PostAcceptContentCreator,
});

export default AuthServices;
