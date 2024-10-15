//Imports
import { Icon } from "@mdi/react";
import React, { Fragment } from "react";
import { mdiDelete } from "@mdi/js";

import { UseFormRegister } from 'react-hook-form';
import { NewApplication } from "../../interfaces/Application";

//Exporting UI content&structure of
export default function AcademicExperienceForm({
  index,
  educationFormData,
  handleEducationInputChange,
  educationErrors,
  addNewEducationForm,
  handleEducationDelete,
  register,
}: {
  index: number;
  educationFormData: Array<{
    educationLevel?: string;
    status?: string;
    course?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    _id?: string | number | null;
  }>;
  handleEducationInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
  educationErrors: Record<number, { startDate?: string; endDate?: string; [key: string]: string | undefined }>;
  addNewEducationForm: (index: number) => void;
  handleEducationDelete: (index: number, id: string | null) => void;
  // register: UseFormRegister<NewApplication>;
  register: any;
  errors: unknown;
}) {

  function displayInvalidDateFormatErrMsg(errorMsg: string) {
    if(errorMsg !== "") {
      return (
          <p className="flex items-center mt-1 ml-4 text-warning text-sm font-['Montserrat']" role="alert">
            {errorMsg}
          </p>
      );
    }
    return null;
  }

  return (
    <Fragment>
      <div
        /* Styling based on conditions */
        className={`border border-[#166276] p-4 text-left bg-white shadow-xl ${
          (educationFormData?.length === 1 && index === 0) ||
          (educationFormData?.length > 1 &&
            index === educationFormData?.length - 1)
            ? "rounded-b-lg"
            : ""
        }`}
      >
        {/* only display border on last form otherwise create distance */}
        <label className="text-[#A1ACB2] font-['Montserrat']">
          Experiências acadêmicas {index + 1}
        </label>{" "}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col ">
            <label htmlFor="Formacao" className="font-['Montserrat']">
              Formação:
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            {/* Drop down list for educationLevel */}
            <select
              className="bg-[#E4F2F5] rounded-lg border-none"

              id={`academicLevel-${index}`}
              {...register(`academicLevel-${index}`, { required: true })}

              name="educationLevel"
              value={educationFormData[index]?.educationLevel || ""}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            >
              <option value="Basic">Básico</option>
              <option value="Medium">Médio</option>
              <option value="Superior">Superior</option>
            </select>
          </div>
          {/* Drop down list for status */}
          <div className="flex flex-col ">
            <label htmlFor="status" className="font-['Montserrat']">
              Status
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <select
              className="bg-[#E4F2F5] rounded-lg border-none"

              id={`academicStatus-${index}`}
              {...register(`academicStatus-${index}`, { required: true })}

              name="status"
              value={educationFormData[index]?.status || ""}
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
            <label htmlFor="firstName" className="font-['Montserrat']">
              Curso:
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <input
              className="bg-[#E4F2F5] rounded-lg border-none"

              id={`major-${index}`}
              {...register(`major-${index}`, { required: true })}

              placeholder="Curso"
              type="text"
              name="course"
              value={educationFormData[index]?.course || ""}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="email" className="font-['Montserrat']">
              Instituição
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <input
              className="bg-[#E4F2F5] rounded-lg border-none"

              id={`institution-${index}`}
              {...register(`institution-${index}`, { required: true })}

              placeholder="Instituição"
              type="text"
              name="institution"
              value={educationFormData[index]?.institution || ""}
              onChange={(value) => {
                handleEducationInputChange(value, index);
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

              id={`educationStartDate-${index}`}
              {...register(`educationStartDate-${index}`, { required: true })}

              placeholder="Mês/Ano"
              type="text"
              max={4}
              name="startDate"
              value={educationFormData[index]?.startDate || ""}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(educationErrors[index].startDate)}

          </div>
          <div className="flex flex-col ">
            <label htmlFor="endDate" className="font-['Montserrat']">
              Fim
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>
            <input
              className="bg-[#E4F2F5] rounded-lg border-none"

              id={`educationEndDate-${index}`}
              {...register(`educationEndDate-${index}`, { required: true })}

              placeholder="Mês/Ano"
              type="text"
              max={4}
              name="endDate"
              value={educationFormData[index]?.endDate || ""}
              onChange={(value) => {
                handleEducationInputChange(value, index);
              }}
            />

            {/* Display invalid date input error message */}
            {displayInvalidDateFormatErrMsg(educationErrors[index].endDate)}

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
              className=" text-[#CF6679] py-3"
              onClick={() => {
                handleEducationDelete(
                  index,
                  educationFormData[index]?._id
                    ? educationFormData[index]?._id
                    : null
                );
              }}
            >
              Remover formação
            </button>
          </div>
        )}
        {/* only display border on last form otherwise create distance */}
        <div
          className={
            index === educationFormData?.length - 1
              ? "border-t border-[#A1ACB2] py-2 mt-4"
              : "py-30 mt-5"
          }
        />
        {/* Btn is only visible on last created form*/}
        {index === educationFormData?.length - 1 ? (
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
  );
}
