import React, { createContext, useContext, useState } from 'react';
import { Course, Section, Lecture } from '../interfaces/Course';

// Define the context type
interface CourseContextProps {
  course: Course | undefined;
  updateCourse: (course: Course) => void;
  sections: Section[];
  updateSections: (sections: Section[]) => void;
  lectures: Lecture[];
  updateLectures: (lectures: Lecture[]) => void;
}

interface CourseProviderProps {
  children: React.ReactNode;
}

// Create context with initial value
const CourseContext = createContext<CourseContextProps>({
  course: undefined,
  updateCourse: () => {},
  sections: [],
  updateSections: () => {},
  lectures: [],
  updateLectures: () => {}
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const updateCourse = (newCourse: Course) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      ...newCourse,
      creator: prevCourse?.creator ?? ''
    }));
  };

  const updateSections = (newSections: Section[]) => {
    setSections(prevSections => ([...prevSections, ...newSections]));
  };

  const updateLectures = (newLectures: Lecture[]) => {
    setLectures(prevLectures => ([...prevLectures, ...newLectures]));
  };

  const value = {
    course,
    updateCourse,
    sections,
    updateSections,
    lectures,
    updateLectures
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hooks to access specific parts of the state
export const useCourse = () => {
  const context = useContext(CourseContext);
  return { course: context.course, updateCourse: context.updateCourse };
};

export const useSections = () => {
  const context = useContext(CourseContext);
  return { sections: context.sections, updateSections: context.updateSections };
};

export const useLectures = () => {
  const context = useContext(CourseContext);
  return { lectures: context.lectures, updateLectures: context.updateLectures };
};