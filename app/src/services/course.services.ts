import axios from "axios";

// Backend URL from enviroment
import { BACKEND_URL } from '../helpers/environment';
import { getUserInfo } from "../helpers/userInfo";

//interfaces
import { Course, FormattedCourse } from "../interfaces/Course"


// Prepare form data for course creation or update
const prepareFormData = (course: FormattedCourse, userId: string) => {
  const formData = new FormData();

  // Append the entire course data (excluding files) to formData
  const courseData = { ...course, userId };
  formData.append("courseData", JSON.stringify(courseData));

  // Append cover image to formData if it exists
  if (course.courseInfo.coverImg) {
    formData.append("coverImg", course.courseInfo.coverImg.file);
  }

  // Append section data and any media files in the components, right now a max of 10 in the backend
  if (course.sections) {
    course.sections.forEach((section, sectionIndex) => {
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

  return formData;
};
// Create a new course
const createCourse = async (newCourse: FormattedCourse, token: string) => {
  const { id: userId } = getUserInfo();
  const formData = prepareFormData(newCourse, userId);

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
// Update a course
const updateCourse = async (updatedCourse: FormattedCourse, token: string) => {
  const { id: userId } = getUserInfo();
  console.log("Updated course:", updatedCourse);
  const formData = prepareFormData(updatedCourse, userId);
  const courseId = updatedCourse.courseInfo._id;

  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/update/${courseId}`,
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
    console.error("Error updating course:", error);
    throw error;
  }
};


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