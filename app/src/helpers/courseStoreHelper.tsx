import { Course, Section, Component, Lecture, Exercise, Media, FormattedCourse } from "../interfaces/Course";
import { getUserInfo } from "./userInfo";

export const formatCourse = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[],
): FormattedCourse => {
  const courseInfo = formatCourseInfo(course, media);
  const formattedSections = formatSections(course, sections, lectures, exercises, media);
  return { courseInfo, sections: formattedSections };
};

const formatCourseInfo = (course: Course, media: Media[]) => {
  const coverIMG = media.find((media) => media.parentType === "c" && media.id === course._id) || null
  return {
    _id : course._id ?? "",
    title: course.title,
    category: course.category,
    difficulty: course.difficulty,
    description: course.description,
    coverImg: coverIMG,
    status: course.status,
    creator: course.creator ?? "",
  };
};

const formatSections = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
) => {
  if (course.sections.length === 0) return [];
  let haventCachedSections = false;
  const formattedSections = course.sections.map((sectionId) => {
    const section = sections.find((sec) => sec._id === sectionId);
    if (!section) { haventCachedSections = true; return {_id: "", title: "", description: "", components: [] }; }

    return {
      _id: section._id,
      title: section.title,
      description: section.description,
      components: formatComponents(section.components, lectures, exercises, media),
    };
  });
  // This is in case that the sectionspage hasn't been accessed yet and courseInfo changes are tried to be made, then the sections are not cached yet.
  return haventCachedSections ? null : formattedSections;
};

const formatComponents = (
  components: Component[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
) => {
    return components
    .map((component) => {
      const isLecture = component.compType === "lecture";
      const comp = isLecture
        ? lectures.find((lecture) => lecture._id === component.compId)
        : exercises.find((exercise) => exercise._id === component.compId);
      return comp
        ? {
            compType: component.compType,
            component: comp,
            video: isLecture ? lookForMedia(media, comp._id) : null,
          }
        : null;
    })
    .filter((comp) => comp !== null) as { compType: string; component: Lecture | Exercise; video: Media | null }[];
};

const lookForMedia = (media: Media[], lookupId: string): Media | null => {
  const foundMedia = media.find((media) => media.id === lookupId)
  return foundMedia ? foundMedia : null;
};

// Prepare form data for course creation or update
export const prepareFormData = (course: FormattedCourse): FormData => {
  const formData = new FormData();
  const { id: userId } = getUserInfo();


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

  return formData;
};

export const getCourseIdFromFormData = (formData: FormData): string => {
  const courseData = formData.get("courseData");
  const course = JSON.parse(courseData as string);
  return course.courseInfo._id;
}

