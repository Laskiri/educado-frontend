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
import AkademiskeErfaringer from "../components/AkademiskeErfaringer";
import ProfessionelErfaring from "../components/ProfessionelErfaring";

const Application = () => {
  const [toggleMotivation, setToggleMotivation] = useState(true);
  const [toggleAkademiskeErfaringer, setToggleAkademiskeErfaringer] = useState(false);
  const [toggleProfessionelErfaring, setToggleProfessionelErfaring] = useState(false);

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
  
  <body className="relative right-0 h-screen flex flex-col justify-center items-center gap-5 z-50">

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

    {/*Box for Akademiske erfaringer*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setToggleAkademiskeErfaringer(!toggleAkademiskeErfaringer)}>
        <div className="flex items-start">
          {toggleAkademiskeErfaringer ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências acadêmicas
        </div>
      </button>

      {toggleAkademiskeErfaringer && (
        <AkademiskeErfaringer/>
      )}
    </div>

    {/*Box for Professionel erfaring*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setToggleProfessionelErfaring(!toggleProfessionelErfaring)}>
        <div className="flex items-start">
          {toggleProfessionelErfaring ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências profissionais
        </div>
      </button>

    {toggleProfessionelErfaring && (
      <ProfessionelErfaring/>
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