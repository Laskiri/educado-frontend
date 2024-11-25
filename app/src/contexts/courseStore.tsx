import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Course,
  Section,
  Component,
  Lecture,
  Media,
  Exercise,
  FormattedCourse,
} from "../interfaces/Course";
import { formatCourse } from "@helpers/courseStoreHelper";


// Define the context type
interface CourseContextProps {
  course: Course;
  getFormattedCourse: () => FormattedCourse;
  updateCourse: (course: Course) => void;
  updateCourseField: (fieldChange: Partial<Course>) => void;
  updateCachedCourseSections: (sections: string[]) => void;
  sections: Section[];
  createNewSection: () => Section;
  updateSections: (sections: Section[]) => void;
  loadSectionToCache: (section: Section) => void;
  getCachedSection: (sid: string) => Section | null;
  updateCachedSection: (fieldChange: Partial<Section>, sid: string) => void;
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
  addLectureToCache: (lecture: Lecture) => Lecture;
  addExerciseToCache: (exercise: Exercise) => Exercise;
  media : Media[];
  addMediaToCache: (media: Media) => void;
  getMedia: (mid: string) => File | null;
  updateMedia: (media: Media) => void;
}

interface CourseProviderProps {
  children: React.ReactNode;
}

// Create context with initial value
const CourseContext = createContext<CourseContextProps>({
  course: {} as Course,
  getFormattedCourse: () => ({} as FormattedCourse),
  updateCourse: () => {},
  updateCourseField: () => {},
  updateCachedCourseSections: () => {},
  sections: [] as Section[],
  createNewSection: () => ({
    _id: "",
    title: "",
    description: "",
    totalPoints: 0,
    parentCourse: "",
    components: [],
  }),
  updateSections: () => {},
  loadSectionToCache: () => {},
  getCachedSection: () => null,
  updateCachedSection: () => {},
  deleteCachedSection: () => {},
  updateCachedSectionComponents: () => {},
  deleteCachedSectionComponent: () => {},
  addCachedSectionComponent: (sectionId: string, component: Component) => component,
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
  addLectureToCache: () => ({} as Lecture),
  addExerciseToCache: () => ({} as Exercise),
  media: [],
  addMediaToCache: () => {},
  getMedia: () => null,
  updateMedia: () => {},
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course>({} as Course);
  const [sections, setSections] = useState<Section[]>([] as Section[]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [idMaker, setIdMaker] = useState({"section": 0, "component": 0});

  

  useEffect(() => {
    return () => {
    };
  }, []);


  useEffect(() => {
    console.log("Media updated", media);
  }, [media]);





  const getFormattedCourse = () => {
    const formattedCourse = formatCourse(course, sections, lectures, exercises, media);
    return formattedCourse;
  }



  const updateCourse = (newCourse: Course) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      ...newCourse,
    }));
  };

  const updateCourseField = (fieldChange: Partial<Course>) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      ...fieldChange,
    })); 
  }

  const updateCachedCourseSections = (newSections: string[]) => {

    setCourse((prevCourse) => ({
      ...prevCourse,
      sections: newSections,
    }));
  };

  const updateSections = (newSections: Section[]) => {
    setSections((prevSections) => [...prevSections, ...newSections]);
  };


  const createNewSection = () => {
    const newId = idMaker.section + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, section: newId }));
    const newSection = {
      _id : newId.toString(),
      title: "",
      description: "",
      totalPoints: 0,
      parentCourse: course._id ?? "0",
      components: [],
    }
    setSections((prevSections) => [...prevSections, newSection]);
    setCourse((prevCourse) => {
      return {
        ...prevCourse,
        sections: [...prevCourse.sections, newSection._id],
      };
    });
    return newSection;
  }

  const loadSectionToCache = (newSection: Section) => {
    if (sections.find((section) => section._id === newSection._id)) return;
    if (!course.sections.includes(newSection._id)) {
      setCourse((prevCourse) => {
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

  const updateCachedSection = (fieldChange: Partial<Section>, sid: string) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === sid);
      if (index === -1) return prevSections;
      const updatedSection = { ...prevSections[index], ...fieldChange };
      const updatedSections = [...prevSections];
      console.log(prevSections[index]);
      
      updatedSections[index] = updatedSection;
      console.log(updatedSections[index]);
      return updatedSections;
    });
  };

  const updateCachedSectionComponents = (
    sectionId: string,
    adjustedComponents: Component[]
  ) => {
    setSections((prevSections) => {
      const index = prevSections.findIndex((s) => s._id === sectionId);
      if (index === -1) return prevSections;
    
      // Create a new array with the updated section
      const newSections = [...prevSections];
      newSections[index] = {
        ...newSections[index],
        components: adjustedComponents,
      };
    
      return newSections;
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
    console.log("Adding component", component);
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({ ...prevIdMaker, component: newId }));
    component._id = newId.toString();
  
    setSections((prevSections) => {
      const sectionIndex = prevSections.findIndex((s) => s._id === sectionId);
      if (sectionIndex === -1) return prevSections;
  
      const updatedComponents = [...prevSections[sectionIndex].components, component];
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...prevSections[sectionIndex],
        components: updatedComponents,
      };
      console.log("Updated sections", updatedSections);
  
      return updatedSections;
    });
  
    return component;
  };

  const deleteCachedSection = (sid: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.parentSection !== sid)
    );
    setLectures((prevLectures) => {
      return prevLectures.filter((lecture) => {
        if (lecture.parentSection !== sid) {
          return true;
        }
        if (lecture.contentType === 'video') {
          deleteMedia(lecture._id); 
        }
        return false;
      });
    });
    setSections((prevSections) =>
      prevSections.filter((section) => section._id !== sid)
    );
    setCourse((prevCourse) => {
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
      prevLectures.filter((lecture) => {
        if (lecture._id === lid && lecture.contentType === 'video') {
          deleteMedia(lid);
        }
        lecture._id !== lid})
    );   
  };

  const getCachedLecture = (lid: string) => {
    return lectures.find((lecture) => lecture._id === lid) || null;
  }

  const addLectureToCache = (newLecture: Lecture) => {
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({...prevIdMaker, component: newId}));
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
    const newId = idMaker.component + 1;
    setIdMaker((prevIdMaker) => ({...prevIdMaker, component: newId}));
    newExercise._id = newId.toString();
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    return newExercise;
  }

  const addMediaToCache = (newMedia: Media) => {
    console.log("Adding media", newMedia);
    if (media.find((media) => media.id === newMedia.id)) return;
    setMedia((prevMedia) => [...prevMedia, newMedia]);
  }

  const getMedia = (mid: string) => {
    const mediaItem = media.find((media) => media.id === mid);
    return mediaItem ? mediaItem.file : null;
  };

  const deleteMedia = (mid: string) => {
    setMedia((prevMedia) => prevMedia.filter((media) => media.id !== mid));
  }

  const updateMedia = (newMedia: Media) => {
    const index = media.findIndex((media) => media.id === newMedia.id);
    if (index === -1) return;
    const updatedMedia = [...media];
    updatedMedia[index] = newMedia;
    setMedia(updatedMedia);
  }

  



  const value = {
    course,
    getFormattedCourse,
    updateCourse,
    updateCourseField,
    updateCachedCourseSections,
    sections,
    createNewSection,
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
    updateMedia,
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
    getFormattedCourse: context.getFormattedCourse,
    updateCourse: context.updateCourse,
    updateCourseField: context.updateCourseField,
    updateCachedCourseSections: context.updateCachedCourseSections,
  };
};

export const useSections = () => {
  const context = useContext(CourseContext);
  return {
    sections: context.sections,
    createNewSection: context.createNewSection,
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
    updateMedia: context.updateMedia,
  };
}
