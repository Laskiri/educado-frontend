import axios from "axios";

// Interfaces
import { Lecture } from "../interfaces/Lecture";
import { BACKEND_URL } from '../helpers/environment';



// Send the info to lecture service
const addLecture = async (title: string, description: string, token: string, sid: string) => {
  return await axios.put(
    `${BACKEND_URL}/api/lectures/${sid}`,
    {
      title: title,
      description: description,
      
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
};


// Send the info to exercise service
const updateLecture = async (props: any, token: string, lid: string ) => {
  if (lid == undefined){
    throw("Error: updateLecture input id is undefined")
  }
  const response = await axios.patch(
    `${BACKEND_URL}/api/lectures/${lid}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data
};

// Get lecture detail
const getLectureDetail = (url: string, token: string) => {
  return axios.get(url, 
  { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data)
}

/**
 * Delete a lecture
 * 
 * @param lid Lecture ID
 * @param token 
 * @returns 
 */
const deleteLecture = async (lid: string | undefined, token: string) => {
  if (lid == undefined){
      throw("Error: deleteLecture input id is undefined")
  }
  return await axios.delete(
      `${BACKEND_URL}/api/lectures/${lid}`,
      { headers: { Authorization: `Bearer ${token}` } }
  );
}

const LectureService = Object.freeze({ addLecture, updateLecture, getLectureDetail, deleteLecture });

export default LectureService;
