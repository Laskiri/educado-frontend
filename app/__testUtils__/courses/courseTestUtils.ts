import { Course, Section } from '../../src/interfaces/Course'

interface PartialCourse {
  _id?:                string;
  title?:              string;
  category?:           string;
  coverImg?:           string;
  description?:        string;
  creators?:           number[];
  difficulty?:         number;
  status?:             string;
  estimatedHours?:     number;
  rating?:             number;
  numOfSubscriptions?: number;
  modifiedAt?:         Date;
  createdAt?:          Date;
  sections?:           Section[];
  __v?:                number;
}

/**
 * Generates a mock course for testing from partial options
 * 
 * @param options an object containing just the course options you want to set
 * @returns Course
 */
export const generateTestCourse = (options: PartialCourse = {}): Course => {
  return {
    _id: options._id ?? '1',
    title: options.title ?? 'Test course',
    description: options.description ?? 'A mock course for testing',
    createdAt: options.createdAt ?? (new Date('2023-10-10T00:00:00.000Z')),
    modifiedAt: options.modifiedAt ?? (new Date('2023-10-13T13:01:00.000Z')),
    coverImg: options.coverImg ?? '',
    category: options.category ?? 'health and workplace safety',
    sections: options.sections ?? [],
    creators: options.creators ?? [1],
    difficulty: options.difficulty ?? 2,
    status: options.status ?? 'draft',
    estimatedHours: options.estimatedHours ?? 8.5,
    rating: options.rating ?? 4.5,
    numOfSubscriptions: options.numOfSubscriptions ?? 157,
    __v: options.__v ?? 0,
  }
}
