import { Course, Section, Component, Lecture, Exercise, Media, FormattedCourse } from "../interfaces/Course";
import { getUserInfo } from "./userInfo";

export const formatCourse = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[],
): FormattedCourse => {
  return {
    courseInfo: formatCourseInfo(course),
    sections: formatSections(course, sections, lectures, exercises, media),
  };
};

const formatCourseInfo = (course: Course) => {
  return {
    _id : course._id,
    title: course.title,
    category: course.category,
    difficulty: course.difficulty,
    description: course.description,
    coverImg: course.coverImg ?? "",
    status: course.status,
  };
};

const formatSections = (
  course: Course,
  sections: Section[],
  lectures: Lecture[],
  exercises: Exercise[],
  media: Media[]
) => {
  const uniqueSections = new Set<string>();
  const filteredSections = sections.filter((section) => {
    if (uniqueSections.has(section._id)) {
      return false;
    } else {
      uniqueSections.add(section._id);
      return true;
    }
  });
  return filteredSections.map((section) => {
    return {
      _id: section._id,
      title: section.title,
      description: section.description,
      components: formatComponents(section.components, lectures, exercises, media),
    };
  });
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
    console.log("looking for media", media);
    console.log("lookupId", lookupId);
    const foundMedia = media.find((media) => media.id === lookupId)
    console.log("foundMedia", foundMedia);

  return foundMedia ? foundMedia : null;
};