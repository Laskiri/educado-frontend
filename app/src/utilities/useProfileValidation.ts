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
          !value.includes("/")
            || count > 1
            || !value.substring(0, 3).includes("/")
            || value.length != 7    // Date must be 7 characters long (including '/' in MM/YYYY)
            || !month
            || value.substring(3, 7).length != 4    // Ensures that year is 4 digits
            || value.substring(3, 7) == "0000"    // Avoids year = 0000
        );
      };

      // Handling validation based on form type (education/experience)
    const handleValidation = (index: any, name: any, value: any, forForm :any) => {
        const invalidDateFormatErrMsgStr = "Formato inválido! Utilize: MM/AAAA";

        // Set education error state and update error messages based on the input field
        if(forForm == 'education'){
          if (dateValidation(value)) {
            if (name === "educationStartDate") {
              setEducationErrorState(true);
              setEducationErrors((prevState) => {
                let newState = [...prevState];
                newState[index].educationStartDate = invalidDateFormatErrMsgStr;
                return newState;
              });
            } else if (name === "educationEndDate") {
              setEducationErrorState(true);
              setEducationErrors((prevState) => {
                let newState = [...prevState];
                newState[index].educationEndDate = invalidDateFormatErrMsgStr;
                return newState;
              });
            }
          } else {
            // Reset education error state and clear error messages based on the input field
            setEducationErrorState(false);
            if (name === "educationStartDate") {
              setEducationErrors((prevState) => {
                let newState = [...prevState];
                newState[index].educationStartDate = "";
                return newState;
              });
            } else if (name === "educationEndDate") {
              setEducationErrors((prevState) => {
                let newState = [...prevState];
                newState[index].educationEndDate = "";
                return newState;
              });
            }
          }
        }else{
          // Set experience error state and update error messages based on the input field
          if (dateValidation(value)) {
            if (name === "workStartDate") {
              setExperienceErrorState(true);
              setExperienceErrors((prevState) => {
                let newState = [...prevState];
                newState[index].workStartDate = invalidDateFormatErrMsgStr;
                return newState;
              });
            } else if (name === "workEndDate") {
              setExperienceErrorState(true);
              setExperienceErrors((prevState) => {
                let newState = [...prevState];
                newState[index].workEndDate = invalidDateFormatErrMsgStr;
                return newState;
              });
            }
          } else {
            // Reset experience error state and clear error messages based on the input field
            setExperienceErrorState(false);
            if (name === "workStartDate") {
              setExperienceErrors((prevState) => {
                let newState = [...prevState];
                newState[index].workStartDate = "";
                return newState;
              });
            } else if (name === "workEndDate") {
              setExperienceErrors((prevState) => {
                let newState = [...prevState];
                newState[index].workEndDate = "";
                return newState;
              });
            }
          }
        }
      };
       // Returning states and validation function
    return {
        handleValidation,
        experienceErrors, setExperienceErrors,
        educationErrorState, setEducationErrorState,
        educationErrors, setEducationErrors,
        experienceErrorState, setExperienceErrorState
    }
}