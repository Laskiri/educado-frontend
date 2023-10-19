import axios from "axios";

// Intefaces
import { Section } from "../interfaces/CourseDetail";

import { BACKEND_URL } from '../helpers/environment';

export const getSectionDetail = (url: string, token: string) => {
    return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.data)
}

// boilerplate FIXME: should this be en Exercise.services ??
export const getExerciseDetail = (url: string, token: string) => {
    return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.data)
}

export const saveSection = async (data: any, id: any/*, token: string*/) => {
    // Send the info to caller
    console.log(`${BACKEND_URL}/api/sections/update/${id}`);
    return axios.post(
        `${BACKEND_URL}/api/sections/update/${id}`,
        data/*,
    { headers: { Authorization: `Bearer ${token}` } }*/
    );
};


/**
 * Create a new section for a course
 * 
 * @param data Input data, should be a Section interface
 * @param id id of the section
 * @param token token of the user, currently ignored
 * @returns respons from the backend post request
 */
const createSection = async (data: any, id: any, token: string) => {
    return await axios.post(
      `${BACKEND_URL}/api/sections/create/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
}

const deleteSection = async (id: any, token: string) => {
    console.log("Deleted section with id: " + id)
    return await axios.delete(
        `${BACKEND_URL}/api/sections/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}



const SectionServices = Object.freeze({
    getSectionDetail,
    getExerciseDetail,
    saveSection,
    createSection,
    deleteSection

});

export default SectionServices;
