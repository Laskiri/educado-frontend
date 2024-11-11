import React, { useState, useEffect } from 'react';
import GenericModalComponentUser from './UserGenericModalComponent';
import GenericModalComponent from '../../GenericModalComponent';
/*

This component is used to display the user details modal in the admin dashboard.
It displays the user's name, email, status, motivations, 
academic experiences and professional experiences.
It also allows the admin to approve or reject the user's application.

The Informations are being parsed to the UserGenericModalComponent and GenericModalComponent

*/
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any;
  token: string;
  applicationId: string;
  onHandleStatus: () => void;
  userApplication: any;
  contentCreator: any;
  Loading: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  token,
  applicationId,
  onHandleStatus,
  userApplication,
  contentCreator,
  Loading,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);


  if (!isOpen) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const toggleDropdown3 = () => {
    setIsDropdownOpen3(!isDropdownOpen3);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    onHandleStatus();
  };

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setIsApproveModalOpen(false);
    onHandleStatus();
  };

  return (
    <>
      <GenericModalComponent
        title="Perfil de usuário"
        contentText=""
        confirmBtnText=""
        cancelBtnText=""
        onClose={onClose}
        isVisible={isOpen}
        onConfirm={() => {}}
        isConfirmDisabled={false}
        Loading={Loading}
        width="auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-l-lg mt-4 relative">
            <dt className="text-[#166276] text-base font-bold font-['Lato']">Nome</dt>
            <dd id="name" className="text-base font-['Montserrat'] text-gray-900 break-all">
              {userDetails.firstName} {userDetails.lastName}
            </dd>
          </div>
          <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-r-lg mt-4">
            <dt className="text-[#166276] text-base font-bold font-['Lato']">Email</dt>
            <dd id="email" className="text-base font-['Montserrat'] text-gray-900 break-all">
              {userDetails.email}
            </dd>
          </div>
          <div className="flex flex-col items-center bg-white p-2 md:p-4 rounded-r-lg mt-4">
            <dt className="text-[#166276] text-base font-bold font-['Lato']">Status</dt>
            <dd id="status" className="text-base font-['Montserrat'] text-gray-900 break-all">
              {contentCreator ? (contentCreator.approved ? "Aprovado" : contentCreator.rejected ? "Recusado" : "Aguardando análise") : null}
            </dd>
          </div>
        </div>
        <button
          onClick={toggleDropdown}
          className={`mt-4 bg-[#166276] text-white py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
            isDropdownOpen ? 'rounded-b-none' : ''
          }`}
        >
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="ml-2">Motivações</span>
        </button>
        <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isDropdownOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="p-4 bg-white rounded-b-lg shadow break-all">
            <p className="text-base font-['Montserrat'] text-gray-900">{userApplication?.application?.motivation !== undefined ? userApplication.application.motivation : "No motivation provided"}</p>
          </div>
        </div>
        <button
          onClick={toggleDropdown2}
          className={`mt-4 bg-[#166276] text-white py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
            isDropdownOpen2 ? 'rounded-b-none' : ''
          }`}
        >
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen2 ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="ml-2">Experiências acadêmicas</span>
        </button>
        <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isDropdownOpen2 ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="p-4 bg-white rounded-b-lg shadow break-all">
            <p className="text-base font-['Montserrat'] text-gray-900">
              Academic level: {userApplication?.application?.academicLevel !== undefined ? userApplication.application.academicLevel : "Not provided"}
              <br />
              Academic status: {userApplication?.application?.academicStatus !== undefined ? userApplication.application.academicStatus : "Not provided"}
              <br />
              Major: {userApplication?.application?.major !== undefined ? userApplication.application.major : "Not provided"}
              <br />
              Institution: {userApplication?.application?.institution !== undefined ? userApplication.application.institution : "Not provided"}
              <br />
              Education start date: {userApplication?.application?.educationStartDate !== undefined ? userApplication.application.educationStartDate : "Not provided"}
              <br />
              Education end date: {userApplication?.application?.educationEndDate !== undefined ? userApplication.application.educationEndDate : "Not provided"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleDropdown3}
          className={`mt-4 bg-[#166276] text-white py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
            isDropdownOpen3 ? 'rounded-b-none' : ''
          }`}
        >
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen3 ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="ml-2">Experiências profissionais</span>
        </button>
        <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isDropdownOpen3 ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="p-4 bg-white rounded-b-lg shadow break-all">
            <p className="text-base font-['Montserrat'] text-gray-900">
              Company: {userApplication?.application?.company !== undefined ? userApplication.application.company : "Not provided"}
              <br />
              Position: {userApplication?.application?.position !== undefined ? userApplication.application.position : "Not provided"}
              <br />
              Work activities: {userApplication?.application?.workActivities !== undefined ? userApplication.application.workActivities : "Not provided"}
              <br />
              Work start date: {userApplication?.application?.workStartDate !== undefined ? userApplication.application.workStartDate : "Not provided"}
              <br />
              Work end date: {userApplication?.application?.workEndDate !== undefined ? userApplication.application.workEndDate : "Not provided"}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="text-[#166276] rounded text-base font-base font-['Lato'] underline underline-offset-4">
            Cancelar
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleReject}
              className={`p-3 rounded-lg text-base font-base font-['Lato'] w-32 ${contentCreator?.rejected ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FE4949] hover:bg-[#E44040] text-white'}`}
              disabled={contentCreator?.rejected}
            >
              Recusar
            </button>
            <button
              onClick={handleApprove}
              className={`p-3 rounded-lg text-base font-base font-['Lato'] w-32 ${contentCreator?.approved ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#49A04A] hover:bg-[#418A42] text-white'}`}
              disabled={contentCreator?.approved}
            >
              Aprovar
            </button>
          </div>
        </div>
      </GenericModalComponent>
      <GenericModalComponentUser
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        title="Recusar criador de conteúdo"
        contentText={`Você está recusando o perfil de criador de conteúdo do seguinte usuário: ${userDetails.firstName} ${userDetails.lastName}`}
        confirmBtnText="Recusar"
        onConfirm={handleReject}
        applicationId={applicationId}
        token={token}
        onHandleStatus={onHandleStatus}
        userDetails={userDetails}
        isReject={true}
        Loading={Loading}
      />
      <GenericModalComponentUser
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
        title="Aprovar criador de conteúdo"
        contentText={`Você está aprovando o perfil de criador de conteúdo do seguinte usuário: ${userDetails.firstName} ${userDetails.lastName}`}
        confirmBtnText="Aprovar"
        onConfirm={handleApprove}
        applicationId={applicationId}
        token={token}
        onHandleStatus={onHandleStatus}
        userDetails={userDetails}
        isReject={false}
        Loading={Loading}
      />
    </>
  );
};

export default UserDetailsModal;