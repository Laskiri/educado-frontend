import { Answer } from "./Answer";

export interface Main {
  status: number;
  success: boolean;
  count: number;
  data: Course[];
}

// TODO: Make sure this is in accordance with the backend


export interface Course {
  _id?: string;
  title: string;
  description: string;
  difficulty: number;
  dateCreated?: Date;
  dateUpdated?: Date;
  coverImg?: string;
  category: string;
  sections?: string[];
  creator?: string;
  status: string;
  estimatedHours?: number;
  rating?: number;
  numOfSubscriptions?: number;
  __v?: number;
}

export interface contentCreator {
  _id: string;
  firstName: string,
  lastName: string,
  email: string,
  motivation: string,
  approved?: boolean,
  rejectionReason: string,
  dateCreated?: Date,
  dateUpdated?: Date,
}

export interface Section {
  _id: string;
  title: string;
  description: string;
  totalPoints?: number;
  parentCourse: string;
  components: Component[];
}

export interface Component {
  compId: string;
  compType: string;
  _id: string;
}

export interface Lecture {
  parentSection: string,
  _id: string,
  title: string,
  description: string,
  contentType: string,
  content: string,
}

export interface Media {
  id: string,
  file: File,
  parentType: string,
}

export interface Exercise {
  _id: string,
  parentSection: string,
  title: string,
  question: string,
  answers?: Answer[]
}

export interface FormattedCourse {
  courseInfo: {
    _id: string;
    title: string;
    category: string;
    difficulty: number;
    description: string;
    coverImg: string;
    status: string;
  };
  sections: {
    _id: string;
    title: string;
    description: string;
    components: {
      compType: string;
      component: Lecture | Exercise;
      video: Media | null;
    }[];
  }[];
}