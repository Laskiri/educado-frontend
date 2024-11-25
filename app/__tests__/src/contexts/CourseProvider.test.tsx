// FILE: app/src/contexts/courseStore.test.tsx
import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { CourseProvider, useCourse, useSections, useLectures, useExercises, useMedia } from '@contexts/courseStore';

// Mock the formatCourse function
jest.mock('@helpers/courseStoreHelper', () => ({
  formatCourse: jest.fn(),
}));

const mockCourse = {
  _id: '0',
  title: 'Test Course',
  description: 'Test Description',
  difficulty: 1,
  coverImg: 'test.jpg',
  estimatedHours: 0,
  category: 'Test Category',
  status: 'Draft',
  sections: []
};

const mockSection = {
  _id: '0',
  title: 'Test Section',
  description: '',
  totalPoints: 0,
  parentCourse: '1',
  components: []
};

const mockLecture = {
  _id: '0',
  title: 'Test Lecture',
  contentType: 'text',
  parentSection: '1', 
  description: 'Sample description', 
  content: 'Sample content'
};

const mockExercise = { 
  _id: '0', 
  title: 'Sample Exercise', 
  parentSection: '1', 
  question: 'Sample Question' }

const mockMedia = {
  id: '0',
  file: new File([''], 'test.mp4', { type: 'video/mp4' }),
  parentType: 'c'
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CourseProvider>{children}</CourseProvider>
);
describe('CourseProvider', () => {
  it('should update course', () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCourse(mockCourse);
    });
    expect(result.current.course).toEqual(mockCourse);
  });

  it('should update course field', () => {
    const { result } = renderHook(() => useCourse(), { wrapper: Wrapper });
    act(() => {
      result.current.updateCourseField({ title: 'Updated Title' });
    });
  });
  
  it('should create a new section with correct properties', () => {
    const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
    act(() => {
      result.current.createNewSection();
    });
    const newSection = result.current.sections[0];
    expect(newSection).toEqual({
      _id: '1',
      title: '',
      description: '',
      totalPoints: 0,
      parentCourse: mockCourse._id,
      components: [],
    });
    expect(result.current.sections.length).toBe(1);
      // expect(result.current.course.sections).toContain(newSection._id);
  });

    it('should increment section id when creating a new section', async () => {
      const useCombinedHooks = () => {
        const sectionsHook = useSections();
        const courseHook = useCourse();
      
        return { sectionsHook, courseHook };
      };


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
    const section = result.current.getCachedSection('0');
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

  it('should delete cached section', () => {
    const { result } = renderHook(() => useSections(), { wrapper: Wrapper });
    act(() => {
      result.current.loadSectionToCache(mockSection);
      result.current.deleteCachedSection('1');
    });
    const section = result.current.getCachedSection('1');
    expect(section).toBeNull();
  });

  it('should add lecture to cache', () => {
    const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
    act(() => {
      result.current.addLectureToCache(mockLecture);
    });
    expect(result.current.lectures).toContainEqual(mockLecture);
  });

  it('should get cached lecture', () => {
    const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
    act(() => {
      result.current.addLectureToCache(mockLecture);
    });
    const lecture = result.current.getCachedLecture('1');
    expect(lecture).toEqual(mockLecture);
  });

  it('should update cached lecture', () => {
    const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
    act(() => {
      result.current.addLectureToCache(mockLecture);
      result.current.updateCachedLecture({ ...mockLecture, title: 'Updated Lecture' });
    });
    const lecture = result.current.getCachedLecture('1');
    expect(lecture?.title).toBe('Updated Lecture');
  });

  it('should delete cached lecture', () => {
    const { result } = renderHook(() => useLectures(), { wrapper: Wrapper });
    act(() => {
      result.current.addLectureToCache(mockLecture);
      result.current.deleteCachedLecture('1');
    });
    const lecture = result.current.getCachedLecture('1');
    expect(lecture).toBeNull();
  });

  it('should add exercise to cache', () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
    });
    expect(result.current.exercises).toContainEqual(mockExercise);
  });

  it('should get cached exercise', () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
    });
    const exercise = result.current.getCachedExercise('1');
    expect(exercise).toEqual(mockExercise);
  });

  it('should update cached exercise', () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
      result.current.updateCachedExercise({ ...mockExercise, title: 'Updated Exercise' });
    });
    const exercise = result.current.getCachedExercise('1');
    expect(exercise?.title).toBe('Updated Exercise');
  });

  it('should delete cached exercise', () => {
    const { result } = renderHook(() => useExercises(), { wrapper: Wrapper });
    act(() => {
      result.current.addExerciseToCache(mockExercise);
      result.current.deleteCachedExercise('1');
    });
    const exercise = result.current.getCachedExercise('1');
    expect(exercise).toBeNull();
  });

  it('should add media to cache', () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    expect(result.current.media).toContainEqual(mockMedia);
  });

  it('should get media', () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    const mediaFile = result.current.getMedia('0');
    expect(mediaFile).toEqual(mockMedia.file);
  });

  it('should update media', () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
    });
    result.current.updateMedia({id : mockMedia.id, file: new File([''], 'updated.mp4', { type: 'video/mp4' }), parentType: 'c' });
    
    const mediaFile = result.current.getMedia(mockMedia.id);
    expect(mediaFile?.name).toBe('updated.mp4');
  });

  it('should delete media', () => {
    const { result } = renderHook(() => useMedia(), { wrapper: Wrapper });
    act(() => {
      result.current.addMediaToCache(mockMedia);
      result.current.deleteMedia('0');
    });
    const mediaFile = result.current.getMedia('0');
    expect(mediaFile).toBeNull();
  });
});
