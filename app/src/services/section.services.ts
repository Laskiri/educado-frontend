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

const SectionServices = Object.freeze({
    getSectionDetail,
    getExerciseDetail,
    saveSection
});

export default SectionServices;
