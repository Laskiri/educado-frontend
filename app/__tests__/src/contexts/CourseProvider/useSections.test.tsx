import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { CourseProvider, useCourse, useSections } from '@contexts/courseStore';
import { mockCourse, mockSection, mockLecture, mockLectureComponent, mockExercise, mockExerciseComponent } from './mockData';
import { useCombinedHooks } from './testHelperFunctions';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);

describe('useSection', () => {
    it('should load section to cache properly', () => {
        const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
        act(() => {
          result.current.loadSectionToCache(mockSection);
        });
        expect(result.current.sections).toContainEqual(mockSection);
      }
    );

    it('should not load duplicate section to cache', () => {
        const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
        act(() => {
          result.current.loadSectionToCache(mockSection);
        });
        act(() => {
            result.current.loadSectionToCache(mockSection);
          });
        expect(result.current.sections.length).toBe(1);
      }
    );

    it('should create a new section with correct properties and append to course.sections', () => {
        const { result } = renderHook(() => useCombinedHooks(), { wrapper: Wrapper });
        act(() => {
          result.current.sectionsHook.createNewSection();
        });
        const newSection = result.current.sectionsHook.sections[0];
        expect(newSection).toEqual({
          _id: '1',
          title: '',
          description: '',
          totalPoints: 0,
          parentCourse: mockCourse._id,
          components: [],
        });
        expect(result.current.sectionsHook.sections.length).toBe(1);
        expect(result.current.courseHook.course.sections.includes(newSection._id)).toBe(true);
          // expect(result.current.course.sections).toContain(newSection._id);
      });
    
    it('should increment section id when creating a new section', async () => {
        const { result, rerender } = renderHook(() => useCombinedHooks(), { wrapper: Wrapper });

        // Call createNewSection and trigger state update
        act(() => {
        result.current.sectionsHook.createNewSection();
        });
    
        // Wait for the state update
        rerender();
    
        // Call createNewSection again and wait for state update
        act(() => {
        result.current.sectionsHook.createNewSection();
        });
        rerender();

        const firstSection = result.current.sectionsHook.sections[0];
        const secondSection = result.current.sectionsHook.sections[1];
        expect(firstSection._id).toBe('1');
        expect(secondSection._id).toBe('2');
        expect(result.current.courseHook.course.sections.length).toBe(2);
        expect(result.current.courseHook.course.sections).toContain(firstSection._id);
        expect(result.current.courseHook.course.sections).toContain(secondSection._id);
    });
      
    
      it('should get cached section', () => {
        const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
        act(() => {
          result.current.loadSectionToCache(mockSection);
        });
        const section = result.current.getCachedSection(mockSection._id);
        expect(section).toEqual(mockSection);
      });
    
      it('should update cached section', () => {
        const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
        act(() => {
          result.current.loadSectionToCache(mockSection);
          result.current.updateCachedSection({ title: 'Updated Section' }, '0');
        });
        const section = result.current.getCachedSection('0');
        expect(section?.title).toBe('Updated Section');
      });
    
      it('should delete cached section and associated id on course.sections', () => {
        const { result } = renderHook(() => useCombinedHooks(), { wrapper: Wrapper });
        act(() => {
          result.current.sectionsHook.createNewSection();
          result.current.sectionsHook.deleteCachedSection('1'); */
        });
        const section = result.current.sectionsHook.getCachedSection('1');
        expect(section).toBeNull();
        expect(result.current.courseHook.course.sections).not.toContain('1');
      });
    
      it('should delete cachedSectionComponent and corresponding lecture', () => {
        const { result } = renderHook(() => useCombinedHooks(), { wrapper: Wrapper });
        act(() => {
          const newSec = result.current.sectionsHook.loadSectionToCache(mockSection);
          result.current.sectionsHook.addCachedSectionComponent(newSec._id, mockLectureComponent);
          const newLec = result.current.lecturesHook.loadLectureToCache(mockLecture);
          result.current.sectionsHook.deleteCachedSectionComponent(mockSection._id, newLec._id); 
        });
        const section = result.current.sectionsHook.getCachedSection('0');
        expect(section?.components).toEqual([]);
        const lectures = result.current.lecturesHook.lectures;
        expect(lectures).toEqual([]);
      });
      it('should delete cachedSectionComponent and corresponding exercise', () => {
        const { result } = renderHook(() => useCombinedHooks(), { wrapper: Wrapper });
        act(() => {
          result.current.sectionsHook.loadSectionToCache(mockSection);
          result.current.sectionsHook.addCachedSectionComponent('0', mockExerciseComponent);
          const newExercise = result.current.exercisesHook.loadExerciseToCache(mockExercise);
          result.current.sectionsHook.deleteCachedSectionComponent(mockSection._id, newExercise._id); 
        });
        const section = result.current.sectionsHook.getCachedSection(mockSection._id);
        expect(section?.components).toEqual([]);
        const exercises = result.current.exercisesHook.exercises;
        expect(exercises).toEqual([]);
      });
    
});