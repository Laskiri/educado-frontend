import { useContext } from "react";
import { ToggleModalContext } from "../../pages/Signup";

type propsType = {
  codeVerified: boolean;
}

export default function NavigationFooter(props: propsType): JSX.Element {
  const toggleModal = useContext(ToggleModalContext);

  return (
    <div className=''>
      <div className="flex items-center justify-between gap-4 w-full mt-8">
        <label id="cancel-button" onClick={toggleModal} className="underline hover:cursor-pointer">
          Cancelar {/* Cancel */}
        </label>
        <label>
          <button id="continue" onClick={() => {/* handle continue logic here */}} className="py-2 px-7 bg-primary hover:bg-gray-100 border border-primary hover:text-primary text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:ring-offset-2  rounded">
            {!props.codeVerified ? 'Continuar' : 'Redefinir senha'} {/* Continue or reset password */}
          </button>
        </label>
      </div>
    </div>
  );
}
