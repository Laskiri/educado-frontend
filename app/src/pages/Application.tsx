// Hooks
import { useNavigate, Link, useParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from 'react';

// Services
import AuthService from "../services/auth.services"

// Interfaces
import { NewApplication } from "../interfaces/Application"

// Components
import Motivation from '../components/Application/Motivation';
import AcademicExperienceForm from "../components/ProfileForms/AcademicExperience";
import ProfessionalExperienceForm from "../components/ProfileForms/ProfessionalExperience";
import GenericModalComponent from '../components/GenericModalComponent';
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import dynamicForms from "../utilities/dynamicForms";
import { tempObjects } from "../helpers/formStates";
import MiniNavbar from "../components/navbar/MiniNavbar";
import motivation from "../components/Application/Motivation";

const Application = () => {

  // State for the motivation form field
  const [isMotivationFilled, setIsMotivationFilled] = useState(false);

  // States for
  const [areAllFormsFilled, setAreAllFormsFilled] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // State for the confirmation modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // States for whether dynamic forms are expanded or collapsed
  const [isAcademicExperienceOpen, setIsAcademicExperienceOpen] = useState(false);
  const [isProfessionalExperienceOpen, setIsProfessionalExperienceOpen] = useState(false);

  // Functions to open and close the confirmation modal
  const openModal = () => {
      setIsModalVisible(true);
  }

  const closeModal = () => {
      setIsModalVisible(false);
  }

  // Get id from URL
  const { id } = useParams();
  
  const navigate = useNavigate(); 

  // Function for deciding the different values in the form
  const { register, handleSubmit, formState: { errors } } = useForm<NewApplication>();

  // Destructuring of functions and states from dynamicForms and tempObjects
  const {
    experienceErrors,
    educationErrors,
    handleExperienceInputChange,
    handleCountExperience,
    handleExperienceDelete,
    addNewExperienceForm,
    handleEducationDelete,
    addNewEducationForm,
    submitError,
    handleEducationInputChange,
    experienceFormData,
    educationFormData,
    handleCheckboxChange,
    SubmitValidation,
    dynamicInputsFilled,
    educationErrorState,
    experienceErrorState,
  } = dynamicForms();

  const { emptyAcademicObject, emptyProfessionalObject } = tempObjects();

  // TODO: unnecessary?
  useEffect(() => {
    setHasSubmitted(false);
  }, [educationFormData, experienceFormData, motivation]);

  /**
    * OnSubmit function for Application.
    * Takes the submitted data from the form and sends it to the backend through a service.
    * Navigates to the Login page upon receiving a successful response
    *
    * @param {JSON} data Which includes the value of the various fields in the application
    */
  const onSubmit: SubmitHandler<NewApplication> = async (data) => {
    /*if (hasSubmitted || educationErrorState || experienceErrorState ||
        !dynamicInputsFilled("education") || !dynamicInputsFilled("experience"))
      return;*/

    const applicationData = {
      baseUser: id,
      motivation: data.motivation,

      educationLevel: educationFormData.map((data) => data.educationLevel),
      academicStatus: educationFormData.map((data) => data.status),
      major: educationFormData.map((data) => data.course),
      institution: educationFormData.map((data) => data.institution),
      educationStartDate: educationFormData.map((data) => data.educationStartDate),
      educationEndDate: educationFormData.map((data) => data.educationEndDate),

      company: experienceFormData.map((data) => data.company),
      position: experienceFormData.map((data) => data.jobTitle),
      workStartDate: experienceFormData.map((data) => data.workStartDate),
      workEndDate: experienceFormData.map((data) => data.workEndDate),
      workActivities: experienceFormData.map((data) => data.description)
    };

    console.log("[Pre post] applicationData: ", applicationData);

    AuthService.postNewApplication(applicationData).then((res) =>{
      if(res.status == 201){
        navigate("/login", { state: { applicationSubmitted: true } });
      }
    }).catch((error) => {
      console.error("Error submitting application:", error);
      navigate("/login", { state: { applicationSubmitted: true } });  // TODO: remove!
    })
  };

  return (
    <main className="flex-grow overflow-x-hidden bg-[#E4F2F5] h-screen font-['Montserrat']">

      {/* Mini navbar */}
      <MiniNavbar />

      {/* Header and paragraph text */}
      <div className="items-center text-center p-10 pt-20">

        {/* Glad you want to be part of Educado! */}
        <h1 className="text-primary text-[32px] font-bold">
          Que bom que você quer fazer parte do Educado!
        </h1>

        {/* We need some information to approve your content creator access. We'll get back to you with an answer via e-mail. */}
        <p className="text-grayDark text-lg font-normal max-w-[780px] mx-auto">
          Precisamos de algumas informações para aprovar seu acesso de criador de conteúdo. Retornaremos com uma
          resposta via e-mail.
        </p>
      </div>

      {/* Dynamic forms for motivation, academic and professional experience */}
      <form className="text-center py-8 px-10 w-full">
        <div className="inline-block">

          {/* Motivation form */}
          <div className="motivation-form">
            <Motivation register={register} errors={errors} setIsMotivationFilled={setIsMotivationFilled}/>
          </div>

          {/* Space between forms */}
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-3"></div>
          </div>

          {/* Academic experience form */}

          {/* Form button */}
          <div className="academic-experience-form">
            {/* White and gray background, text and chevron icon when form closed; primary and white when open */}
            <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                    isAcademicExperienceOpen
                        ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                        : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => setIsAcademicExperienceOpen(!isAcademicExperienceOpen)}
            >
              <div className="flex items-start">
                {isAcademicExperienceOpen
                    ? ( <Icon path={mdiChevronUp} size={1} className="text-white"/> )
                    : ( <Icon path={mdiChevronDown} size={1} className="text-grayDark"/> )
                }
                Experiências acadêmicas
              </div>
            </button>
          </div>

          {/* Render an empty form if academicFormData (form array) is empty, else render all filled forms */}
          {isAcademicExperienceOpen && (
            educationFormData.length === 0 ? (
              <AcademicExperienceForm
                  key={0}
                  index={0}
                  educationFormData={emptyAcademicObject}
                  handleEducationInputChange={handleEducationInputChange}
                  educationErrors={educationErrors}
                  addNewEducationForm={addNewEducationForm}
                  handleEducationDelete={handleEducationDelete}
                  register={register}
                  errors={errors}
              />
            ) : (
              educationFormData.map((form, index) => (
                  <AcademicExperienceForm
                      key={index}
                      index={index}
                      educationFormData={educationFormData}
                      handleEducationInputChange={handleEducationInputChange}
                      educationErrors={educationErrors}
                      addNewEducationForm={addNewEducationForm}
                      handleEducationDelete={handleEducationDelete}
                      register={register}
                      errors={errors}
                  />
              ))
            )
          )}

          {/* Space between forms */}
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-3"></div>
          </div>

          {/* Professional experience form */}

          {/* Form button */}
          <div className="professional-experience-form">
            {/* White and gray background, text and chevron icon when form closed; primary and white when open */}
            <button
                type="button"
                className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                    isProfessionalExperienceOpen
                        ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
                        : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => setIsProfessionalExperienceOpen(!isProfessionalExperienceOpen)}
            >
              <div className="flex items-start">
                {isProfessionalExperienceOpen
                    ? ( <Icon path={mdiChevronUp} size={1} className="text-white"/> )
                    : ( <Icon path={mdiChevronDown} size={1} className="text-grayDark"/> )
                }
                Experiências profisisonais
              </div>
            </button>
          </div>

          {/* Render an empty form if experienceFormData (form array) is empty, else render all filled forms */}
          {isProfessionalExperienceOpen && (
            experienceFormData.length === 0 ? (
                <ProfessionalExperienceForm
                    key={0}
                    index={0}
                    experienceFormData={emptyProfessionalObject}
                    handleExperienceInputChange={handleExperienceInputChange}
                    experienceErrors={experienceErrors}
                    addNewExperienceForm={addNewExperienceForm}
                    handleExperienceDelete={handleExperienceDelete}
                    handleCountExperience={handleCountExperience}
                    handleCheckboxChange={handleCheckboxChange}
                    register={register}
                    errors={errors}
                />
            ) : (
              experienceFormData.map((form, index) => (
                  <ProfessionalExperienceForm
                      key={index}
                      index={index}
                      experienceFormData={experienceFormData}
                      handleExperienceInputChange={handleExperienceInputChange}
                      experienceErrors={experienceErrors}
                      addNewExperienceForm={addNewExperienceForm}
                      handleExperienceDelete={handleExperienceDelete}
                      handleCountExperience={handleCountExperience}
                      handleCheckboxChange={handleCheckboxChange}
                      register={register}
                      errors={errors}
                  />
              ))
            )
          )}

          {/* Warning text for empty forms */}
          <div>
            {submitError && (
                <span className=" ml-28 ">
                Alguns campos não estão preenchidos
              </span>
            )}
          </div>

          {/* Bottom page buttons */}
          <div className="w-[1000px] h-[52px] justify-between items-center inline-flex gap-4 mt-16">

            {/* Back to login */}
            <Link to="/login" className="text-grayDark underline">
              Voltar para login
            </Link>

            {/* Send for analysis */}
            <button type="button"
              // onClick={handleSubmit(onSubmit)}
              onClick={() => {

                SubmitValidation();

                if (!submitError) { // && areAllFormsFilled) {     // TODO: include when state is updated correctly
                  console.log("submitError is false!");     // TODO: remove!
                  openModal()
                }
              }}

              className={`px-10 py-4 rounded-lg justify-center items-center gap-2.5 flex text-center text-lg font-bold ${
                // Opacity dimmed when button is disabled
                isMotivationFilled
                    ? 'bg-primary hover:bg-cyan-900 text-white'
                    : 'bg-primary text-gray-200 cursor-not-allowed opacity-60'}`}

              // Button is disabled if motivation form field is not filled out
              disabled={!isMotivationFilled}
            >
              Enviar para análise
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation modal */}
      <GenericModalComponent
          title="Enviar para análise"
          contentText={"Você tem certeza que deseja enviar o formulário de aplicação? Essa ação não pode ser desfeita."}
          cancelBtnText={"Cancelar"}
          confirmBtnText={"Confirmar"}
          onConfirm={handleSubmit(onSubmit)}
          onClose={closeModal}
          isVisible={isModalVisible}
      />
    </main>
  )
}

export default Application