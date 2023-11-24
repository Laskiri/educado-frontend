//token decoder & yup
import jwt_decode from "jwt-decode";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//Hooks
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Interfaces & Services
import {
  EducationFormData,
  ExperienceFormData,
  DecodedToken,
} from "../interfaces/Profile";
import ProfileServices from "../services/profile.services";

// Icons
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

// Components
import Layout from "../components/Layout";
import PersonalInformationForm from "../components/ProfileForms/PersonalInformation";
import AcademicExperienceForm from "../components/ProfileForms/AcademicExperience";
import ProfessionalExperienceForm from "../components/ProfileForms/ProfessionalExperience";
import useProfileValidation from "../hooks/useProfileValidation";

type FormData = {
  UserName: string;
  UserEmail: string;
  bio: string;
  linkedin: string;
  photo: any;
};

//Yup Schema
const profileSchema = Yup.object().shape({
  UserName: Yup.string(),
  UserEmail: Yup.string().email("You need a suitable email to submit"),
  linkedin: Yup.lazy((value) => {
    if (value) {
      return Yup.string().matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        "Invalid LinkedIn URL"
      );
    }
    return Yup.string();
  }),
});

const Profile = () => {
  //call date input validaion functions for 'dd/mm'
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

  //---States for forms--///
  const [formData, setFormData] = useState<FormData>({
    UserName: "",
    UserEmail: "",
    bio: "",
    linkedin: "",
    photo: "",
  });
  const [educationformData, setEducationFormData] = useState<
    EducationFormData[]
  >([
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
  const [experienceformData, setExperienceFormData] = useState<
    ExperienceFormData[]
  >([
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

  const [userID, setUserID] = useState("");

  //--Get requests fetching data to forms--//
  const fetchData = async () => {
    const response = await ProfileServices.getUserFormOne(userID);
    const data = response.data;
    setFormData((prevData) => ({
      ...prevData,
      UserName: data.userName,
      UserEmail: data.userEmail,
      bio: data.userBio,
      linkedin: data.userLinkedInLink,
      photo: data.userPhoto,
    }));

    const educationResponse = await ProfileServices.getUserFormTwo(userID);
    setEducationFormData(educationResponse.data);
    for (let item in educationResponse.data) {
      setEducationErrors((prevState) => {
        let newState = [...prevState];
        newState.push({
          startDate: "",
          endDate: "",
        });
        return newState;
      });
    }
    const experienceResponse = await ProfileServices.getUserFormThree(userID);
    setExperienceFormData(experienceResponse.data);
    for (let item in experienceResponse.data) {
      setExperienceErrors((prevState) => {
        let newState = [...prevState];
        newState.push({
          startDate: "",
          endDate: "",
        });
        return newState;
      });
    }
  };

  //Image click
  const myRef = useRef<HTMLInputElement>(null);
  const imageClick = () => {
    myRef.current?.click();
  };

  //Handle for Profile Image
  const handleFileChange = async (event: any) => {
    const formData = new FormData();
    formData.append("file", event.target.files && event.target.files[0]);
    formData.append(
      "fileName",
      event.target.files && event.target.files[0].name
    );

    const response = await ProfileServices.postImage(formData);

    if (response.status == 200) {
      setFormData((prevSTate) => {
        let newState = { ...prevSTate };
        newState.photo = response.data;
        return newState;
      });
    }
  };

  //Handles for static input change from fields, takes name and value and stores in formData.
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //Handles for dynamic form of Education experience (input, create, delete)
  const handleEducationInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    let { name, value } = event.target;
    if ((name == "startDate" || name == "endDate") && value.length > 5) {
      return;
    }
    if (name == "startDate" || name == "endDate") {
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
      const EducationInputsFilled = educationformData.every(
        (item) =>
          item.startDate.trim() !== "" &&
          item.endDate.trim() !== "" &&
          item.course.trim() !== "" &&
          item.institution.trim() !== ""
      );
      return EducationInputsFilled;
    } else {
      const ExperienceInputsFilled = experienceformData.every(
        (item) =>
          item.company.trim() !== "" &&
          item.jobTitle.trim() !== "" &&
          item.startDate.trim() !== "" &&
          item.endDate.trim() !== "" &&
          item.description.trim() !== ""
      );
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
          startDate: "",
          endDate: "",
        });
        return newState;
      });
      setEducationFormData([
        ...educationformData,
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
    }
  };

  //Deletes dynamic form for academdic experience
  const handleEducationDelete = async (index: number, _id: string | null) => {
    //Deletes form.
    if (_id) {
      await ProfileServices.deleteEducationForm(_id);
    }

    const updatedEducationFormation = educationformData.filter(
      (_, i) => i !== index
    );
    setEducationFormData(updatedEducationFormation);

    //input date Validation state
    if (
      educationErrors[index].startDate != "" ||
      educationErrors[index].endDate != ""
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
          startDate: "",
          endDate: "",
        });
        return newState;
      });
      setExperienceFormData([
        ...experienceformData,
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

    const updatedExperienceFormation = experienceformData.filter(
      (_, i) => i !== index
    );
    setExperienceFormData(updatedExperienceFormation);

    // If deleted state has validation error then clear state
    if (
      experienceErrors[index].startDate != "" ||
      experienceErrors[index].endDate != ""
    ) {
      setExperienceErrorState(false);
    }
    setExperienceErrors((prevState) => {
      let newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  //Count characters written in bio
  const handleCharCountBio = () => {
    let text = formData.bio || "";
    text = text.replace(/\s/g, "");
    return text.length;
  };

  //Count characters written in professional description
  const handleCountExperience = (index: any) => {
    let text = experienceformData[index].description;
    text = text.replace(/\s/g, "");
    return text.length;
  };

  //handle for dynamic personal experiience form
  const handleExperienceInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ): void => {
    let { name, value } = event.target;
    if ((name == "startDate" || name == "endDate") && value.length > 5) {
      return;
    }
    if (name == "startDate" || name == "endDate") {
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

  //useform setup for yup for static form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
  });

  //Form submit, sends data to backend, upon user interaction
  const handleUpdateSubmit = async (index: any, data: any) => {
    //if fields are filled & errors do not occour submit form
    if (
      !educationErrorState &&
      !experienceErrorState &&
      dynamicInputsFilled("education") &&
      dynamicInputsFilled("experience") &&
      formData.UserEmail !== "" &&
      formData.UserName !== ""
    ) {
      //Fields of personalinformation will be updated using - through a put request
      const formDataToSend = {
        userID: userID,
        userName: formData.UserName,
        userBio: formData.bio,
        userLinkedInLink: formData.linkedin,
        userEmail: formData.UserEmail,
        userPhoto: formData.photo,
      };

      const response = await ProfileServices.putFormOne(formDataToSend);
      if (response.status === 200) {
      }

      try {
        //Fields of academic experience will be looped through and updated using the relevant endpoints
        await Promise.all(
          educationformData.map(async (item, index) => {
            const data = {
              ...item,
              userID: userID,
            };

            const res = await ProfileServices.putFormTwo(data);

            setEducationFormData((prevState) => {
              const newState = [...prevState];
              newState[index] = {
                ...res.data,
              };
              return newState;
            });
            if (item._id) {
              await ProfileServices.deleteEducationForm(item._id);
            }
          })
        );

        //Fields of professional experience will be looped through and updated using the relevant endpoints
        await Promise.all(
          experienceformData.map(async (item, index) => {
            const data = {
              ...item,
              userID: userID,
            };

            const res = await ProfileServices.putFormThree(data);

            setExperienceFormData((prevState) => {
              const newState = [...prevState];
              newState[index] = {
                ...res.data,
              };
              return newState;
            });
            if (item._id) {
              await ProfileServices.deleteExperienceForm(item._id);
            }
          })
        );
      } catch (error) {
        console.error("Axios Error:", error);
      }
    }
  };

  //Drop down menues && lists
  const [toggleMenu1, setToggleMenu1] = useState(false);
  const [toggleMenu2, setToggleMenu2] = useState(false);
  const [toggleMenu3, setToggleMenu3] = useState(false);

  ////////////////////*Modals code*////////////////////////
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  //Handle only inputNumbers for modal
  const [modalInputValue, setModalInputValue] = useState("");
  const [intError, setIntError] = useState(false);
  const handleInputNumbersOnly = (e: any) => {
    // Disable non-numeric characters
    const numericInput = e.target.value.replace(/[^0-9]/g, "");
    setModalInputValue(numericInput);
    setIntError(!/^[0-9]*$/.test(e.target.value));
  };

  //Fetch certain userData such as ID to bind the profile using decoded Token.
  const fetchuser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwt_decode(token);
      const response = await ProfileServices.getTokenDetails(decoded.email);
      setUserID(response.data._id);
      setFormData((prevData) => ({
        ...prevData,
        UserName: response.data.name,
        UserEmail: response.data.email,
      }));
    }
  };
  //render and fetch user
  useEffect(() => {
    fetchuser();
  }, []);

  //render and fetch userData
  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  return (
    <Layout meta="Profile">
      <form
        onSubmit={handleSubmit(handleUpdateSubmit)}
        className="text-center relative py-8 px-10 w-full"
      >
        <div className="inline-block ">
          <div className="text-left mt-16 mb-20 text-neutral-700 text-[32px] font-bold font-['Montserrat']">
            Editar perfil
          </div>
          {/* Menu-1-personal-information drop down*/}
          <>
            <div className="Menu-1-personal-information">
              <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold font-montserrat pl-6 relative ${
                  toggleMenu1
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-[#FFFFFF]"
                    : "rounded-lg bg-white text-neutral-700 text-[#383838]"
                }`}
                onClick={() => setToggleMenu1(!toggleMenu1)}
              >
                <div className="flex items-start">
                  {toggleMenu1 ? (
                    <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
                  ) : (
                    <Icon path={mdiChevronDown} size={1} color="#383838" />
                  )}
                  Informações pessoais
                </div>
              </button>
            </div>

            <PersonalInformationForm
              formData={formData}
              errors={errors}
              handleCharCountBio={handleCharCountBio}
              toggleMenu1={toggleMenu1}
              imageClick={imageClick}
              handleFileChange={handleFileChange}
              myRef={myRef}
              register={register}
              handleInputChange={handleInputChange}
              isSecondModalOpen={isSecondModalOpen}
              modalInputValue={modalInputValue}
              handleInputNumbersOnly={handleInputNumbersOnly}
              intError={intError}
              setIsSecondModalOpen={setIsSecondModalOpen}
            />
          </>
          {/* Menu for academic experience */}
          <>
            <div className="Menu-2-academic-experience ">
              <button
                type="button"
                className={`second_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold font-montserrat pl-6 relative ${
                  toggleMenu2
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-[#FFFFFF]"
                    : "rounded-lg bg-white text-neutral-700 text-[#383838]"
                }`}
                onClick={() => setToggleMenu2(!toggleMenu2)}
              >
                <div className="flex items-start">
                  {toggleMenu2 ? (
                    <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
                  ) : (
                    <Icon path={mdiChevronDown} size={1} color="#383838" />
                  )}
                  Experiências acadêmicas
                </div>
              </button>
            </div>

            {toggleMenu2 &&
              educationformData.map((form, index) => (
                <AcademicExperienceForm
                  index={index}
                  educationformData={educationformData}
                  handleEducationInputChange={handleEducationInputChange}
                  educationErrors={educationErrors}
                  addNewEducationForm={addNewEducationForm}
                  handleEducationDelete={handleEducationDelete}
                />
              ))}

            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-3"></div>
            </div>
          </>
          {/* Menu for professional experience */}
          <>
            <div className="Menu-3-professional-experience ">
              <button
                type="button"
                className={`third_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex font-bold font-montserrat pl-6 relative ${
                  toggleMenu3
                    ? "rounded-tl-lg rounded-tr-lg bg-[#166276] text-[#FFFFFF]"
                    : "rounded-lg bg-white text-neutral-700 text-[#383838]"
                }`}
                onClick={() => setToggleMenu3(!toggleMenu3)}
              >
                <div className="flex items-start">
                  {toggleMenu3 ? (
                    <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
                  ) : (
                    <Icon path={mdiChevronDown} size={1} color="#383838" />
                  )}
                  Experiências profisisonais
                </div>
              </button>
            </div>
            {toggleMenu3 &&
              experienceformData.map((form, index) => (
                <ProfessionalExperienceForm
                  index={index}
                  experienceformData={experienceformData}
                  handleExperienceInputChange={handleExperienceInputChange}
                  experienceErrors={experienceErrors}
                  addNewExperienceForm={addNewExperienceForm}
                  handleExperienceDelete={handleExperienceDelete}
                  handleCountExperience={handleCountExperience}
                  handleCheckboxChange={handleCheckboxChange}
                />
              ))}
          </>
          <div>
            {submitError && (
              <span className=" ml-28 ">
                Alguns campos não estão preenchidos
              </span>
            )}
          </div>

          {/* Page buttons */}
          <div className="w-[1000px] h-[52px] justify-between items-center inline-flex gap-4 mt-16">
            <button
              type="button"
              className="text-center text-red-500 text-base font-bold font-['Montserrat'] underline"
            >
              Deletar conta
            </button>
            <div className="flex-grow text-right ml-auto">
              <button
                type="button"
                className=" text-cyan-800 font-bold font-['Montserrat'] underline"
              >
                Cancelar edições
              </button>
            </div>
            <div className="px-10 py-4 bg-cyan-800 rounded-lg justify-center items-start gap-2.5 flex">
              <button
                onClick={SubmitValidation}
                type="submit"
                className="text-center text-white text-base font-bold font-['Montserrat'] text-right"
              >
                Salvar edições
              </button>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Profile;
