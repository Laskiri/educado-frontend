import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Course,
  Section,
  Component,
  Lecture,
  Media,
  Exercise,
} from "../interfaces/Course";
import { create, set } from "cypress/types/lodash";

// Define the context type
interface CourseContextProps {
  course: Course;
  updateCourse: (course: Course) => void;
  updateCachedCourseSections: (sections: string[]) => void;
  sections: Section[];
  updateSections: (sections: Section[]) => void;
  loadSectionToCache: (section: Section) => void;
  getCachedSection: (sid: string) => Section | null;
  updateCachedSection: (section: Section) => void;
  deleteCachedSection: (sid: string) => void;
  updateCachedSectionComponents: (
    sectionId: string,
    components: Component[]
  ) => void;
  deleteCachedSectionComponent: (sectionId: string, compId: string) => void;
  addCachedSectionComponent: (sectionId: string, component: Component) => Component;
  lectures: Lecture[];
  exercises: Exercise[];
  getCachedLecture: (lid: string) => Lecture | null;
  getCachedExercise: (eid: string) => Exercise | null;
  updateCachedLecture: (lecture: Lecture) => void;
  updateCachedExercise: (exercise: Exercise) => void;
  deleteCachedLecture: (lid: string) => void;
  deleteCachedExercise: (eid: string) => void;
  loadExerciseToCache: (exercise: Exercise) => void;
  loadLectureToCache: (lecture: Lecture) => void;
  addLectureToCache: (lecture: Lecture) => Section;
  addExerciseToCache: (exercise: Exercise) => void;
  media : Media[];
  addMediaToCache: (media: Media) => void;
  getMedia: (mid: string) => File | null;
}

interface CourseProviderProps {
  children: React.ReactNode;
}

// Create context with initial value
const CourseContext = createContext<CourseContextProps>({
  course: {} as Course,
  updateCourse: () => {},
  updateCachedCourseSections: () => {},
  sections: [] as Section[],
  updateSections: () => {},
  loadSectionToCache: () => {},
  getCachedSection: () => null,
  updateCachedSection: () => {},
  deleteCachedSection: () => {},
  updateCachedSectionComponents: () => {},
  deleteCachedSectionComponent: () => {},
  addCachedSectionComponent: () => {},
  lectures: [],
  exercises: [],
  getCachedLecture: () => null,
  getCachedExercise: () => null,
  updateCachedLecture: () => {},
  updateCachedExercise: () => {},
  deleteCachedLecture: () => {},
  deleteCachedExercise: () => {},
  loadLectureToCache: () => {},
  loadExerciseToCache: () => {},
  addLectureToCache: () => {},
  addExerciseToCache: () => {},
  media: [],
  addMediaToCache: () => {},
  getMedia: () => null,
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course>({} as Course);
  const [sections, setSections] = useState<Section[]>([] as Section[]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [idMaker, setIdMaker] = useState({"lecture": 0, "exercise": 0, "section": 0, "component": 0});

  

  useEffect(() => {
    return () => {
    };
  }, []);

  useEffect(() => {
  }
  , [sections]);

  useEffect(() => {
  }, [lectures, exercises]);


  const updateCourse = (newCourse: Course) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      ...newCourse,
      creator: prevCourse?.creator ?? "",
    }));
  };

  const updateCachedCourseSections = (newSections: string[]) => {

    setCourse((prevCourse) => ({
      ...prevCourse,
      sections: newSections,
    }));
  };

  const updateSections = (newSections: Section[]) => {
    setSections((prevSections) => [...prevSections, ...newSections]);
  };

  const loadSectionToCache = (newSection: Section) => {
    if (sections.find((section) => section._id === newSection._id)) return;
    if (course.sections && !course.sections.includes(newSection._id)) {
      setCourse((prevCourse) => {
        if (!prevCourse.sections) return prevCourse;
        return {
          ...prevCourse,
          sections: [...prevCourse.sections, newSection._id],
        };
      });
    }
    setSections((prevSections) => [...prevSections, newSection]);
  };

  

  const getCachedSection = (sid: string) => {
    if (sections.length == 0) return null;
    return sections.find((section) => section._id === sid) || null;
  };

  const updateCachedSection = (section: Section) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === section._id);
      if (index === -1) return prevSections;
      prevSections[index] = section;
      return prevSections;
    });
  };

  const updateCachedSectionComponents = (
    sectionId: string,
    components: Component[]
  ) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === sectionId);
      if (index === -1) return prevSections;
      prevSections[index].components = components;
      return prevSections;
    });
  };
  const deleteCachedSectionComponent = (sectionId: string, compId: string) => {
    setSections((prevSections) => {
      const sectionIndex = prevSections.findIndex((s) => s._id === sectionId);
      if (sectionIndex === -1) return prevSections;
  
      const updatedComponents = prevSections[sectionIndex].components.filter(
        (component) => component.compId !== compId
      );
  
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...prevSections[sectionIndex],
        components: updatedComponents,
      };
      return updatedSections;
    });
  };

  const addCachedSectionComponent = (sectionId: string, component: Component) => {
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, component: newId }));
    component.compId = newId.toString();
  
    setSections((prevSections) => {
      const sectionIndex = prevSections.findIndex((s) => s._id === sectionId);
      if (sectionIndex === -1) return prevSections;
  
      const updatedComponents = [...prevSections[sectionIndex].components, component];
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...prevSections[sectionIndex],
        components: updatedComponents,
      };
  
      return updatedSections;
    });
  
    return component;
  };

  const deleteCachedSection = (sid: string) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section._id !== sid)
    );
    setCourse((prevCourse) => {
      if (!prevCourse.sections) return prevCourse;
      return {
        ...prevCourse,
        sections: prevCourse.sections?.filter((sectionId) => sectionId !== sid),
      };
    });
  };

  const getCachedExercise = (eid: string) => {
    return exercises.find((exercise) => exercise._id === eid) || null;
  }

  const updateCachedLecture = (newLecture: Lecture) => {
    setLectures((prevLectures) => {
      const index = prevLectures.findIndex(
        (lecture) => lecture._id === newLecture._id
      );
      const updatedLectures = [...prevLectures];
      updatedLectures[index] = newLecture;
      return updatedLectures;
    });
  };

  const loadLectureToCache = (newLecture: Lecture) => {
    if (lectures.find((lecture) => lecture._id === newLecture._id)) return;
    setLectures((prevLectures) => [...prevLectures, newLecture]);
  }

  const deleteCachedLecture = (lid: string) => {
    setLectures((prevLectures) =>
      prevLectures.filter((lecture) => lecture._id !== lid)
    );
  };

  const getCachedLecture = (lid: string) => {
    return lectures.find((lecture) => lecture._id === lid) || null;
  }

  const addLectureToCache = (newLecture: Lecture) => {
    const newId = idMaker.lecture + 1;
    setIdMaker((prevIdMaker) => ({...prevIdMaker, lecture: newId}));
    newLecture._id = newId.toString();
    setLectures((prevLectures) => [...prevLectures, newLecture]);
    return newLecture;
  }
  
  const updateCachedExercise = (newExercise: Exercise) => {
    setExercises((prevExercises) => {
      const index = prevExercises.findIndex(
        (exercise) => exercise._id === newExercise._id
      );
      const updatedExercises = [...prevExercises];
      updatedExercises[index] = newExercise;
      return updatedExercises;
    });
  };

  const loadExerciseToCache = (newExercise: Exercise) => {
    if (exercises.find((exercise) => exercise._id === newExercise._id)) return;
    setExercises((prevExercises) => [...prevExercises, newExercise]);
  }

  const deleteCachedExercise = (eid: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise._id !== eid)
    );
  };

  const addExerciseToCache = (newExercise: Exercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
  }

  const addMediaToCache = (newMedia: Media) => {
    setMedia((prevMedia) => [...prevMedia, newMedia]);
  }

  const getMedia = (mid: string) => {
    const mediaItem = media.find((media) => media.id === mid);
    return mediaItem ? mediaItem.file : null;
  };

  



  const value = {
    course,
    updateCourse,
    updateCachedCourseSections,
    sections,
    updateSections,
    loadSectionToCache,
    getCachedSection,
    updateCachedSection,
    deleteCachedSection,
    updateCachedSectionComponents,
    deleteCachedSectionComponent,
    addCachedSectionComponent,
    lectures,
    exercises,
    getCachedLecture,
    getCachedExercise,
    updateCachedLecture,
    updateCachedExercise,
    deleteCachedExercise,
    deleteCachedLecture,
    loadLectureToCache,
    loadExerciseToCache,
    addLectureToCache,
    addExerciseToCache,
    media,
    addMediaToCache,
    getMedia,
  }

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

