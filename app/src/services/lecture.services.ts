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


// Send the info to lecture service
const saveLecture = async (props: any, token: string) => {
  const response = await axios.put(
    `${BACKEND_URL}/api/lectures/${props.id}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data
};

// Get lecture detail
const getLectureDetail = (url: string, token: string) => {
  console.log("ioeNFOIEqn");
  return axios.get(url, 
  { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data)
}


const LectureService = Object.freeze({ addLecture, saveLecture, getLectureDetail });

export default LectureService;
