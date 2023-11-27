export interface Main {
  status:  number;
  success: boolean;
  count:   number;
  data:    Course[];
}

// TODO: Make sure this is in accordance with the backend


export interface Course {
  _id?:               string;
  title:             string;
  description:       string;
  difficulty:        number;
  dateCreated?:       Date;
  dateUpdated?:       Date;
  coverImg?:         string;
  category:          string;
  sections?:          Section[];
  creator?:           string;
  status:            string;
  estimatedHours?:    number;
  rating?:            number;
  numOfSubscriptions?:   number;
  __v?:               number;
}

export interface contentCreator {
	_id: string;
  firstName: string,
  lastName: string,
  email: string,
  motivation: string,
  approved: boolean,
  rejectionReason: string,
  dateCreated: Date,
  dateUpdated: Date,
}

export interface Section {
  _id:          string;
  title:        string;
  description:  string;
  totalPoints:  number;
  parentCourse: string;
}

export interface Lecture {
  components:     string[];
  title:          string
  description:    string;
  image:          string;
  video:          string;
  dateCreated:      Date;
  updatedAt:      Date;
  parentSection:  string;
  __v:            number;
}
