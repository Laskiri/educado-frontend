// Hooks
import { useNavigate, Link, useParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';

// Services
import AuthService from "../services/auth.services"
import { NewApplication } from "../interfaces/Application"

// Components
import Motivation from '../components/Application/Motivation';
import AcademicExperience from '../components/Application/AcademicExperience';
import WorkExperience from '../components/Application/ProfessionalExperience';
import GenericModalComponent from '../components/GenericModalComponent';
import {Icon} from "@mdi/react";
import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
import AcademicExperienceForm from "../components/ProfileForms/AcademicExperience";

import Profile from "../pages/Profile";
import dynamicForms from "../utilities/dynamicForms";
import {tempObjects} from "../helpers/formStates";
import ProfessionalExperienceForm from "../components/ProfileForms/ProfessionalExperience";

const Application = () => {

  // State for the motivation form field
  const [isMotivationFilled, setIsMotivationFilled] = useState(false);

  // State for the confirmation modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [toggleMenu2, setToggleMenu2] = useState(false);
  const [toggleMenu3, setToggleMenu3] = useState(false);



  // Functions to open and close the confirmation modal
  const openModal = () => {
      setIsModalVisible(true);
  }

  const closeModal = () => {
      setIsModalVisible(false);
  }

  //Get id from URL
  const { id } = useParams();
  
  const navigate = useNavigate(); 

  //Function for deciding the different values in the form
  const { register, handleSubmit, formState: { errors } } = useForm<NewApplication>();

  const {
    dynamicInputsFilled,
    userID,
    educationErrorState,
    experienceErrorState,
    experienceErrors,
    educationErrors,
    handleExperienceInputChange,
    handleCountExperience,
    handleExperienceDelete,
    addNewExperienceForm,
    handleEducationDelete,
    addNewEducationForm,
    SubmitValidation,
    submitError,
    handleEducationInputChange,
    experienceformData,
    educationformData,
    fetchDynamicData,
    handleCheckboxChange,
  } = dynamicForms();

  const { emptyAcademicObject, emptyProfessionalObject } = tempObjects();



  /**
    * OnSubmit function for Application.
    * Takes the submitted data from the form and sends it to the backend through a service.
    * Navigates to the Login page upon receiving a successful response
    *
    * @param {JSON} data Which includes the value of the various fields in the application
    */
  const onSubmit: SubmitHandler<NewApplication> = async (data) => {
    AuthService.postNewApplication({
      motivation: data.motivation, academicLevel: data.academicLevel, academicStatus: data.academicStatus,
      major: data.major, institution: data.institution, educationStartDate: data.educationStartDate,
      educationEndDate: data.educationEndDate, company: data.company, position: data.position,
      workStartDate: data.workStartDate, workEndDate: data.workEndDate, workActivities: data.workActivities,

      baseUser: id
    }).then((res) =>{
      if(res.status == 201){
        navigate("/login", { state: { applicationSubmitted: true } });
      }
    }).catch((error) => {
      console.error("Error submitting application:", error);
    });
  };


  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#C9E5EC] 0% to-[#FFF] 100%" >
    {/*<main className="flex-grow overflow-x-hidden bg-[#E4F2F5] h-screen">*/}


      { /* Navbar */ }
      <nav className="flex fixed w-full items-center justify-between bg-secondary box-shadow-md bg-fixed top-0 left-0 right-0 z-50 bg-F1F9FB shadow-[0px 4px 4px 0px rgba(35, 100, 130, 0.25)]">
        <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
          <div className="navbar-start">
            <Link to="/" className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl">
              <img src= '/logo.svg' alt="logo" className="w-[24.43px] h-6" /> <img src= '/educado.svg' alt="educado" className="h-6" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative right-0 h-full flex-1 flex flex-col z-10">

        {/* Forms */}
        {/*<form className="text-center py-8 px-10 w-full"*/}
        <form className="relative right-0 w-full overflow-none flex-1 h-screen flex flex-col items-center gap-5 z-50"
              onSubmit={handleSubmit(onSubmit)}
        >
          <div className="inline-block">
            {/* Box for text */}
            <div className="items-center p-10 pt-20">
              <h1 className="text-center text-cyan-800 text-[32px] font-bold font-['Montserrat']">
                Que bom que você quer fazer parte do Educado! {/* Glad you want to be part of Educado! */}
              </h1>
              <p className="text-center text-neutral-700 text-lg font-normal font-['Montserrat']">
                {/* We need some information to approve your content creator access. We'll get back to you with an answer via e-mail. */}
                Precisamos de algumas informações para aprovar seu acesso de criador de conteúdo. Retornaremos com uma
                resposta via e-mail
              </p>
            </div>

            <>
              <Motivation register={register} errors={errors} setIsMotivationFilled={setIsMotivationFilled}/>
              {/*<AcademicExperience register={register} errors={errors} />*/}

              {/* Menu for academic experience */}

              <div className="Menu-2-academic-experience inline-block">
                <button
                    type="button"
                    className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold font-montserrat pl-6 ${
                        toggleMenu2
                            ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-[#FFFFFF]"
                            : "rounded-lg bg-white text-neutral-700 text-[#383838]"
                    }`}
                    onClick={() => setToggleMenu2(!toggleMenu2)}
                >
                  <div className="flex items-start">
                    {toggleMenu2 ? (
                        <Icon path={mdiChevronUp} size={1} color="#FFFFFF"/>
                    ) : (
                        <Icon path={mdiChevronDown} size={1} color="#383838"/>
                    )}
                    Experiências acadêmicas
                  </div>
                </button>
              </div>

              {/* Academic experience form */}
              {/* Conditional rendering empty form when database is empty */}
              {toggleMenu2 ? (
                  educationformData.length === 0 ? (
                      <AcademicExperienceForm
                          key={0}
                          index={0}
                          educationformData={emptyAcademicObject}
                          handleEducationInputChange={handleEducationInputChange}
                          educationErrors={educationErrors}
                          addNewEducationForm={addNewEducationForm}
                          handleEducationDelete={handleEducationDelete}
                      />
                  ) : (
                      educationformData.map((form, index) => (
                          // Retrieve child compononent
                          <AcademicExperienceForm
                              key={index}
                              index={index}
                              educationformData={educationformData}
                              handleEducationInputChange={handleEducationInputChange}
                              educationErrors={educationErrors}
                              addNewEducationForm={addNewEducationForm}
                              handleEducationDelete={handleEducationDelete}
                          />
                      ))
                  )
              ) : (
                  <></>
              )}

              {/*<div className="hidden sm:block" aria-hidden="true">
                  <div className="py-3"></div>
                </div>*/}


              {/*<WorkExperience register={register} errors={errors} />*/}

              {/* Menu for professional experience */}
              <>
                <div className="Menu-3-professional-experience ">
                  <button
                      type="button"
                      className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold font-montserrat pl-6 ${
                          toggleMenu3
                              ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-[#FFFFFF]"
                              : "rounded-lg bg-white text-neutral-700 text-[#383838]"
                      }`}
                      onClick={() => setToggleMenu3(!toggleMenu3)}
                  >
                    <div className="flex items-start">
                      {toggleMenu3 ? (
                          <Icon path={mdiChevronUp} size={1} color="#FFFFFF"/>
                      ) : (
                          <Icon path={mdiChevronDown} size={1} color="#383838"/>
                      )}
                      Experiências profisisonais
                    </div>
                  </button>
                </div>

                {/* Professional experience form */}
                {/* Conditional rendering empty form when database is empty */}
                {toggleMenu3 ? (
                    experienceformData.length === 0 ? (
                        <ProfessionalExperienceForm
                            key={0}
                            index={0}
                            experienceformData={emptyProfessionalObject}
                            handleExperienceInputChange={handleExperienceInputChange}
                            experienceErrors={experienceErrors}
                            addNewExperienceForm={addNewExperienceForm}
                            handleExperienceDelete={handleExperienceDelete}
                            handleCountExperience={handleCountExperience}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ) : (
                        experienceformData.map((form, index) => (
                            <ProfessionalExperienceForm
                                key={index}
                                index={index}
                                experienceformData={experienceformData}
                                handleExperienceInputChange={handleExperienceInputChange}
                                experienceErrors={experienceErrors}
                                addNewExperienceForm={addNewExperienceForm}
                                handleExperienceDelete={handleExperienceDelete}
                                handleCountExperience={handleCountExperience}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ))
                    )
                ) : (
                    <></>
                )}
              </>


              {/* Bottom div */}
              <div className="w-[65%] flex justify-end">

                {/* Send for analysis */}
                <button type="button" onClick={openModal}
                        className={`h-[52px] px-10 py-4 rounded-lg justify-center items-center gap-2.5 flex text-center text-lg font-bold font-['Montserrat'] ${
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
            </>
          </div>
        </form>
      </div>

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