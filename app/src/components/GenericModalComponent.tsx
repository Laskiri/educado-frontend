import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface GenericModalProps {
  title?: string;
  contentText?: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onClose: () => void;
  isVisible?: boolean;
  onConfirm: () => void;
  isConfirmDisabled?: boolean;
  customStyles?: {
    overlay?: React.CSSProperties;
    body?: React.CSSProperties;
    title?: React.CSSProperties;
    closeButton?: React.CSSProperties;
    content?: React.CSSProperties;
    cancelButton?: React.CSSProperties;
    confirmButton?: React.CSSProperties;
  };
  children?: ReactNode | ReactNode[];
}

/**
 * Component that renders a generic modal with customizable text for title, content and action buttons.
 * Used to either display important information or prompt user for confirmation.
 * If text for confirmation button is not defined, only cancel button will be displayed (and centered).
 *
 * @returns JSX.Element
 */
const GenericModalComponent: React.FC<GenericModalProps> = ({
  // Destructuring of props and initialization of default values
  title,
  contentText,
  confirmBtnText = "", // If empty, no confirmation button will be displayed
  cancelBtnText = "Cancelar", // Renameable to e.g. "Fechar" (close) when invoking the component
  onClose,
  isVisible = false,
  onConfirm,
  isConfirmDisabled = false,
  children,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`modal ${isVisible ? "modal-open" : null}`}>
      <div className="modal-box bg-[#f1f9fb] max-h-80 hax-w-80 m-10 p-10">
        {title !== null ? (
          <div className="w-full mb-5">
            <span className="font-bold text-xl text wrap">{title}</span>
          </div>
        ) : null}

        {/* Window close button (X) */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <MdClose size={25} className="text-slate-400" />
        </button>

        {/* Content */}
        {contentText !== null ? (
          <p className="whitespace-normal w-full">{contentText}</p>
        ) : null}
        {children}

        {/* Action buttons */}
        {/* Only the cancel button is rendered (and centered), if text for confirmation button isn't defined */}
        <div
          className={`flex w-full mt-5 ${
            confirmBtnText === "" ? "justify-center" : "justify-between"
          }`}
        >
          {/* Cancel */}
          <button
            type="button"
            className="flex flex-col w-40 btn bg-transparent border-none hover:bg-transparent px-0"
            onClick={onClose}
          >
            <span className="text-[#166276] normal-case text-lg">
              {cancelBtnText}
            </span>
            <hr className="w-3/5 border-[#166276]" />
          </button>

          {/* Confirmation */}
          {/* Button not rendered if confirmBtnText is not defined when component is invoked */}
          {confirmBtnText !== "" && (
            <button
              type="submit"
              className="btn bg-[#166276] border-none px-10"
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            >
              <span className="normal-case text-base font-bold">
                {confirmBtnText}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModalComponent;
