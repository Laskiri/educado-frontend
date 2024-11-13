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
  Loading?: boolean;
  className?: string;
  width?: string;
}

const GenericModalComponent: React.FC<GenericModalProps> = ({
  title,
  contentText,
  confirmBtnText = "",
  cancelBtnText = "Cancelar",
  onClose,
  isVisible = false,
  onConfirm,
  isConfirmDisabled = false,
  children,
  Loading = false,
  className,
  width,
}) => {
  if (!isVisible) return null;

  return (
    <div className={`modal ${isVisible ? "modal-open" : null}`}>
      <div
        className={`bg-[#f1f9fb] max-h-100 m-10 p-10 rounded-3xl shadow-lg ${className}`}
        style={{ width: width || "500px" }}
      >
        <div className="flex justify-between items-center mb-5">
          {title && (
            <span className="font-bold text-xl text-wrap">{title}</span>
          )}
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <MdClose size={25} className="text-slate-400" />
          </button>
        </div>

        {contentText && (
          <p className="whitespace-normal w-full">{contentText}</p>
        )}
        {children}

        <div
          className={`flex w-full mt-5 ${
            confirmBtnText === "" ? "justify-center" : "justify-between"
          }`}
        > 
            {cancelBtnText && (
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
            )}

          {confirmBtnText && (
            <button
              type="submit"
              className="btn bg-[#166276] border-none px-10"
              onClick={onConfirm}
              disabled={isConfirmDisabled || Loading}
            >
              {Loading ? (
                <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2"></span>
              ) : null}
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