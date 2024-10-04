import { useState } from 'react';
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

const AcademicExperiences = ({ register }: any) => {
  // State to toggle visibility
  const [toggleAcademicExperiences, setToggleAcademicExperiences] = useState(false);

  // State to keep track of all academic experience fields
  const [academicFields, setAcademicFields] = useState([{ id: Date.now() }]);

  // Function to add a new set of fields
  const addNewFields = () => {
    setAcademicFields([...academicFields, { id: Date.now() }]);
  };

  return (
    <div className="w-[65%] justify-center items-center">
      {/* Toggle button for the academic experience section */}
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
        onClick={() => setToggleAcademicExperiences(!toggleAcademicExperiences)}>
        <div className="flex items-start">
          {toggleAcademicExperiences ? (
            <Icon path={mdiChevronUp} size={1} color="tertiary" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="tertiary" />
          )}
          Experiências acadêmicas {/* Academic Experiences */}
        </div>
      </button>

      {/* Display fields if toggled on */}
      {toggleAcademicExperiences && (
        <div className="relative border flex-row border-blueButton p-4 rounded-b-lg gap-10 text-left bg-white z-50">
          {academicFields.map((field, index) => (
            <div key={field.id} className="mb-4">
              {/* Add divider only if it's not the first set of fields */}
              {index > 0 && <hr className="border-t border-gray-300 my-4" />}

              {/* Title for each experience */}
              <h3 className="text-lg font-semibold text-cyan-800 mb-2">Experiência {index + 1}</h3>

              <div className="grid grid-cols-2 gap-10"> 
                <p>Formação</p> {/* Training */}
                <p>Status</p> {/* Status */}
              </div>
              <div className="relative flex gap-10">
                <select className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  id={`academicLevel-${index}`}
                  {...register(`academicLevel-${index}`, { required: true })}>
                  <option value="Básico">Básico</option>
                  <option value="Médio">Médio</option>
                  <option value="Superior">Superior</option>
                </select>
                <select className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  id={`academicStatus-${index}`}
                  {...register(`academicStatus-${index}`, { required: true })}>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Não finalizado">Não finalizado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-10 mt-4"> 
                <p>Curso</p> { /* Major */ }
                <p>Instituição</p> { /* Institution */ }
              </div>
              <div className="relative flex gap-10">
                <input type="text" id={`major-${index}`}
                  className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  placeholder="Curso"
                  {...register(`major-${index}`, { required: true })}
                />
                <input type="text" id={`institution-${index}`}
                  className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  placeholder="Instituição"
                  {...register(`institution-${index}`, { required: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-10 mt-4"> 
                <p>Início</p> {/* Start Date */}
                <p>Fim</p> {/* End Date */}
              </div>
              <div className="relative flex gap-10">
                <input type="text" id={`educationStartDate-${index}`}
                  className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  placeholder="Mês / Ano"
                  {...register(`educationStartDate-${index}`, { required: true })}
                />
                <input type="text" id={`educationEndDate-${index}`}
                  className="w-[100%] border-gray-300 py-3 px-4 bg-white text-lg rounded-lg"
                  placeholder="Mês / Ano"
                  {...register(`educationEndDate-${index}`, { required: true })}
                />
              </div>
            </div>
          ))}

          {/* Add Button */}
          <div className="flex justify-center mt-4">
            <button type="button" onClick={addNewFields}
              className="flex items-center border border-dashed border-cyan-800 rounded p-2 hover:bg-cyan-100">
              <span className="text-cyan-800 text-lg font-bold mr-2">+</span>
              <span className="text-cyan-800 text-base">Adicionar Nova Experiência Acadêmica</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicExperiences;
