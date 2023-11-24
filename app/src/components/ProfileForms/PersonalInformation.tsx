//Imports
import { mdiCheckBold, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

//Exporting UI content&structure of
export default function PersonalInformationForm({
  formData,
  errors,
  handleCharCountBio,
  toggleMenu1,
  imageClick,
  handleFileChange,
  myRef,
  register,
  handleInputChange,
  isSecondModalOpen,
  modalInputValue,
  handleInputNumbersOnly,
  intError,
  setIsSecondModalOpen,
}: {
  formData: any;
  errors: any;
  handleCharCountBio: any;
  toggleMenu1: any;
  imageClick: any;
  handleFileChange: any;
  myRef: any;
  register: any;
  handleInputChange: any;
  isSecondModalOpen: any;
  modalInputValue: any;
  handleInputNumbersOnly: any;
  intError: any;
  setIsSecondModalOpen: any;
}) {
  //Variables and functions for checking and setting password checks
  const [passwordCheck1, setPasswordCheck1] = useState(false);
  const [passwordCheck2, setPasswordCheck2] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordVisibleRepeat, setPasswordVisibleRepeat] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  //Handle Modal
  const handleModalButton = () => {
    setIsSecondModalOpen;
    setIsSecondModalOpen(true);
  };

  //Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibilityRepeat = () => {
    setPasswordVisibleRepeat(!passwordVisibleRepeat);
  };
  return (
    <>
      {/* content of personal information when drop down button is clicked */}
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
              <label htmlFor="firstName" className="font-['Montserrat']">
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
              <label htmlFor="linkedin" className="font-['Montserrat']">
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

          {/* first change password modal open */}
          {isModalOpen && (
            <div className="grid grid-cols-2 gap-2">
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
                <div
                  className="bg-[#E4F2F5] rounded-lg p-9 h-97"
                  style={{ width: "520px" }}
                >
                  <div className="flex flex-col ">
                    <h1 className="text-xl font-bold text-black ">
                      Redefinição de senha
                    </h1>
                    <label
                      className="py-6 font-['Montserrat']"
                      htmlFor="newPassword"
                    >
                      Enviamos um código par ao seu email de redefinição de
                      senha, por favor, insira o mesmo abaixo:
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
                      <p className="text-[#A1ACB2]">O cogió não chegou?</p>
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

      {/* Second modal password change modal open */}
      {isSecondModalOpen && (
        <div className="grid grid-cols-2 gap-2">
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
            <div
              className="bg-[#E4F2F5] rounded-lg p-9 h-97"
              style={{ width: "520px" }}
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
                      path={passwordVisible ? mdiEyeOutline : mdiEyeOffOutline}
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
                    &bull; Mínimo 8 caracteres {/*Minimum 8 characters*/}
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
                        passwordVisibleRepeat ? mdiEyeOutline : mdiEyeOffOutline
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
    </>
  );
}
