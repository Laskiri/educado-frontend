import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import jwt_decode from "jwt-decode";

//Form validation validation
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Endpoints
import ProfileServices from "../services/profile.services";

// Interfaces
import {
  //FormData,
  EducationFormData,
  ExperienceFormData,
  DecodedToken,
} from "../interfaces/Profile";

// Components
import Layout from "../components/Layout";
import { PageDescriptor } from "../components/PageDescriptor";

// Icons
import Icon from "@mdi/react";
import {
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiCheckBold,
  mdiChevronDown,
  mdiChevronUp,
  mdiDelete,
} from "@mdi/js";

import { bool } from "aws-sdk/clients/signer";
import useProfileValidation from "../hooks/useProfileValidation";

type FormData = {
  UserName: string;
  UserEmail: string;
  bio: string;
  linkedin: string;
  photo: any;
};

//Yup Schemas
const profileSchema = Yup.object().shape({
  UserName: Yup.string().required("This field is required!"),
  UserEmail: Yup.string()
    .email("You need a suitable email to submit")
    .required("This field is required!"),
  linkedin: Yup.lazy((value) => {
    if (value) {
      return Yup.string().matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        "Invalid LinkedIn URL"
      );
    }
    return Yup.string();
  }),
  //.matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Invalid date format (MM/YY)"),
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
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  //decode token && get email, username and && id
  useEffect(() => {
    const fetchuser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: DecodedToken = jwt_decode(token);
        const response = await ProfileServices.getTokenDetails(decoded.email);

        setUserID(response.data._id);
        setUserName(response.data.name);
        setUserEmail(response.data.email);

        setFormData((prevData) => ({
          ...prevData,
          UserName: response.data.name,
          UserEmail: response.data.email,
        }));
      }
    };
    fetchuser();
  }, []);

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]);

  //Fetch data from the backend to display on UI
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
  //

  //Avatar click
  const myRef = useRef<HTMLInputElement>(null);
  const imageClick = () => {
    myRef.current?.click();
  };

  //Handle for Profile Image
  const handleFileChange = async (event: any) => {
    const file = event.target.files && event.target.files[0];
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

  const handleEducationDelete = async (index: number, _id: string | null) => {
    //Deletes form.
    if (_id) {
      console.log("ID: ", _id);
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

  //Handles for dynamic profession expereience form (input, create, delete)
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

  //Count characters written in profession description
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
    //if fields are filled & errors ar handled submit form

    try {
      // Your conditional Yup validation logic here
      if (index === 0) {
        console.log("Yup validation for toggleMenu1");
        // Apply Yup validation for the relevant form section
        await profileSchema.validate(data, { abortEarly: false });
      } else if (index === 1 && !toggleMenu2) {
        console.log("Yup validation for toggleMenu2");
        // Apply Yup validation for the relevant form section
        await profileSchema.validate(data, { abortEarly: false });
      }
      console.log("Form data:", data);

      // Perform your form submission logic here
    } catch (error) {
      // Handle Yup validation errors
      console.error("Yup validation error:", errors);
    }

    if (
      (!educationErrorState &&
        !experienceErrorState &&
        dynamicInputsFilled("education") &&
        dynamicInputsFilled("experience") &&
        toggleMenu1 === true) ||
      toggleMenu2 === true ||
      toggleMenu3 === true
    ) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [passwordVisibleRepeat, setPasswordVisibleRepeat] = useState(false);
  const togglePasswordVisibilityRepeat = () => {
    setPasswordVisibleRepeat(!passwordVisibleRepeat);
  };

  //Variables and functions for checking and setting password checks
  const [passwordCheck1, setPasswordCheck1] = useState(false);
  const [passwordCheck2, setPasswordCheck2] = useState(false);

  const handleModalButton = () => {
    setIsSecondModalOpen;
    setIsSecondModalOpen(true);
  };

  //Handle only inputNumbers for modal
  const [modalInputValue, setModalInputValue] = useState("");
  const [intError, setIntError] = useState(false);
  const handleInputNumbersOnly = (e: any) => {
    // Disable non-numeric characters
    const numericInput = e.target.value.replace(/[^0-9]/g, "");

    setModalInputValue(numericInput);
    setIntError(!/^[0-9]*$/.test(e.target.value));
  };

  return (
    <Layout meta="Profile">
      <form onSubmit={handleSubmit(handleUpdateSubmit)}>
        <div className="relative right-0 h-screen flex flex-col items-center ">
          <div className="relative py-8 px-10 w-full">
            <div className="text-center">
              <div className="inline-block">
                <div className="text-left mt-16 mb-20 text-neutral-700 text-[32px] font-bold font-['Montserrat']">
                  Editar perfil
                </div>

                {/* Menu-1-personal-information */}

                <div className="Menu-1-personal-information">
                  <button
                    type="button"
                    className={`first_form_open w-[1000px] h-[72px] p-6 shadow-xl flex-col justify-start items-start gap-20 inline-flex text-white font-bold font-montserrat pl-6 relative ${
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

                {toggleMenu1 && (
                  <div className="border border-[#166276] p-4 rounded-b-lg text-left bg-white shadow-xl">
                    <div onClick={imageClick}>
                      {formData.photo ? (
                        <img
                          src={`https://storage.googleapis.com/educado-bucket/${formData.photo}`}
                          className="w-[120px] h-[120px] p-[0px] bg-cyan-800 rounded-[60px] border-2 border-white inline-flex"
                          alt=""
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] p-[30px] bg-cyan-800 rounded-[60px] border-2 border-white justify-center items-center gap-[30px] inline-flex">
                          <div className="text-white text-4xl font-bold font-['Montserrat']">
                            {formData.UserName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={myRef}
                        style={{ display: "none" }}
                      />

                      <button
                        className=" p-7 text-center text-cyan-800 text-base font-bold font-['Montserrat'] underline"
                        onChange={handleFileChange}
                      >
                        Alterar foto de perfil
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-7">
                      <div className="flex flex-col ">
                        <label
                          htmlFor="firstName"
                          className="font-['Montserrat']"
                        >
                          Nome
                          <span className="p-1 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                            *
                          </span>
                        </label>
                        <input
                          className="bg-[#E4F2F5] rounded-lg border-none"
                          placeholder="User name"
                          type="text"
                          {...register("UserName", {
                            required: "digite seu nome completo.",
                          })}
                          name="UserName"
                          value={formData.UserName}
                          onChange={handleInputChange}
                        />
                        {errors.UserName && (
                          <span className="user_name_error">
                            {errors.UserName?.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col ">
                        <label htmlFor="email" className="font-['Montserrat']">
                          Email
                          <span className="p-1 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                            *
                          </span>
                        </label>
                        <input
                          className="bg-[#E4F2F5] rounded-lg border-none"
                          placeholder="user@email.com"
                          type="email"
                          {...register("UserEmail", {
                            required: "digite seu nome completo.",
                          })}
                          //
                          name="UserEmail"
                          value={formData.UserEmail}
                          onChange={handleInputChange}
                        />
                        {errors.UserEmail && (
                          <span className="user_email_error">
                            {errors.UserEmail?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="password" className="font-['Montserrat']">
                        Senha:
                        <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                          *
                        </span>
                      </label>
                      <div className="grid grid-cols-3 ">
                        <input
                          className="bg-[#E4F2F5] rounded-lg border-none"
                          placeholder="******"
                          type="text"
                          name="password"
                        />
                        <button
                          type="button"
                          className="text-left p-2 text-[#166276] underline"
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        >
                          Alterar Senha
                        </button>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="linkedin"
                          className="font-['Montserrat']"
                        >
                          LinkedIn Link:
                          <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                            *
                          </span>
                        </label>
                        <input
                          className="bg-[#E4F2F5] rounded-lg border-none"
                          type="text"
                          {...register("linkedin", {
                            required: "digite seu nome completo.",
                          })}
                          name="linkedin"
                          value={formData.linkedin || ""}
                          onChange={handleInputChange}
                        />
                        {errors.linkedin && (
                          <span className="user_linkedin_error">
                            {errors.linkedin?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="bio" className="font-['Montserrat']">
                        Biografia e motivações:
                        <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                          *
                        </span>
                      </label>
                      <textarea
                        className="h-[120px] bg-[#E4F2F5] rounded-lg border-none resize-none text-base font-normal font-['Montserrat']"
                        placeholder="Contente mais sobre você"
                        maxLength={400}
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                      />
                      <div className="text-right text-xs text-gray-400">
                        {handleCharCountBio()}/400 caracteres
                      </div>
                    </div>

                    {isModalOpen && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
                          <div
                            className="bg-[#E4F2F5] rounded-lg p-9 h-97"
                            style={{ width: "520px" }} //KOM TILBAGE OG FJERN CSS
                          >
                            <div className="flex flex-col ">
                              <h1 className="text-xl font-bold text-black ">
                                Redefinição de senha
                              </h1>
                              <label
                                className="py-6 font-['Montserrat']"
                                htmlFor="newPassword"
                              >
                                Enviamos um código par ao seu email de
                                redefinição de senha, por favor, insira o mesmo
                                abaixo:
                              </label>
                              <div className="flex justify-center items-center mt-6">
                                <input
                                  className="bg-white rounded-lg text-center border-none w-72"
                                  placeholder="XXXX"
                                  type="text"
                                  name="newPassword"
                                  value={modalInputValue}
                                  onChange={handleInputNumbersOnly}
                                />
                              </div>
                              {intError && (
                                <span className=" ml-28 ">
                                  Por favor, coloque um numero
                                </span>
                              )}

                              <div className="flex justify-center items-center gap-2 py-2">
                                <p className="text-[#A1ACB2]">
                                  O cogió não chegou?
                                </p>
                                <button
                                  type="button"
                                  className=" underline"
                                  onClick={() => {
                                    setIsModalOpen(false);
                                  }}
                                >
                                  Reenviar código
                                </button>
                              </div>

                              <div className="grid grid-cols-2">
                                <button
                                  type="button"
                                  className="text-[#166276] underline py-0 mt-7 text-left"
                                  onClick={() => {
                                    setIsModalOpen(false);
                                  }}
                                >
                                  Cancelar
                                </button>

                                <div className="">
                                  <button
                                    type="button"
                                    className="space-x-44 disabled:opacity-20 disabled:bg-cyan-500 rounded-lg bg-[#166276] 
                                  transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50 text-white text-base font-bold font-['Montserrat'] mt-7 w-40 p-3"
                                    onClick={() => {
                                      if (!intError) {
                                        handleModalButton();
                                      }
                                    }}
                                  >
                                    Continuar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isSecondModalOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
                      <div
                        className="bg-[#E4F2F5] rounded-lg p-9 h-97"
                        style={{ width: "520px" }} //KOM TILBAGE OG FJERN CSS
                      >
                        <div className="flex flex-col ">
                          <h1 className="text-xl font-bold text-black text-left">
                            Redefinição de senha
                          </h1>

                          {/*Password Field*/}
                          <div className="relative">
                            <label
                              className=" flex flex-start text-[#383838] text-xs font-normal gap-1 font-['Montserrat'] mt-5"
                              htmlFor="passwordField"
                            >
                              Senha {/*Password*/}
                              <span className=" text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              data-cy="password-field"
                              type={passwordVisible ? "text" : "password"}
                              id="passwordField"
                              className="w-[100%] hflex border-gray-300  py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                              placeholder="**********"
                            />

                            <button
                              data-cy="password-eye"
                              type="button"
                              className="absolute right-3 bottom-3"
                              onClick={togglePasswordVisibility}
                              id="hidePasswordIcon"
                            >
                              <Icon
                                path={
                                  passwordVisible
                                    ? mdiEyeOutline
                                    : mdiEyeOffOutline
                                }
                                size={1}
                                color="#A1ACB2"
                              />
                            </button>
                          </div>

                          {/*Password Checks*/}
                          <div className="px-3">
                            <div className="items-stretch text-[#A1ACB2] text-xs font-normal font-['Montserrat'] mt-2 text-left">
                              {passwordCheck1 ? (
                                <Icon
                                  className=" left-20 float-left"
                                  path={mdiCheckBold}
                                  size={0.55}
                                  color=" green"
                                />
                              ) : null}
                              &bull; Mínimo 8 caracteres{" "}
                              {/*Minimum 8 characters*/}
                            </div>

                            <div className="text-[#A1ACB2] text-xs font-normal font-['Montserrat'] items-stretch text-left">
                              {passwordCheck2 ? (
                                <Icon
                                  className="left-20 float-left"
                                  path={mdiCheckBold}
                                  size={0.55}
                                  color="green"
                                />
                              ) : null}
                              &bull; Conter pelo menos uma letra{" "}
                              {/*Contain at least one letter*/}
                            </div>
                          </div>

                          {/*Confirm Password Field */}
                          <div className="relative">
                            <label
                              className=" flex flex-start text-[#383838] text-xs font-normal gap-1 font-['Montserrat'] mt-6"
                              htmlFor="passwordFieldRepeat"
                            >
                              Confirmar novo senha {/*Confirm Password*/}
                              <span className="text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              type={passwordVisibleRepeat ? "text" : "password"}
                              id="passwordFieldRepeat"
                              placeholder="********** "
                              className="w-[100%] flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute right-3 bottom-3"
                              onClick={togglePasswordVisibilityRepeat}
                            >
                              <Icon
                                path={
                                  passwordVisibleRepeat
                                    ? mdiEyeOutline
                                    : mdiEyeOffOutline
                                }
                                size={1}
                                color="#A1ACB2"
                              />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 ">
                            <button
                              type="button"
                              className="text-[#166276] underline py-0 mt-7 text-left"
                              onClick={() => {
                                setIsSecondModalOpen(false);
                              }}
                            >
                              Cancelar
                            </button>

                            <div className="">
                              <button
                                type="button"
                                className="space-x-44 disabled:opacity-20 disabled:bg-cyan-500 rounded-lg bg-[#166276] 
                                  transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50 text-white text-base font-bold font-['Montserrat'] mt-7 w-56 p-3"
                                onClick={() => {
                                  handleModalButton();
                                }}
                              >
                                Salvar novo senha
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="hidden sm:block" aria-hidden="true">
                  <div className="py-3"></div>
                </div>

                {/* Menu for academic experience */}
                <div
                  data-cy="academic-menu"
                  className="Menu-2-academic-experience "
                >
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
                    <Fragment key={index}>
                      <div
                        className={`border border-[#166276] p-4 text-left bg-white shadow-xl ${
                          (educationformData.length === 1 && index === 0) ||
                          (educationformData.length > 1 &&
                            index === educationformData.length - 1)
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        <label className="text-[#A1ACB2] font-['Montserrat']">
                          Experiências acadêmicas {index + 1}
                        </label>{" "}
                        {/* Der skal laves count HER */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col ">
                            <label
                              htmlFor="Formacao"
                              className="font-['Montserrat']"
                            >
                              Formação:
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <select
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              name="educationLevel"
                              value={
                                educationformData[index]?.educationLevel || ""
                              }
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            >
                              <option value="basic">Básico</option>
                              <option value="medium">Médio</option>
                              <option value="superior">Superior</option>
                            </select>
                          </div>
                          <div className="flex flex-col ">
                            <label
                              htmlFor="status"
                              className="font-['Montserrat']"
                            >
                              Status
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>

                            <select
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              name="status"
                              value={educationformData[index]?.status || ""}
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            >
                              <option value="Progressing">Em andamento</option>
                              <option value="Done">Concluída</option>
                              <option value="Not Done">Não finalizado</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col ">
                            <label
                              htmlFor="firstName"
                              className="font-['Montserrat']"
                            >
                              Curso:
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="st"
                              type="text"
                              name="course"
                              value={educationformData[index]?.course || ""}
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            />
                          </div>
                          <div className="flex flex-col ">
                            <label
                              htmlFor="email"
                              className="font-['Montserrat']"
                            >
                              instituição
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Instituição"
                              type="text"
                              name="institution"
                              value={
                                educationformData[index]?.institution || ""
                              }
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col ">
                            <label
                              htmlFor="firstName"
                              className="font-['Montserrat']"
                            >
                              início:
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Mês/Ano"
                              type="text"
                              max={4}
                              name="startDate"
                              value={educationformData[index]?.startDate || ""}
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            />
                            {educationErrors[index]?.startDate != "" && (
                              <span className="education-startDate p-3 mt-2">
                                {educationErrors[index]?.startDate}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col ">
                            <label
                              htmlFor="endDate"
                              className="font-['Montserrat']"
                            >
                              Fim
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Mês/Ano"
                              type="text"
                              max={4}
                              name="endDate"
                              value={educationformData[index]?.endDate || ""}
                              onChange={(value) => {
                                handleEducationInputChange(value, index);
                              }}
                            />
                            {educationErrors[index].endDate != "" && (
                              <span className="education-endDate p-3 mt-2">
                                {educationErrors[index].endDate}
                              </span>
                            )}
                          </div>
                        </div>
                        {index > 0 && (
                          <div className="flex justify-end gap-1">
                            <Icon
                              path={mdiDelete}
                              size={0.8}
                              color="#CF6679"
                              className="mt-3.5"
                            />
                            <button
                              type="button"
                              className=" text-[#CF6679] py-3"
                              onClick={() => {
                                handleEducationDelete(
                                  index,
                                  educationformData[index]?._id
                                    ? educationformData[index]?._id
                                    : null
                                );
                              }}
                            >
                              Remover formação
                            </button>
                          </div>
                        )}
                        <div
                          className={
                            index === educationformData.length - 1
                              ? "border-t border-[#A1ACB2] py-2 mt-4"
                              : "py-30 mt-5"
                          }
                        />
                        {index === educationformData.length - 1 ? (
                          <>
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="education_add_button w-full px-4 py-2 rounded-lg border-dotted border-2 border-[#A1ACB2]"
                                onClick={() => {
                                  addNewEducationForm(index);
                                }}
                              >
                                Adicionar outra experiência
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}

                <div className="hidden sm:block" aria-hidden="true">
                  <div className="py-3"></div>
                </div>

                {/* Menu for academic experience */}
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
                    <Fragment key={index}>
                      {" "}
                      <div
                        className={`border border-[#166276] p-4 text-left bg-white shadow-xl ${
                          (experienceformData.length === 1 && index === 0) ||
                          (experienceformData.length > 1 &&
                            index === experienceformData.length - 1)
                            ? "rounded-b-lg"
                            : ""
                        }`}
                      >
                        <label className="text-[#A1ACB2] font-['Montserrat']">
                          Experiências profisisonais {index + 1}
                        </label>{" "}
                        {/* Der skal laves count HER */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col ">
                            <label
                              htmlFor="firstName"
                              className="font-['Montserrat']"
                            >
                              Empresa:
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Mobile education new"
                              type="text"
                              name="company"
                              value={experienceformData[index]?.company || ""}
                              onChange={(value) => {
                                handleExperienceInputChange(value, index);
                              }}
                            ></input>
                          </div>
                          <div className="flex flex-col ">
                            <label
                              htmlFor="status"
                              className="font-['Montserrat']"
                            >
                              Cargo
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Product designer"
                              type="text"
                              name="jobTitle"
                              value={experienceformData[index]?.jobTitle || ""}
                              onChange={(value) => {
                                handleExperienceInputChange(value, index);
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col ">
                            <label
                              htmlFor="firstName"
                              className="font-['Montserrat']"
                            >
                              início:
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Mês/Ano"
                              type="text"
                              name="startDate"
                              value={experienceformData[index]?.startDate || ""}
                              onChange={(value) => {
                                handleExperienceInputChange(value, index);
                              }}
                            />
                            {experienceErrors[index].startDate != "" && (
                              <span className="experience-startDate p-3 mt-2">
                                {experienceErrors[index].startDate}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col ">
                            <label
                              htmlFor="email"
                              className="font-['Montserrat']"
                            >
                              Fim
                              <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                                *
                              </span>
                            </label>
                            <input
                              className="bg-[#E4F2F5] rounded-lg border-none"
                              placeholder="Mês/Ano"
                              type="text"
                              name="endDate"
                              value={experienceformData[index]?.endDate || ""}
                              onChange={(value) => {
                                handleExperienceInputChange(value, index);
                              }}
                            />
                            {experienceErrors[index].endDate != "" && (
                              <span className="experience-endDate p-3 mt-2">
                                {experienceErrors[index].endDate}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <input
                            className="border-[#166276]"
                            type="checkbox"
                            checked={
                              experienceformData[index]?.checkBool || false
                            }
                            onChange={() => {
                              handleCheckboxChange(index);
                            }}
                          />
                          <label className="p-2 font-['Montserrat']">
                            Meu emprego atual
                          </label>
                        </div>
                        <div className="flex flex-col py-3 ">
                          <label
                            htmlFor="activatityDescription"
                            className="font-['Montserrat']"
                          >
                            Descrição de atividades:
                            <span className="p-2 text-[#FF4949] text-xs font-normal font-['Montserrat']">
                              *
                            </span>
                          </label>
                          <textarea
                            className="h-[120px] bg-[#E4F2F5] rounded-lg border-none resize-none text-base font-normal font-['Montserrat']"
                            placeholder="Escreva aqui as suas responsabilidadees"
                            maxLength={400}
                            name="description"
                            value={experienceformData[index]?.description || ""}
                            onChange={(value) => {
                              handleExperienceInputChange(value, index);
                            }}
                          />
                          <div className="text-right text-xs text-gray-400">
                            {handleCountExperience(index)}/400 caracteres
                          </div>
                        </div>
                        {index > 0 && (
                          <div className="flex justify-end gap-1">
                            <Icon
                              path={mdiDelete}
                              size={0.8}
                              color="#CF6679"
                              className="mt-3.5"
                            />
                            <button
                              type="button"
                              className="underline text-[#CF6679] py-3"
                              onClick={() =>
                                handleExperienceDelete(
                                  index,
                                  experienceformData[index]?._id
                                    ? experienceformData[index]?._id
                                    : ""
                                )
                              }
                            >
                              Remover formação
                            </button>
                          </div>
                        )}
                        <div
                          className={
                            index === experienceformData.length - 1
                              ? "border-t border-[#A1ACB2] py-2 mt-4"
                              : "py-30 mt-5"
                          }
                        />
                        {/* Btn is only visible on last */}
                        {index === experienceformData.length - 1 ? (
                          <>
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="education_add_button w-full px-4 py-2 rounded-lg border-dotted border-2 border-[#A1ACB2]"
                                onClick={() => {
                                  addNewExperienceForm(index);
                                }}
                              >
                                Adicionar outra experiência
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}
                <div>
                  {submitError && (
                    <span className=" ml-28 ">
                      Alguns campos não estão preenchidos
                    </span>
                  )}
                </div>

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
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Profile;
