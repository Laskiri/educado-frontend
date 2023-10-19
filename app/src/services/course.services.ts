import axios from "axios";

// Backend URL from enviroment
import { BACKEND_URL } from '../helpers/environment';

// Interface for posting course content
export interface CourseInterface {
  title: string;
  category: string;
  level: string;
  description: string;
  estimatedHours: number;
}

/**
 * IN ALL METHODS THE TOKEN HAS BEEN COMMENTED OUT, SINCE WE DON'T HAVE A TOKEN YET
 */

// Create a new course
const createCourse = async ({ title, category, level, estimatedHours, description }: CourseInterface, token: string) => {
  console.log("Creating course with title: " + title);
  return await axios.post(
    `${BACKEND_URL}/api/courses`,
    {
      title: title,
      description: description,
      category: category,
      level: level,
      estimatedHours: estimatedHours,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Create a new section for a course FIXME: should this be in section.services ??
const updateCoverImage = async ( id: any, token: string) => {
 
  return await axios.post(
    `${BACKEND_URL}/api/course/update/coverImage/${id}`,
      
    { 
      headers: { Authorization: `Bearer ${token}` }
      
    }
  ).then(res => res.data);
}

// Get all courses
const getAllCourses = (url: string/*, token: string*/) => {
  return axios.get(url/*, { headers: { Authorization: `Bearer ${token}` } }*/)
    .then(res => {
      // Convert dates in course data to Date objects
      res.data.forEach((course: any) => {
        course.createdAt = new Date(course.createdAt);
        course.modifiedAt = new Date(course.modifiedAt);
      });
      return res.data;
    });
};

// Get course detail
const getCourseDetail = (url: string/*, token: string*/) => {
  return axios.get(url/*, { headers: { Authorization: `Bearer ${token}` } }*/)
    .then((res) => res.data);
};

// Get course categories
const getCourseCategories = (url: string/*, token: string*/) => {
  return axios.get(url/*, { headers: { Authorization: `Bearer ${token}` } }*/)
    .then(res => res.data);
}

// Updating a specific course
const updateCourseDetail = (data: any, id: any/*, token: string*/) => {
  console.log(`${BACKEND_URL}api/courses/update/${id}`)
  return axios.post(
    `${BACKEND_URL}/api/courses/update/${id}`, // TODO: change backend url to not include final /
    data/*,
    { headers: { Authorization: `Bearer ${token}` } }*/
  ).then(res => res.data);
}

// Create a new section for a course FIXME: should this be in section.services ??
const createSection = async (data: any, id: any, token: string) => {
  return await axios.post(
    `${BACKEND_URL}/api/sections/create/${id}`,
    data/*,
    { headers: { Authorization: `Bearer ${token}` }}*/
  );
}


const deleteCourse = async (id: any, token: string) => {
  console.log("Deleted course with id: " + id)
  return await axios.delete(
      `${BACKEND_URL}/api/courses/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
  );
  
}

const CourseServices = Object.freeze({
  createCourse,
  getAllCourses,
  getCourseDetail,
  getCourseCategories,
  updateCourseDetail,
  createSection,
  updateCoverImage,
  deleteCourse
});

export default CourseServices;
