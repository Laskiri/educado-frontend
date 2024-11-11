import React, { ReactNode } from "react";
import "./styles/GenericModalComponent.css";

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
  isLoading?: boolean;
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
  isLoading = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Title */}
        <div className="modal-title">
          {title !== null ? <h2>{title}</h2> : null}

          {/* Window close button (X) */}
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {title !== null ? <p>{contentText}</p> : null}
          {children}
        </div>

        {/* Action buttons */}
        {/* Only the cancel button is rendered (and centered), if text for confirmation button isn't defined */}
        <div
          className={`action-buttons ${
            confirmBtnText === "" ? "justify-center" : "justify-between"
          }`}
        >
          {/* Cancel */}
          <button type="button" className="cancel-button" onClick={onClose}>
            {cancelBtnText}
          </button>

          {/* Confirmation */}
          {/* Button not rendered if confirmBtnText is not defined when component is invoked */}
          {confirmBtnText !== "" && (
            <button
              type="submit"
              className="btn"
              onClick={onConfirm}
              disabled={isConfirmDisabled || isLoading}
            >
              {isLoading ? (
                <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2"></span>
              ) : null}
              {confirmBtnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModalComponent;
