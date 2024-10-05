// Importing the 'useState' hook from React
import { useState } from "react";
import { useEducationErrors, useExperienceErrors } from "../helpers/formStates";

//Validation for month and day input
export default ()=>{

  //import education & experience date errors states
  const {educationErrors, setEducationErrors, educationErrorState, setEducationErrorState } = useEducationErrors();
  const {experienceErrors, setExperienceErrors, experienceErrorState, setExperienceErrorState} = useExperienceErrors();

      // validating date format & creating integer limits on the date format
      const dateValidation = (value: any) => {
        let month =
          parseInt(value.substring(0, 2)) >= 1 &&
          parseInt(value.substring(0, 2)) <= 12;
        const regex = new RegExp("/", "g");
        let matchResult = value.match(regex);
        let count = matchResult ? matchResult.length : 0;
        return (
          !value.includes("/") ||
          count > 1 ||
          !value.substring(0, 3).includes("/") ||
          value.length != 5 ||
          !month ||
          value.substring(3, 5) == 0
        );
      };

  // Handle validation based on form type (education/experience)
  const handleValidation = (index: number, name: string, value: string, forForm: string) => {
    const invalidDateFormatErrMsgStr = "Formato inválido! Utilize MM/AA.";

    // Set isEmpty to true if value is empty
    const isEmpty = value === "";

    // Set isInvalidDate to true if isEmpty is false and dateValidation returns true
    const isInvalidDate = !isEmpty && dateValidation(value);

    // Determine which state to update based on form type
    const setErrorState = forForm === 'education' ? setEducationErrorState : setExperienceErrorState;
    const setErrors = forForm === 'education' ? setEducationErrors : setExperienceErrors;

    // Set error state (only if there is an error and not when cleared)
    setErrorState(isInvalidDate);

    // Update error messages based on the input field
    setErrors((prevState) => {

      // Shallow copy of prevState array (good practice to avoid mutation)
      const newState = [...prevState] as { startDate: string; endDate: string }[];

      // Clear error if date input field is empty or valid
      newState[index][name as 'startDate' | 'endDate'] = isInvalidDate ? invalidDateFormatErrMsgStr : "";

      return newState;
    });
  };

  // Return states and validation function
  return {
      handleValidation,
      experienceErrors, setExperienceErrors,
      educationErrorState, setEducationErrorState,
      educationErrors, setEducationErrors,
      experienceErrorState, setExperienceErrorState
  }
}