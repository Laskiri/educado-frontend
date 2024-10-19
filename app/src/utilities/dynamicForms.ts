// import hooks
import { useState } from "react";

// import service and utility
import ProfileServices from "../services/profile.services";
import useProfileValidation from "../utilities/useProfileValidation"
// import helpers
import { getUserInfo } from '../helpers/userInfo';
import {
  tempObjects,
  useEducationFormData,
  useExperienceFormData,
} from "../helpers/formStates";


export default () => {
  //validation
  const {
    handleValidation,
    experienceErrors,
    setExperienceErrors,
    educationErrorState,
    setEducationErrorState,
    educationErrors,
    setEducationErrors,
    experienceErrorState,
    setExperienceErrorState,
  } = useProfileValidation();

  //dynamic form states & localstorage details
  const { educationFormData: educationFormData, setEducationFormData } = useEducationFormData();
  const { experienceFormData: experienceFormData, setExperienceFormData } = useExperienceFormData();
  const userInfo:any = getUserInfo();

  // assign userID to localstorage ID
  let id: string;
  userInfo.id ? id = userInfo.id : id = "id";
  const [userID] = useState(id);

  // fetch data
  const fetchDynamicData = async () => {
    try {
      const educationResponse = await ProfileServices.getUserFormTwo(userID);
      setEducationFormData(educationResponse.data);
      for (let item in educationResponse.data) {
        setEducationErrors((prevState) => {
          let newState = [...prevState];
          newState.push({
            educationStartDate: "",
            educationEndDate: "",
          });
          return newState;
        });
      }
    } catch (error: any) {   
    }

    try {
    const experienceResponse = await ProfileServices.getUserFormThree(userID);
    setExperienceFormData(experienceResponse.data);
    for (let item in experienceResponse.data) {
      setExperienceErrors((prevState) => {
        let newState = [...prevState];
        newState.push({
          workStartDate: "",
          workEndDate: "",
        });
        return newState;
      });
    }
  } catch (error: any) {   
  }
  };

  //Handles for dynamic form of Education experience (input, create, delete)
  const handleEducationInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    let { name, value } = event.target;
    if ((name == "educationStartDate" || name == "educationEndDate") && value.length > 7) {
      return;
    }
    if (name == "educationStartDate" || name == "educationEndDate") {
      value = value.replace(/[^0-9/]/g, "");
    }

    //Validation
    handleValidation(index, name, value, "education");
    setEducationFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        [name]: value,
      };
      return newState;
    });
  };



  // loops through current input fiels displayed on the UI,and assign them to not being null
  const dynamicInputsFilled = (dynamicForm: any) => {
    if (dynamicForm === "education") {
      const EducationInputsFilled = educationFormData.every(
        (item) =>
          item.educationStartDate?.trim() !== "" &&
          item.educationEndDate?.trim() !== "" &&
          item.course?.trim() !== "" &&
          item.institution?.trim() !== ""
      );
      console.log("Education form filled: ", EducationInputsFilled, "\nData: ", educationFormData)
      return EducationInputsFilled;
    } 
    else {
      const ExperienceInputsFilled = experienceFormData.every(
        (item) =>
          item.company?.trim() !== "" &&
          item.jobTitle?.trim() !== "" &&
          item.workStartDate?.trim() !== "" &&
          item.workEndDate?.trim() !== "" &&
          item.description?.trim() !== ""
      );
      console.log("Experience form filled: ", ExperienceInputsFilled, "\nData: ", experienceFormData)
      return ExperienceInputsFilled;
    }
  };


  //Display date errors
 const [submitError, setSubmitError] = useState(false);

  const SubmitValidation = () => {
    if (
      !dynamicInputsFilled("education") ||
      !dynamicInputsFilled("experience") 
    ) {
      setSubmitError(true);
    } else {
      setSubmitError(false);
    }
  };

  //Creates dynamic block based on conditions
  const addNewEducationForm = async (index: number) => {
    if (!educationErrorState && dynamicInputsFilled("education")) {
      setEducationErrors((prevState) => {
        let newState = [...prevState];
        newState.push({
          educationStartDate: "",
          educationEndDate: "",
        });
        return newState;
      });
      setEducationFormData([
        ...educationFormData,
        {
          status: "",
          institution: "",
          course: "",
          educationLevel: "",
          educationStartDate: "",
          educationEndDate: "",
          _id: null,
        },
      ]);
    }
  };

  //Deletes dynamic form for academdic experience
  const handleEducationDelete = async (index: number, _id: string | null) => {
    //Deletes form.
    if (_id) {
      await ProfileServices.deleteEducationForm(_id);
    }

    const updatedEducationFormation = educationFormData.filter(
      (_, i) => i !== index
    );
    setEducationFormData(updatedEducationFormation);

    //input date Validation state
    if (
      educationErrors[index].educationStartDate != "" ||
      educationErrors[index].educationEndDate != ""
    ) {
      setEducationErrorState(false);
    }
    setEducationErrors((prevState) => {
      let newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  //Handles for dynamic professional expereience form (input, create, delete)
  const addNewExperienceForm = async (index: number) => {
    //Creates new dynamic block based on conditions
    if (!experienceErrorState && dynamicInputsFilled("experience")) {
      setExperienceErrors((prevState) => {
        let newState = [...prevState];
        newState.push({
          workStartDate: "",
          workEndDate: "",
        });
        return newState;
      });
      setExperienceFormData([
        ...experienceFormData,
        {
          company: "",
          jobTitle: "",
          workStartDate: "",
          workEndDate: "",
          checkBool: false,
          description: "",
          _id: null,
        },
      ]);
    }
  };

  //checkbox
  const handleCheckboxChange = (index: number): void => {
    setExperienceFormData((prevState) => {
      let newState = [...prevState];
      newState[index] = {
        ...newState[index],
        checkBool: !newState[index].checkBool,
      };
      return newState;
    });
  };

  //Deletes dynamic form for professional experience
  const handleExperienceDelete = async (index: number, _id: string | null) => {
    //Delete dynamic block
    if (_id) {
      await ProfileServices.deleteExperienceForm(_id);
    }

    const updatedExperienceFormation = experienceFormData.filter(
      (_, i) => i !== index
    );
    setExperienceFormData(updatedExperienceFormation);

    // If deleted state has validation error then clear state
    if (
      experienceErrors[index].workStartDate != "" ||
      experienceErrors[index].workEndDate != ""
    ) {
      setExperienceErrorState(false);
    }
    setExperienceErrors((prevState) => {
      let newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  //Count characters written in professional description
  const handleCountExperience = (index: any) => {
    // if description is not existing then return nothing
    if(experienceFormData.length === 0 || !experienceFormData[index].description) {
      return 0;
    }
    let text = experienceFormData[index].description;
    text = text.replace(/\s/g, "");
    return text.length;
  };

  //handle for dynamic personal experiience form
  const handleExperienceInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ): void => {
    // let { name, value } = event.target;
    let { name, value } = event.target as { name: "workStartDate" | "workEndDate"; value: string };
    if ((name == "workStartDate" || name == "workEndDate") && value.length > 7) {
      return;
    }
    if (name == "workStartDate" || name == "workEndDate") {

      value = value.replace(/[^0-9/]/g, "");
    }
    handleValidation(index, name, value, "experience");
    setExperienceFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        [name]: value,
      };
      return newState;
    });
  };

  return {
    educationErrorState,
    experienceErrorState,
    experienceErrors,
    educationErrors,
    handleExperienceInputChange,
    handleCountExperience,
    handleCheckboxChange,
    handleExperienceDelete,
    addNewExperienceForm,
    handleEducationDelete,
    addNewEducationForm,
    SubmitValidation,
    submitError,
    handleEducationInputChange,
    fetchDynamicData,
    userID,
    experienceFormData: experienceFormData,
    educationFormData: educationFormData,
    dynamicInputsFilled
    
  };
};
