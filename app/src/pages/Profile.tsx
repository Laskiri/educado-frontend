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
import { useApi } from "../hooks/useAPI";

// Utilities
import dynamicForms from "../utilities/dynamicForms";
import staticForm from "../utilities/staticForm";

// Helpers
import { tempObjects } from "../helpers/formStates";
import { toast } from "react-toastify";

// Contexts
import useAuthStore from '../contexts/useAuthStore'

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
  const { clearToken } = useAuthStore((state) => state);

  //callback
  const { call: saveEdits, isLoading: submitLoading, error } = useApi(ProfileServices.putFormOne);

  // Form submit, sends data to backend upon user interaction
  const handleUpdateSubmit = async (index: any, data: any) => {

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
      educationLevel: educationFormData.map((data) => data.educationLevel).flat(),
      status: educationFormData.map((data) => data.status).flat(),
      course: educationFormData.map((data) => data.course).flat(),
      institution: educationFormData.map((data) => data.institution).flat(),
      startDate: educationFormData.map((data) => data.educationStartDate).flat(),
      endDate: educationFormData.map((data) => data.educationEndDate).flat(),
    };

    const workData = {
      userID: userID,
      company: experienceFormData.map((data) => data.company).flat(),
      jobTitle: experienceFormData.map((data) => data.jobTitle).flat(),
      startDate: experienceFormData.map((data) => data.workStartDate).flat(),
      endDate: experienceFormData.map((data) => data.workEndDate).flat(),
      isCurrentJob: experienceFormData.map((data) => data.isCurrentJob).flat(),
      description: experienceFormData.map((data) => data.description).flat(),
    };    


    try {
      const response = await saveEdits(personalData);

      if (response.status === 200) {
        // Delete existing education data on the backend before sending new updated data
        await Promise.all(educationFormData.map(async (item, index) => {
          if (item._id)
            await ProfileServices.deleteEducationForm(item._id);
        }));

        // Send the updated educationData to the backend
        await ProfileServices.putFormTwo(educationData);

        // Delete existing work data on the backend before sending new updated data
        await Promise.all(experienceFormData.map(async (item, index) => {
          if (item._id)
            await ProfileServices.deleteExperienceForm(item._id);
        }));
        
        // Send the updated workData to the backend
        await ProfileServices.putFormThree(workData);

        // Disable submit button after successful submission
        setAreAllFormsFilledCorrect(false);
        setHasSubmitted(true);
      }
    }
    catch (error) {
      if (error instanceof Error) toast.error(error.message);
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
  const handleDeleteAccount = async () => {
    try {
      const statusCode = await AccountServices.deleteAccount();
      if (statusCode !== 200)
        throw new Error();

      closeAccountDeletionModal();

      // Clear local storage
      localStorage.removeItem("id");
      localStorage.removeItem("userInfo");
      clearToken();
      localStorage.removeItem('token');
      
      navigate('/welcome');

      // Toastify notification: 'Account deleted successfully!'
      toast.success('Conta excluída com sucesso!', { pauseOnHover: false, draggable: false }); 
    } 
    catch (error) {
      console.error("Error deleting account: " + error);
      closeAccountDeletionModal();

      // Toastify notification: 'Failed to delete account!'
      toast.error('Erro ao excluir conta!', { pauseOnHover: false, draggable: false });
      return;
    }
  }

  return (
    <Layout meta="Profile">
      <main className="flex-grow overflow-x-hidden bg-secondary h-screen font-['Montserrat']">

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
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"
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

            {/* Academic experience form */}

            {/* Form button */}
            <div className="academic-experience-form">
              <button
                type="button"
                
                // Open/closed form styling
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isAcademicExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"   // When open: rounded top corners, primary background, white text
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"  // When closed: rounded corners, white background, gray text
                }`}
                onClick={() => setIsAcademicExperienceOpen(!isAcademicExperienceOpen)}
              >
                <div className="flex items-start">
                  
                  {/* Render chevron up/down icon white/gray  */}
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
                
                // Open/closed form styling
                className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold pl-6 ${
                  isProfessionalExperienceOpen
                    ? "rounded-tl-lg rounded-tr-lg bg-primary text-white"   // When open: rounded top corners, primary background, white text
                    : "rounded-lg bg-white text-neutral-700 text-grayDark"  // When closed: rounded corners, white background, gray text
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
                  disabled={submitLoading}
              > {submitLoading? (
                <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2"></span>
                ) : null}
                Salvar ediçõe
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
            onConfirm={handleDeleteAccount}
            onClose={closeAccountDeletionModal}
            isVisible={isAccountDeletionModalVisible}
        />
      </main>
    </Layout>
  );
};

export default Profile;