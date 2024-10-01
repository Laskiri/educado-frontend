import React from 'react';
import './PopupComponent.css';

interface PopupComponentProps {
    title?: string;
    contentText?: string;
    confirmBtnText?: string;
    onClose: () => void;
    isVisible?: boolean;
    onConfirm: () => Promise<void>;
    customStyles?: {
        overlay?: React.CSSProperties,
        title?: React.CSSProperties,
        closeButton?: React.CSSProperties,
        content?: React.CSSProperties,
        confirmButton?: React.CSSProperties,
        body?: React.CSSProperties
    };
}

/**
 * Renders a popup dialog with a title, content text and action buttons.
 * Used to display important confirmation prompts to the user.
 *
 * @returns HTML Element
 */
const PopupComponent: React.FC<PopupComponentProps> = ({
   title = "Default Title",
   contentText = "This is the default content.",
   confirmBtnText = "Confirm",
   onClose,
   isVisible = false,
   onConfirm,
   customStyles = {}
}) => {
    if (!isVisible) return null;

    return (
        <div className="popup-overlay" style={customStyles.overlay}>
            <div className="popup-content" style={customStyles.content}>

                {/* Title */}
                <div className="popup-title" style={customStyles.title}>
                    <h2>{title}</h2>

                    {/* Window close button (x) */}
                    <button onClick={onClose} className="close-button" style={customStyles.closeButton}>
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="popup-body" style={customStyles.body}>
                    {contentText}
                </div>

                {/* Buttons */}
                <div className="popup-actions">
                    {/* Cancel */}
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    {/* Confirmation */}
                    <button
                        type="submit"
                        className="confirm-button bg-primary"
                        onClick={onConfirm}
                    >
                        {confirmBtnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupComponent;