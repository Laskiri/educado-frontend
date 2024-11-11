import React, { useState } from 'react';
import AuthServices from '../../../services/auth.services';
import AdminServices from '../../../services/admin.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericModalComponent from '../../GenericModalComponent';

interface GenericModalComponentUserProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentText: string;
  confirmBtnText: string;
  onConfirm: () => void;
  applicationId: string;
  token: string;
  onHandleStatus: () => void;
  userDetails: any;
  isReject: boolean;
}

const GenericModalComponentUser: React.FC<GenericModalComponentUserProps> = ({
  isOpen,
  onClose,
  title,
  contentText,
  confirmBtnText,
  onConfirm,
  applicationId,
  token,
  onHandleStatus,
  userDetails,
  isReject,
}) => {
  const [justification, setJustification] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);
  const [Loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (isReject && !justification.trim()) {
      setIsInputValid(false);
      return;
    }

    setLoading(true);

    try {
      if (isReject) {
        await AuthServices.RejectApplication(applicationId, justification);
        toast.success("Application rejected!");
      } else {
        await AuthServices.AcceptApplication(applicationId);
        await AdminServices.changeUserRole(applicationId, token, 'creator');
        toast.success("Application approved!");
      }
      onClose();
      onHandleStatus();
    } catch (error) {
      console.error("Failed to process application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModalComponent
      title={title}
      contentText={contentText}
      confirmBtnText={confirmBtnText}
      cancelBtnText="Voltar"
      onClose={onClose}
      isVisible={isOpen}
      onConfirm={handleAction}
      isConfirmDisabled={isReject && !isInputValid || Loading}
      Loading={Loading}
      className={isReject ? "adaptive-modal" : ""}
      width={"800px"} // Add this line to define the width
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col bg-white p-4 md:p-6 rounded-l-lg mt-4 relative">
          <dt className="text-[#166276] text-base font-bold font-['Lato']">Nome</dt>
          <dd id="name" className="text-base font-['Montserrat'] text-gray-900 break-all">
            {userDetails.firstName} {userDetails.lastName}
          </dd>
          <style>{`
            .relative::after {
              content: '';
              position: absolute;
              right: 0;
              top: 20%;
              height: 60%;
              width: 1px;
              background-color: #E7F3F6;
            }
          `}</style>
        </div>
        <div className="flex flex-col bg-white p-4 md:p-6 rounded-r-lg mt-4">
          <dt className="text-[#166276] text-base font-bold font-['Lato']">Email</dt>
          <dd id="email" className="text-base font-['Montserrat'] text-gray-900 break-all">
            {userDetails.email}
          </dd>
        </div>
      </div>
      {isReject && (
        <>
          <p className="mt-4">Justificativa</p>
          <input
            type="text"
            className={`mt-2 p-2 pl-4 rounded-lg w-full border ${isInputValid ? 'border-transparent' : 'border-red-500'}`}
            placeholder="Justificativa da análise"
            value={justification}
            onChange={(e) => {
              setJustification(e.target.value);
              setIsInputValid(true);
            }}
          />
          {!isInputValid && <p className="text-red-500 text-sm mt-1">Justificativa é obrigatória.</p>}
        </>
      )}
      <p className="mt-4">Essa ação não pode ser desfeita.</p>
    </GenericModalComponent>
  );
};

export default GenericModalComponentUser;
