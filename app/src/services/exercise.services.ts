import axios from "axios";

// Interfaces
import { Exercise } from "../interfaces/Exercise";

import { BACKEND_URL } from '../helpers/environment';

/* Bearer is not implemnted in backend, due to content creators not existing yet */

// Send the info to exercise service 
const addExercise = async (props: any, token: string, sid: string | undefined) => {
  if (sid == undefined){
    throw("Error: addExercise input id is undefined")
  }
  return await axios.put(
    `${BACKEND_URL}/api/exercises/${sid}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Send the info to exercise service
const updateExercise = async (props: any, token: string, eid: string | undefined) => {
  if (eid == undefined){
    throw("Error: updateExercise input id is undefined")
  }
  const response = await axios.patch(
    `${BACKEND_URL}/api/exercises/${eid}`,
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



const ExerciseServices = Object.freeze({
  getExerciseDetail,
  addExercise,
  updateExercise
});


export default ExerciseServices;