// Custom hooks to access specific parts of the state
export const useCourse = () => {
  const context = useContext(CourseContext);
  return {
    course: context.course,
    updateCourse: context.updateCourse,
    updateCachedCourseSections: context.updateCachedCourseSections,
  };
};

export const useSections = () => {
  const context = useContext(CourseContext);
  return {
    sections: context.sections,
    updateSections: context.updateSections,
    loadSectionToCache: context.loadSectionToCache,
    getCachedSection: context.getCachedSection,
    updateCachedSection: context.updateCachedSection,
    deleteCachedSection: context.deleteCachedSection,
    updateCachedSectionComponents: context.updateCachedSectionComponents,
    deleteCachedSectionComponent: context.deleteCachedSectionComponent,
    addCachedSectionComponent: context.addCachedSectionComponent,
  };
};

export const useLectures = () => {
  const context = useContext(CourseContext);
  return {
    lectures: context.lectures,
    getCachedLecture: context.getCachedLecture,
    updateCachedLecture: context.updateCachedLecture,
    deleteCachedLecture: context.deleteCachedLecture,
    loadLectureToCache: context.loadLectureToCache,
    addLectureToCache: context.addLectureToCache,
  };
};

export const useExercises = () => {
  const context = useContext(CourseContext);
  return {
    exercises: context.exercises,
    getCachedExercise: context.getCachedExercise,
    updateCachedExercise: context.updateCachedExercise,
    deleteCachedExercise: context.deleteCachedExercise,
    loadExerciseToCache: context.loadExerciseToCache,
    addExerciseToCache: context.addExerciseToCache,
  };
}

export const useMedia = () => {
  const context = useContext(CourseContext);
  return {
    media: context.media,
    addMediaToCache: context.addMediaToCache,
    getMedia: context.getMedia,
  };
}
