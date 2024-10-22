// Yup
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Hooks
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

// Services
import ProfileServices from "../services/profile.services";
import AccountServices from "../services/account.services";

// Icons
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

// Components
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import GenericModalComponent from "../components/GenericModalComponent";
import PersonalInformationForm from "../components/ProfileForms/PersonalInformation";
import AcademicExperienceForm from "../components/ProfileForms/AcademicExperience";
import ProfessionalExperienceForm from "../components/ProfileForms/ProfessionalExperience";

// Utilities
import dynamicForms from "../utilities/dynamicForms";
import staticForm from "../utilities/staticForm";

// Helpers
import { tempObjects } from "../helpers/formStates";

// Yup Schema
const profileSchema = Yup.object().shape({
  UserName: Yup.string(),
  UserEmail: Yup.string().email("You need a suitable email to submit"),
  linkedin: Yup.lazy((value) => {
    if (value !== null && value !== undefined) {
      return Yup.string().matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        "Invalid LinkedIn URL"
      );
    }
    return Yup.string();
  }),
});

const Profile = () => {
  const {
    handleFileChange,
    handleCharCountBio,
    formData,
    handleInputChange,
    fetchuser,
    fetchStaticData,
  } = staticForm();

  const { emptyAcademicObject, emptyProfessionalObject } = tempObjects();

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
    experienceFormData,
    educationFormData,
    fetchDynamicData,
    handleCheckboxChange,
  } = dynamicForms();

  // Image click
  const myRef = useRef<HTMLInputElement>(null);
  const imageClick = () => {
    myRef.current?.click();
  };

  // Yup setup for static form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
  });

  const navigate = useNavigate();

  // States
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAcademicExperienceOpen, setIsAcademicExperienceOpen] = useState(false);
  const [isProfessionalExperienceOpen, setIsProfessionalExperienceOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAccountDeletionModalVisible, setIsAccountDeletionModalVisible] = useState(false);
  const [areAllFormsFilledCorrect, setAreAllFormsFilledCorrect] = useState(false);

  // Form submit, sends data to backend upon user interaction
  const handleUpdateSubmit = async (index: any, data: any) => {

    // TODO: remove when everything is working
    console.log("handleUpdateSubmit invoked!");
    console.log("educationFormData: ", educationFormData);
    console.log("experienceFormData: ", experienceFormData);

    // Fields of personal information will be updated using - through a put request
    const personalData = {
      userID: userID,
      userName: formData.UserName,
      userBio: formData.bio,
      userLinkedInLink: formData.linkedin,
      userEmail: formData.UserEmail,
      userPhoto: formData.photo,
    };

    const educationData = {
      userID: userID,
      educationLevel: educationFormData.map((data) => data.educationLevel),
      status: educationFormData.map((data) => data.status),
      course: educationFormData.map((data) => data.course),
      institution: educationFormData.map((data) => data.institution),
      startDate: educationFormData.map((data) => data.educationStartDate),
      endDate: educationFormData.map((data) => data.educationEndDate),
    };

    const workData = {
      userID: userID,
      company: experienceFormData.map((data) => data.company),
      jobTitle: experienceFormData.map((data) => data.jobTitle),
      startDate: experienceFormData.map((data) => data.workStartDate),
      endDate: experienceFormData.map((data) => data.workEndDate),
      description: experienceFormData.map((data) => data.description),
    };

    // TODO: remove when everything is working
    console.log("educationData: ", educationData);
    console.log("workData: ", workData);

    try {
      const response = await ProfileServices.putFormOne(personalData);

      if (response.status === 200) {

        // Fields of academic experience will be looped through and updated using the relevant endpoints
        await Promise.all(educationFormData.map(async (item, index) => {
          await ProfileServices.putFormTwo(educationData);

          if (item._id)
              await ProfileServices.deleteEducationForm(item._id);
          })
        );

        // Fields of professional experience will be looped through and updated using the relevant endpoints
        await Promise.all(experienceFormData.map(async (item, index) => {
          await ProfileServices.putFormThree(workData);

          if (item._id)
            await ProfileServices.deleteExperienceForm(item._id);
          })
        );

        if (userID) {
          fetchStaticData();
          fetchDynamicData();
        }

        console.log("Success! Updated info: ", response);   // TODO: remove when everything is working
      }
    }
    catch(error) {
      console.error("Error updating profile: " + error);
    }
    finally {
      setAreAllFormsFilledCorrect(false);
      setHasSubmitted(true);
    }
  };

  // Effects

  // Reset the submission state whenever the form data changes
  useEffect(() => {
    setHasSubmitted(false);
  }, [educationFormData, experienceFormData, formData]);

  // Render and fetch signup user details
  useEffect(() => {
    fetchuser();
  }, [userID]);

  // Render and fetch userData
  useEffect(() => {
    if (userID) {
      fetchStaticData();
      fetchDynamicData();
    }
  }, [userID]);

  // Check if forms are filled correctly
  // TODO: perhaps a check of the personal info form is also needed here?
  useEffect(() => {
    setAreAllFormsFilledCorrect(
      !submitError &&
      !educationErrorState &&
      !experienceErrorState &&
      dynamicInputsFilled("education") &&
      dynamicInputsFilled("experience")
    );
  }, [submitError, educationErrorState, experienceErrorState, educationFormData, experienceFormData]);

  // Delete account confirmation modal
  const openAccountDeletionModal = () => { setIsAccountDeletionModalVisible(true); }
  const closeAccountDeletionModal = () => { setIsAccountDeletionModalVisible(false); }

  // Handle account deletion
  const deleteAccount = async () => {
    // TODO: implement correctly at some point
    /*await AccountServices.deleteAccount();

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("userInfo");

    navigate('/welcome');*/
    closeAccountDeletionModal();
  }

  return (
    <Layout meta="Profile">
      <main className="flex-grow overflow-x-hidden bg-[#E4F2F5] h-screen font-['Montserrat']">

        {/* Dynamic forms */}
        <form className="text-center py-8 px-10 w-full">
          <div className="inline-block ">

            {/* Page title */}
            <div className="text-left mt-16 mb-20 text-neutral-700 text-[32px] font-bold">
              Editar perfil
            </div>

            {/* Personal information */}
            <div className="personal-information-form">
              <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isPersonalInfoOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-white"
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}
              >
                <div className="flex items-start">
                  {isPersonalInfoOpen
                      ? ( <Icon path={mdiChevronUp} size={1} className="text-white" /> )
                      : ( <Icon path={mdiChevronDown} size={1} className="text-grayDark" /> )
                  }
                  Informações pessoais
                </div>
              </button>
            </div>

            <PersonalInformationForm
              formData={formData}
              errors={errors}
              handleCharCountBio={handleCharCountBio}
              toggleMenu1={isPersonalInfoOpen}
              imageClick={imageClick}
              handleFileChange={handleFileChange}
              myRef={myRef}
              register={register}
              handleInputChange={handleInputChange}
            />

            {/* Academic experience */}
            <div className="academic-experience-form">
              <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isAcademicExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-white"
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => setIsAcademicExperienceOpen(!isAcademicExperienceOpen)}
              >
                <div className="flex items-start">
                  {isAcademicExperienceOpen
                      ? ( <Icon path={mdiChevronUp} size={1} className="text-white" /> )
                      : ( <Icon path={mdiChevronDown} size={1} className="text-grayDark" /> )
                  }
                  Experiências acadêmicas
                </div>
              </button>
            </div>

            {/* Render empty form if database is empty */}
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

            {/* Spacing between forms */}
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-3"></div>
            </div>

            {/* Professional experience */}
            <div className="professional-experience-form">
              <button
                type="button"
                className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isProfessionalExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-white"
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"
                }`}
                onClick={() => setIsProfessionalExperienceOpen(!isProfessionalExperienceOpen)}
              >
                <div className="flex items-start">
                  {isProfessionalExperienceOpen
                      ? ( <Icon path={mdiChevronUp} size={1} className="text-white" /> )
                      : ( <Icon path={mdiChevronDown} size={1} className="text-grayDark" /> )
                  }
                  Experiências profisisonais
                </div>
              </button>
            </div>

            {/* Render empty form if database is empty */}
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

            {/* Warning text for empty/incorrect forms */}
            <div>
              {submitError && (
                  <p className="flex items-center mt-1 ml-4 text-warning text-sm text-right" role="alert">
                    Alguns campos não estão preenchidos corretamente!
                  </p>
              )}
            </div>

            {/* Bottom page buttons */}
            <div className="w-[1000px] h-[52px] justify-between items-center inline-flex gap-4 mt-16">

              {/* Account deletion */}
              <button
                  type="button"
                  onClick={() => openAccountDeletionModal()}
                  className="text-center text-red-500 text-lg font-bold underline"
              >
                Deletar conta
              </button>

              {/* Cancel edits */}
              <Link to="/courses" className="text-cyan-800 font-bold text-lg underline flex-grow text-right ml-auto">
                Cancelar edições
              </Link>

              {/* Save changes */}
              <button
                  type="button"
                  onClick={() => {
                    SubmitValidation();

                    if (areAllFormsFilledCorrect) {
                      console.log("areAllFormsFilledCorrect: ", areAllFormsFilledCorrect);  // TODO: remove when everything is working
                      handleSubmit(handleUpdateSubmit)();
                    }
                  }}

                  className={`px-10 py-4 rounded-lg justify-center items-center gap-2.5 flex text-center text-lg font-bold ${
                      // Opacity dimmed when button is disabled
                      areAllFormsFilledCorrect
                          ? 'bg-primary hover:bg-cyan-900 text-white'
                          : 'bg-primary text-gray-200 cursor-not-allowed opacity-60'
                  }`}

                  // Button is disabled if form fields are not filled out correctly
                  disabled={!areAllFormsFilledCorrect}
              >
                Salvar edições
              </button>
            </div>
          </div>
        </form>

        {/* Delete account confirmation modal */}
        <GenericModalComponent
            title="Deletar conta"
            contentText={"Você tem certeza que deseja deletar a sua conta? Todos os seus dados serão removidos permanentemente. Essa ação não pode ser desfeita."}
            cancelBtnText={"Cancelar"}
            confirmBtnText={"Confirmar"}
            onConfirm={deleteAccount}
            onClose={closeAccountDeletionModal}
            isVisible={isAccountDeletionModalVisible}
        />
      </main>
    </Layout>
  );
};

export default Profile;