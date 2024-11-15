import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Section } from '../interfaces/Course';

// Define the context type
interface CourseContextProps {
  course: Course | undefined;
  updateCourse: (course: Course) => void;
  sections: Section[];
  updateSections: (sections: Section[]) => void;
  loadSectionToCache: (section: Section) => void;
  getCachedSection: (sid: string) => Section | null;
  updateCachedSection: (section: Section) => void;
  deleteCachedSection: (sid: string) => void;
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
  loadSectionToCache: () => {},
  getCachedSection: () => null,
  updateCachedSection: () => {},
  deleteCachedSection: () => {},
});

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    console.log('CourseProvider mounted');
    return () => {
      console.log('CourseProvider unmounted');
    };
  }, []);

  useEffect(() => {
    /* console.log('Change to store:' + JSON.stringify(course));
    console.log ('Sections: ' + JSON.stringify(sections)); */
  }, [sections]);

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

  const loadSectionToCache = (newSection: Section) => {
    console.log('Adding section to store: ' + JSON.stringify(sections));
    console.log('Newsection: ' + JSON.stringify(newSection));
    if (sections.find((section) => section._id === newSection._id)) return;
    if (course && course.sections && !course.sections.includes(newSection._id)){
      setCourse(prevCourse => {
        if (!prevCourse) return prevCourse;
        return {
          ...prevCourse,
          sections: [...(prevCourse.sections || []), newSection._id]
        };
      });
    }
    setSections(prevSections => ([...prevSections, newSection]));
  }


  const getCachedSection = (sid: string) => {
    if (sections.length == 0) return null;
    return sections.find((section) => section._id === sid) || null;
  }

  const updateCachedSection = (section: Section) => {
    setSections(prevSections => {
      const index = prevSections.findIndex((s) => s._id === section._id);
      if (index === -1) return prevSections;
      console.log('Updating section: ' + JSON.stringify(prevSections[index]));
      console.log('With: ' + JSON.stringify(section));
      prevSections[index] = section;
      return prevSections;
    });
  }

  const deleteCachedSection = (sid: string) => {
    setSections(prevSections => prevSections.filter(section => section._id !== sid));
    setCourse(prevCourse => {
        if (!prevCourse) return prevCourse;
        return {
            ...prevCourse,
            sections: prevCourse.sections?.filter(sectionId => sectionId !== sid) || prevCourse.sections
          };
      });
  };


  const value = {
    course,
    updateCourse,
    sections,
    updateSections,
    loadSectionToCache,
    getCachedSection,
    updateCachedSection,
    deleteCachedSection
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
  return { sections: context.sections, updateSections: context.updateSections , loadSectionToCache: context.loadSectionToCache, getCachedSection: context.getCachedSection, updateCachedSection: context.updateCachedSection, deleteCachedSection: context.deleteCachedSection };
};

