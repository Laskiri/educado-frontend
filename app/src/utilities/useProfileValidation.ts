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

  // Validation of date input fields for education and experience forms
  const validateDateInput = (index: number, name: 'startDate' | 'endDate', value: string, formType: 'education' | 'experience') => {
    console.log("handleValidation called!");  // TODO: REMOVE AFTER DEBUGGING!
    const invalidDateFormatErrMsgStr = "Formato inválido! Utilize MM/AA.";
    const isInputFieldEmpty = value === "";
    const isDateInvalid = !isInputFieldEmpty && dateValidation(value);

    // Determine which state to update based on form type
    const setErrorState = formType === 'education' ? setEducationErrorState : setExperienceErrorState;
    const setErrors = formType === 'education' ? setEducationErrors : setExperienceErrors;

    // Set the error state to true if the date format is invalid, otherwise clear the error state
    setErrorState(isDateInvalid);

    // Update the error message for the specified input field
    setErrors((prevState) => {
      const newState = [...prevState];

      // Clear error if date input field is empty or valid
      newState[index][name] = isDateInvalid ? invalidDateFormatErrMsgStr : "";

      return newState;
    });
  };

  // Return states and validation function
  return {
      validateDateInput: validateDateInput,
      experienceErrors, setExperienceErrors,
      educationErrorState, setEducationErrorState,
      educationErrors, setEducationErrors,
      experienceErrorState, setExperienceErrorState
  }
}