// DataDeletionRequest.tsx

import React from 'react';

const DataDeletionRequest: React.FC = () => {
  return (
    <>
      <h2>Data Deletion Request</h2>
      <p>
        If you wish to delete your data associated with your account on Educado, please contact us at{' '}
        <a href="mailto:app.educado@gmail.com">app.educado@gmail.com</a>.
      </p>
      <p>
        To ensure a prompt response to your request, kindly provide us with the following details:
      </p>
      <ul>
        <li>
          <strong>Steps to Request Deletion:</strong> You can delete your account and all data related to your account
          on the Educado App. Simply navigate to your profile page within the app and click on the “delete account”
          button. If you encounter difficulties accessing the app, please send an email to{' '}
          <a href="mailto:educado@gmail.com">educado@gmail.com</a> specifying your request for data deletion, and we will
          help you.
        </li>
        <li>
          <strong>Types of Data Deleted:</strong> Upon deletion, all personal identifiable information such as your
          email, name, and password will be permanently removed from our systems. Additionally, information related to
          your course subscriptions, including your progress, will be deleted.
        </li>
        <li>
          <strong>Retention Period:</strong> We commit to immediate deletion of personal identifiable information and
          course completion data upon your request.
        </li>
      </ul>
      <p>
        We take user privacy seriously and aim to process all data deletion requests efficiently. For any further
        inquiries or assistance, please don't hesitate to contact us via <a href="mailto:app.educado@gmail.com">app.educado@gmail.com</a>.
      </p>
    </>
  );
};

export default DataDeletionRequest;
