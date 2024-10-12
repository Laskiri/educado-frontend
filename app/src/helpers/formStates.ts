import { useState } from "react";
import { FormData, EducationFormData, ExperienceFormData } from "../interfaces/Profile";



// static form states
export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    UserName: "",
    UserEmail: "",
    bio: "",
    linkedin: "",
    photo: "",
  });

  return { formData, setFormData };
};

// dynamic form states - academic
export const useEducationFormData = () => {
  const [educationFormData, setEducationFormData] = useState<EducationFormData[]>([
    {
      status: "",
      institution: "",
      course: "",
      educationLevel: "",
      startDate: "",
      endDate: "",
      _id: null,
    },
  ]);

  return { educationFormData: educationFormData, setEducationFormData };
};

// dynamic form states - professional
export const useExperienceFormData = () => {
  const [experienceFormData, setExperienceFormData] = useState<ExperienceFormData[]>([
    {
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      checkBool: false,
      description: "",
      _id: null,
    },
  ]);

  return { experienceFormData: experienceFormData, setExperienceFormData };
};


// Error states academic
export const useEducationErrors = () => {
const [educationErrors, setEducationErrors] = useState([
  {
    startDate: "",
    endDate: "",
  },
]);

const [educationErrorState, setEducationErrorState] = useState(false);
return {educationErrors, setEducationErrors, educationErrorState, setEducationErrorState}
}

export const useExperienceErrors = () => {

// Error states professionnal
const [experienceErrors, setExperienceErrors] = useState([
  {
    startDate: "",
    endDate: "",
  },
]);
const [experienceErrorState, setExperienceErrorState] = useState(false);

return {experienceErrors, setExperienceErrors, experienceErrorState, setExperienceErrorState}
}

export const tempObjects = () => {
    // Create empty object for professional experience
    const emptyAcademicObject = [
      {
        status: "",
        institution: "",
        course: "",
        educationLevel: "",
        startDate: "",
        endDate: "",
        _id: null,
      },
    ];
  
    // Create empty object for professional experience
    const emptyProfessionalObject = [
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        checkBool: false,
        description: "",
        _id: null,
      },
    ];

    return {emptyAcademicObject, emptyProfessionalObject}
}

  export const tempData = () => {
    // Create empty object for professional experience
    const [tempProfessionalObject, setTempProfessionalObject] = useState<ExperienceFormData[]>([
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        checkBool: false,
        description: "",
        _id: null,
      },
    ]);
  
    return { tempProfessionalObject, setTempProfessionalObject };
  }