export const mockCourse = {
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
  
export const mockSection = {
    _id: '0',
    title: 'Test Section',
    description: '',
    totalPoints: 0,
    parentCourse: '0',
    components: []
};

export const mockLectureComponent = {
    compId: '0',
    compType: 'lecture',
    _id: '0'
}

export const mockExerciseComponent = {
    compId: '0',
    compType: 'exercise',
    _id: '0'
}

export const mockLecture = {
    _id: '0',
    title: 'Test Lecture',
    contentType: 'text',
    parentSection: '0', 
    description: 'Sample description', 
    content: 'Sample content'
};

export const mockExercise = { 
    _id: '0', 
    title: 'Sample Exercise', 
    parentSection: '0', 
    question: 'Sample Question' 
}

export const mockMedia = {
    id: '0',
    file: new File([''], 'test.mp4', { type: 'video/mp4' }),
    parentType: 'c'
};