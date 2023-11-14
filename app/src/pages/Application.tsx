import React, {
  useState,
  useEffect,
  useRef,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  Fragment,
  ChangeEvent,
} from "react";
import Icon from "@mdi/react";
import {
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiCheckBold,
  mdiChevronDown,
  mdiChevronUp,
} from "@mdi/js";
import { Link } from "react-router-dom"
import Motivation from "../components/Motivation";
import AcademicExperiences from "../components/AcademicExperiences";
import ProfessionalExperience from "../components/ProfessionalExperience";

const Application = () => {
  const [toggleMotivation, setToggleMotivation] = useState(true);
  const [toggleAcademicExperiences, setToggleAcademicExperiences] = useState(false);
  const [toggleProfessionalExperience, setToggleProfessionalExperience] = useState(false);

return (
<main>
  { /*Navbar*/ }
  <nav className="flex fixed w-full items-center justify-between bg-secondary box-shadow-md bg-fixed top-0 left-0 right-0 z-10" style={{ background: 'var(--secondary, #F1F9FB)', boxShadow: '0px 4px 4px 0px rgba(35, 100, 130, 0.25)' }}>
    <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
      <div className="navbar-start">
        <Link to="/" className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl">
          <img src= '/logo.svg' alt="logo" className="w-[24.43px] h-6" /> <img src= '/educado.svg' alt="educado" className="h-6" />
        </Link>
      </div>
    </div>
  </nav>
  
  <body className="relative right-0 h-screen flex flex-col items-center gap-5 z-50">

    {/*Box fot texst*/}
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
        <Motivation/>
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
        <AcademicExperiences/>
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
      <ProfessionalExperience/>
    )}
    </div>

    <div className="w-[65%] flex justify-end">
      <button className="w-[238px] h-[52px] px-10 py-4 bg-cyan-800 hover:bg-cyan-900 rounded-lg justify-center items-start gap-2.5 inline-flex text-center text-white text-base font-bold font-['Montserrat']">
        Enviar para análise   
      </button>
    </div>
  </body>
</main>
)    
}

export default Application