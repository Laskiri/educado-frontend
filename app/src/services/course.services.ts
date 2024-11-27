import axios from "axios";

// Backend URL from enviroment
import { BACKEND_URL } from '../helpers/environment';
import { getUserInfo } from "../helpers/userInfo";

//interfaces
import { Course, FormattedCourse } from "../interfaces/Course"


/**
 * IN ALL METHODS THE TOKEN HAS BEEN COMMENTED OUT, SINCE WE DON'T HAVE A TOKEN YET
 */


const createCourse = async (newCourse: FormattedCourse, token: string) => {
  const { id: userId } = getUserInfo();
  const formData = new FormData();

  // Append the entire course data (excluding files) to formData
  const courseData = { ...newCourse, userId };
  formData.append("courseData", JSON.stringify(courseData));
  console.log(JSON.stringify(courseData));
  // Append cover image to formData if it exists
  if (newCourse.courseInfo.coverImg) {
    formData.append("coverImg", newCourse.courseInfo.coverImg.file);
  }

  // Append section data and any media files in the components
  if (newCourse.sections) {
    newCourse.sections.forEach((section, sectionIndex) => {
      section.components.forEach((component, componentIndex) => {
        if (component.video) {
          formData.append(`sections[${sectionIndex}].components[${componentIndex}].video`, component.video.file);
        }
      });
    });
  }

  // Log FormData contents
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/create/new`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

const updateCourse = async (updatedCourse: FormattedCourse, token: string) => {
  const courseId = updatedCourse.courseInfo._id;
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/update/${courseId}`,
      { updatedCourse },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}



/**
 * Get all courses
 * @param token The token of the user
 * @returns A list of all courses
 */
const getAllCourses = async (token: string) => {
  const { id } = getUserInfo();

  const res = await axios.get(`${BACKEND_URL}/api/courses/creator/${id}`, { headers: { Authorization: `Bearer ${token}`, token: token } });

  // Convert dates in course data to Date objects
  res.data.forEach((course: Course) => {
    if (course.dateCreated) {
      course.dateCreated = new Date(course.dateCreated);
    }
    if (course.dateUpdated) {
      course.dateUpdated = new Date(course.dateUpdated);
    }
  });

  return res.data;
};

/**
 * Get course detail
 * @param url The route to get the course detail
 * @returns The course detail
 */
const getCourseDetail = async (id: string, token: string) => {
  const res = await axios.get(`${BACKEND_URL}/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } })

  return res.data;
};

// Get course categories - FROM LAST YEAR, NOT IMPLEMENTED, CATEGORIES ARE HARDCODED RN
const getCourseCategories = async (url: string, token: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

  return res.data;
}

/**
 * Delete a specific course 
 * @param id the id of the course that will be deleted
 * @param token token of the user 
 * @returns Delete data
 */
const deleteCourse = async (id: string | undefined, token: string) => {
  return await axios.delete(
    `${BACKEND_URL}/api/courses/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Export all methods
const CourseServices = Object.freeze({
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseDetail,
  getCourseCategories,
  deleteCourse
});

export default CourseServices;