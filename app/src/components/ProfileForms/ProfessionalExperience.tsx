//Imports
import { Icon } from "@mdi/react";
import React, { Fragment } from "react";
import {mdiAlertCircleOutline, mdiDelete} from "@mdi/js";

//Exporting UI content&structure of
export default function ProfessionalExperienceForm({
  index,
  experienceFormData,
  handleExperienceInputChange,
  experienceErrors,
  addNewExperienceForm,
  handleExperienceDelete,
  handleCountExperience,
  handleCheckboxChange,
}: {
  index: number;
  experienceFormData: { [key: string]: any }[];
  handleExperienceInputChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  experienceErrors: { [key: string]: any }[];
  addNewExperienceForm: (index: number) => void;
  handleExperienceDelete: (index: number, id: string) => void;
  handleCountExperience: (index: number) => number;
  handleCheckboxChange: (index: number) => void;
}) {

  function displayInvalidDateFormatErrMsg(errorMsg: string) {
    if(errorMsg !== "") {
      return (
          <p className="flex items-center mt-1 ml-4 text-warning text-sm font-['Montserrat']" role="alert">
            {errorMsg}
          </p>);
    }
  }

  return (
    <Fragment>
      <div key={index}>
        {" "}
        <div
          /* Styling based on conditions */
          className={`border border-[#166276] p-4 text-left bg-white shadow-xl ${
            (experienceFormData.length === 1 && index === 0) ||
            (experienceFormData.length > 1 &&
              index === experienceFormData.length - 1)
              ? "rounded-b-lg"
              : ""
          }`}
        >
          <label className="text-[#A1ACB2] font-['Montserrat']">
            Experiências profisisonais {index + 1}
          </label>{" "}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col ">
              <label htmlFor="firstName" className="font-['Montserrat']">
                Empresa:
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="Mobile experience new"
                type="text"
                name="company"
                value={experienceFormData[index]?.company || ""}
                onChange={(value) => {
                  handleExperienceInputChange(value, index);
                }}
              ></input>
            </div>
            <div className="flex flex-col ">
              <label htmlFor="status" className="font-['Montserrat']">
                Cargo
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="Product designer"
                type="text"
                name="jobTitle"
                value={experienceFormData[index]?.jobTitle || ""}
                onChange={(value) => {
                  handleExperienceInputChange(value, index);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col ">
              <label htmlFor="firstName" className="font-['Montserrat']">
                início:
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="Mês/Ano"
                type="text"
                name="startDate"
                value={experienceFormData[index]?.startDate || ""}
                onChange={(value) => {
                  handleExperienceInputChange(value, index);
                }}
              />

              {/* Display invalid date input error message */}
              {displayInvalidDateFormatErrMsg(experienceErrors[index].startDate)}

            </div>
            <div className="flex flex-col ">
              <label htmlFor="email" className="font-['Montserrat']">
                Fim
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                placeholder="Mês/Ano"
                type="text"
                name="endDate"
                value={experienceFormData[index]?.endDate || ""}
                onChange={(value) => {
                  handleExperienceInputChange(value, index);
                }}
              />

              {/* Display invalid date input error message */}
              {displayInvalidDateFormatErrMsg(experienceErrors[index].endDate)}

            </div>
          </div>
          <div>
            <input
              className="border-[#166276]"
              type="checkbox"
              checked={experienceFormData[index]?.checkBool || false}
              onChange={() => {
                handleCheckboxChange(index);
              }}
            />
            <label className="p-2 font-['Montserrat']">Meu emprego atual</label>
          </div>
          <div className="flex flex-col py-3 ">
            <label
              htmlFor="activatityDescription"
              className="font-['Montserrat']"
            >
              Descrição de atividades:
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <textarea
              className="h-[120px] bg-[#E4F2F5] rounded-lg border-none resize-none text-lg font-normal font-['Montserrat']"
              placeholder="Escreva aqui as suas responsabilidadees"
              maxLength={400}
              name="description"
              value={experienceFormData[index]?.description || ""}
              onChange={(value) => {
                handleExperienceInputChange(value, index);
              }}
            />{" "}
            <div className="text-right text-sm text-gray-400">
              {handleCountExperience(index)}/400 caracteres
            </div>
          </div>
          {/* Delete button is displayed on all forms except the first one */}
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
                    experienceFormData[index]?._id
                      ? experienceFormData[index]?._id
                      : ""
                  )
                }
              >
                Remover formação
              </button>
            </div>
          )}
          {/* only display border on last form otherwise create distance */}
          <div
            className={
              index === experienceFormData.length - 1
                ? "border-t border-[#A1ACB2] py-2 mt-4"
                : "py-30 mt-5"
            }
          />
          {/* Btn is only visible on last created form*/}
          {index === experienceFormData.length - 1 ? (
            <>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="third_form_add w-full px-4 py-2 rounded-lg border-dotted border-2 border-[#A1ACB2]"
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
      </div>
    </Fragment>
  );
}
