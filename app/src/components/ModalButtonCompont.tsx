interface CancelButtonProps {
  isSubmitting: boolean;
  typeButtons: string;
  type: "create" | "edit";
}

export const ModalButtonCompont = ({
  isSubmitting,
  typeButtons,
  type,
}: CancelButtonProps) => {
  const handleCloseModal = () => {
    const modalCheckbox = document.getElementById(
      typeButtons
    ) as HTMLInputElement;
    modalCheckbox.checked = false;
    
  };

  return (
    <div className="modal-action">
      <div className="flex items-center justify-between gap-4 w-full mt-8">
        <label
          htmlFor={typeButtons}
          className="py-2 px-4 cursor-pointer bg-white hover:bg-gray-100 border border-primary  hover:border-primaryHover hover:text-primaryHover  text-primary w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
        >
          Cancelar
        </label>
        <label
          htmlFor={typeButtons}
          className=" bg-primary cursor-pointer hover:bg-primaryHover border border-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
        >
          {isSubmitting === false ? (
            <button
              type="submit"
              className="py-2 px-4 h-full w-full"
              onClick={handleCloseModal}
            >
              {type === "edit" ? "Editar" : "Criar"}
            </button>
          ) : (
            <button disabled className="py-2 px-4 h-full w-full">
              {type === "edit" ? "Editar" : "Criar"}
            </button>
          )}
        </label>
        
      </div>
    </div>
  );
};
