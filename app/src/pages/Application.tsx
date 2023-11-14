import { useState, ChangeEvent} from "react";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { Link } from "react-router-dom"
import Motivation from "../components/Motivation";
import AcademicExperiences from "../components/AcademicExperiences";
import ProfessionalExperience from "../components/ProfessionalExperience";

import { useForm, SubmitHandler } from "react-hook-form";

export interface NewApplication {
  motivation: String;
}

const Application = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<NewApplication>();

  const [toggleMotivation, setToggleMotivation] = useState(true);
  const [toggleAcademicExperiences, setToggleAcademicExperiences] = useState(false);
  const [toggleProfessionalExperience, setToggleProfessionalExperience] = useState(false);

  const onSubmit: SubmitHandler<NewApplication> = async (data) => {
  console.log(data.motivation)
  };

  const [motivation, setMotivation] = useState('');
  const maxLength = 800;

  // Function to handle changes in the textarea
  const handleMotivationChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= maxLength) {
      setMotivation(text);
    }
  };

return (
<main>
  { /*Navbar*/ }
  <nav className="flex fixed w-full items-center justify-between bg-secondary box-shadow-md bg-fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--secondary, #F1F9FB)', boxShadow: '0px 4px 4px 0px rgba(35, 100, 130, 0.25)' }}>
    <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
      <div className="navbar-start">
        <Link to="/" className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl">
          <img src= '/logo.svg' alt="logo" className="w-[24.43px] h-6" /> <img src= '/educado.svg' alt="educado" className="h-6" />
        </Link>
      </div>
    </div>
  </nav>
  
  <body className="relative right-0 h-screen flex flex-col items-center gap-5 z-50">

    {/*Box fot text*/}
    <div className="items-center p-10 pt-20">
      <h1 className="text-center text-cyan-800 text-[32px] font-bold font-['Montserrat']">
        Que bom que você quer fazer parte do Educado! {/*Vi er glad for, at du vil være en del af Educado!*/}
      </h1>
      <p className="text-center text-neutral-700 text-base font-normal font-['Montserrat']">
        {/*Vi har brug for nogle oplysninger for at godkende din adgang som indholdsskaber. Vi vender tilbage til dig med et svar via e-mail.*/}
        Precisamos de algumas informações para aprovar seu acesso de criador de conteúdo. Retornaremos com uma resposta via e-mail
      </p>
    </div>

    {/*Box for the Motivation */}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setToggleMotivation(!toggleMotivation)}>
        <div className="flex items-start">
          {toggleMotivation ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Motivações
        </div>
      </button>

      {toggleMotivation && (
        <div className="relative border border-[#166276] p-4 rounded-b-lg text-left bg-white z-50">
        <div className="flex flex-col">
          <label htmlFor="motivation">
            Queremos saber mais sobre você! Nos conte suas motivações para fazer parte do Educado
          </label>
          <textarea
            className="bg-sky-50 rounded-lg border-none"
            placeholder="Escreva aqui porque você quer fazer parte de projeto"
            maxLength={maxLength}
            value={motivation}
            {...register("motivation", { required: true })}
            onChange={handleMotivationChange}
          />
          <div className="text-right text-gray-500 text-sm font-normal font-['Montserrat']">
          {motivation.length}/{maxLength} caracteres
          </div>
        </div>
      </div>
      )}
    </div>

    {/*Box for Academic Experiences*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setToggleAcademicExperiences(!toggleAcademicExperiences)}>
        <div className="flex items-start">
          {toggleAcademicExperiences ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências acadêmicas
        </div>
      </button>

      {toggleAcademicExperiences && (
        <div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-10 text-left bg-white z-50">
          <div className="grid grid-cols-2 gap-10"> 
            <p>Formação</p>
            <p>Status</p>
          </div>
          <div className="relative flex gap-10">
            <select className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            id="AcademicLevel">
              <option value="basic">Básico</option>
              <option value="medium">Médio</option>
              <option value="superior">Superior</option>
            </select>
        
            <select className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            id="AcademicStatus">
              <option value="Progressing">Em andamento</option>
              <option value="Done">Concluída</option>
              <option value="Not Done">Não finalizado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-10"> 
            <p>Curso</p>
            <p>Instituição</p>
          </div>
          <div className="relative flex gap-10">
            <input
            type="text" id="AcademicCourse"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Curso"
            />
        
            <input
            type="text" id="AcademicInstitution"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Instituição"
            />
          </div>
          <div className="grid grid-cols-2 gap-10"> 
            <p>Início</p>
            <p>Fim</p>
          </div>
          <div className="relative flex gap-10">
            <input
            type="text" id="AcademicStart"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            />
        
            <input
            type="text" id="AcademicEnd"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            />
          </div>
        </div>
      )}
    </div>

    {/*Box for Professional Experience*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setToggleProfessionalExperience(!toggleProfessionalExperience)}>
        <div className="flex items-start">
          {toggleProfessionalExperience ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências profissionais
        </div>
      </button>

    {toggleProfessionalExperience && (
      <div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-5 text-left bg-white z-50">
        <div className="grid grid-cols-2 gap-10"> 
          <p>Empresa</p>
          <p>Cargo</p>
        </div>
        <div className="relative flex gap-10">
          <input
          type="text" id="ProfessionalCompany"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="Mobile Education"
          />
    
          <input
          type="text" id="ProfessionalPosition"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="Product Designer"
          />
        </div>
        <div className="grid grid-cols-2 gap-10"> 
          <p>Início</p>
          <p>Fim</p>
        </div>
        <div className="relative flex gap-10">
          <input
          type="text" id="ProfessionalStart"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="Mês / Ano"
          />
    
          <input
          type="text" id="ProfessionalEnd"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="Mês / Ano"
          />
        </div>
        <div className="grid grid-cols-1"> 
          <p>Descrição de atividades</p>
        </div>
        <div className="relative flex">
          <input
          type="text" id="ProfessionalActivities"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="Escreva aqui as suas responsabilidades"
          />
        </div>
      </div>
    )}
    </div>

    <div className="w-[65%] flex justify-end">
      <button type="submit" className="w-[238px] h-[52px] px-10 py-4 bg-cyan-800 hover:bg-cyan-900 rounded-lg justify-center items-start gap-2.5 inline-flex text-center text-white text-base font-bold font-['Montserrat']">
        Enviar para análise   
      </button>
    </div>
  </body>
</main>
)    
}

export default Application