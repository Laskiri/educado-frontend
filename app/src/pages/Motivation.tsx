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

const Motivation = () => {
  const [toggleMotivation, setToggleMotivation] = useState(true);
  const [togglePlaceholder1, setTogglePlaceholder1] = useState(false);
  const [togglePlaceholder2, setTogglePlaceholder2] = useState(false);
  
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
        <div className="relative border border-[#166276] p-4 rounded-b-lg text-left bg-white z-50">
          <div className="flex flex-col">
            <label htmlFor="motivation">
              Queremos saber mais sobre você! Nos conte suas motivações para fazer parte do Educado
            </label>
            <textarea
              className="bg-sky-50 rounded-lg border-none"
              placeholder="Escreva aqui porque você quer fazer parte de projeto"
              maxLength={maxLength}
              name="motivation"
              value={motivation}
              onChange={handleMotivationChange}
            />
            <div className="text-right text-gray-500 text-sm font-normal font-['Montserrat']">
            {motivation.length}/{maxLength} caracteres
            </div>
          </div>
        </div>
      )}
    </div>

    {/*Box for placeholder 1*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setTogglePlaceholder1(!togglePlaceholder1)}>
        <div className="flex items-start">
          {togglePlaceholder1 ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências acadêmicas
        </div>
      </button>

      {togglePlaceholder1 && (

        <div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-5 text-left bg-white z-50">
        <div className="relative flex">
        <input
        type="text" id="placeholderField11"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />

        <input
        type="text" id="placeholderField12"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />
        </div>
        <div className="relative flex">
        <input
        type="text" id="placeholderField13"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />

        <input
        type="text" id="placeholderField14"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />
        </div>
        <div className="relative flex">
        <input
        type="text" id="placeholderField15"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />

        <input
        type="text" id="placeholderField16"
        className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
        placeholder="placeholderField"
        />
        </div>
      </div>
      )}
    </div>

    {/*Box for placeholder 2*/}
    <div className="w-[65%] justify-center items-center">
      <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
      onClick={() => setTogglePlaceholder2(!togglePlaceholder2)}>
        <div className="flex items-start">
          {togglePlaceholder2 ? (
            <Icon path={mdiChevronUp} size={1} color="#FFFFFF" />
          ) : (
            <Icon path={mdiChevronDown} size={1} color="#FFFFFF" />
          )}
          Experiências profissionais
        </div>
      </button>

      {togglePlaceholder2 && (
      
        <div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-5 text-left bg-white z-50">
          <div className="relative flex">
          <input
          type="text" id="placeholderField21"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="placeholderField"
          />

          <input
          type="text" id="placeholderField22"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="placeholderField"
          />
          </div>
          <div className="relative flex">
          <input
          type="text" id="placeholderField23"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="placeholderField"
          />

          <input
          type="text" id="placeholderField24"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="placeholderField"
          />
          </div>
          <div className="relative flex">
          <input
          type="text" id="placeholderField25"
          className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
          placeholder="placeholderField"
          />

          </div>
        </div>
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

export default Motivation