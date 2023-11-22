import axios from "axios";
import { BACKEND_URL } from '../helpers/environment';

// Interfaces


 
//Fetch Data ---Profile Page---
const getTokenDetails = async (email: string) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/fetchuser/${email}`
  );
}

const getUserFormOne = async (userID: any) => {
  console.log("Static user form is recieved");
  return await axios.get(
    `${BACKEND_URL}/api/users/fetch/${userID}`
  );
}

const getUserFormTwo = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/getEducation?userID=${userID}`
  );
}

const getUserFormThree = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/getExperience?userID=${userID}`
  );
}

//Delete additional forms ---Profile Page---
const deleteEducationForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/deleteEducation?_id=${_id}`
  );
}

const deleteExperienceForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/deleteExperience?_id=${_id}`
  );
}

//Update Forms ---Profile Page---
const putFormOne = async (formDataToSend: any) => {
  return await axios.put(
    `${BACKEND_URL}/api/users/updateProfile/`,
    formDataToSend)
}

const putFormTwo = async (data: any) => {
  return await axios.post(
    `${BACKEND_URL}/api/users/addEducation`, data)
}

const putFormThree = async (data: any) => {
  return await axios.post(`${BACKEND_URL}/api/users/addExperience`, data);
};

//Profile image
const postImage = async (formData: any) => {
    return await axios.post(
        `${BACKEND_URL}/api/bucket/upload`,
        formData
      );
}



const ProfileServices = Object.freeze({
  getTokenDetails,
  getUserFormThree,
  getUserFormTwo,
  getUserFormOne, 
  deleteExperienceForm,
  deleteEducationForm, 
  putFormThree,
  putFormTwo,
  putFormOne,
  postImage,
});

export default ProfileServices;