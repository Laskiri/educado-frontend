import React, { createContext, useContext, useState } from 'react';
import { Course, Section } from '../interfaces/Course';

// Define the context type
interface CourseContextProps {
  course: Course | undefined;
  updateCourse: (course: Course) => void;
  sections: Section[];
  updateSections: (sections: Section[]) => void;
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
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);

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

  const value = {
    course,
    updateCourse,
    sections,
    updateSections,
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

