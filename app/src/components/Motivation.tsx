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
    
    );
    };
    
    export default Motivation