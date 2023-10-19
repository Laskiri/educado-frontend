import axios from "axios";

// Interfaces
import { Exercise } from "../interfaces/Exercise";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* Bearer is not implemnted in backend, due to content creators not existing yet */

// Send the info to exercise service 
const addExercise = async (props: any, token: string, sid: any) => {
  return await axios.post(
    `${BACKEND_URL}/api/exercises/create/${sid}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Send the info to exercise service
const updateExercise = async (props: any, token: string, eid: any) => {
  const response = await axios.post(
    `${BACKEND_URL}/api/exercises/update/${eid}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data
};

// Get exercise detail
const getExerciseDetail = (url: string, token: string) => {
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data)
}



const ExerciseServices = Object.freeze({ getExerciseDetail, addExercise, updateExercise });


export default ExerciseServices;