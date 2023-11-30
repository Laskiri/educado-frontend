import axios from "axios";
import { BACKEND_URL } from '../helpers/environment';


//Get requests
const getUserFormOne = async (userID: any) => {
  console.log("Static user form is recieved");
  return await axios.get(
    `${BACKEND_URL}/api/users/fetch/${userID}`
  );
}

const getUserFormTwo = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/getEducation/${userID}`
  );
}

const getUserFormThree = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/getExperience/${userID}`
  );
}

//Delete additional forms 
const deleteEducationForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/deleteEducation/${_id}`
  );
}

const deleteExperienceForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/deleteExperience/${_id}`
  );
}

//Update Forms 
const putFormOne = async (formDataToSend: any) => {
  console.log("formData: ", formDataToSend)
  return await axios.put(
    `${BACKEND_URL}/api/users/updateProfile/`,
    formDataToSend)
}

const putFormTwo = async (data: any) => {
  console.log("FormTwo: ", data)
  return await axios.put(
    `${BACKEND_URL}/api/users/addEducation`, data)
}

const putFormThree = async (data: any) => {
  return await axios.put(`${BACKEND_URL}/api/users/addExperience`, data);
};

//Profile image
const postImage = async (formData: any) => {
    return await axios.post(
        `${BACKEND_URL}/api/bucket/upload`,
        formData
      );
}



const ProfileServices = Object.freeze({
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