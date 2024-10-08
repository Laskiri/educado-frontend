import React from 'react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any; // Replace with the appropriate type
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, userDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="bg-secondary px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dt className="text-base font-bold font-['Montserrat'] text-gray-900">Nome:</dt>
          <dd id="name" className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
            {userDetails.firstName} {userDetails.lastName}
          </dd>
        </div>
        <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dt className="text-base font-bold font-['Montserrat'] text-gray-900">E-mail:</dt>
          <dd id="email" className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
            {userDetails.email}
          </dd>
        </div>
        <div className="bg-secondary px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dd className="text-base font-bold font-['Montserrat'] text-gray-900">Enviado em:</dd>
          <dd id="date" className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
            {new Date(userDetails.joinedAt).toString()}
          </dd>
        </div>
        <div className="bg-white px-4 py-3 sm:grid grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
          <dt className="text-base font-bold font-['Montserrat'] text-gray-900">Motivação:</dt>
          <dd id="motivation" className="mt-1 whitespace-normal text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2 text-ellipsis">
            {userDetails.motivation}
          </dd>
        </div>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default UserDetailsModal;