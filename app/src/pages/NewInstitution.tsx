import { Link } from "react-router-dom"
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';

// Services
import AuthServices from '../services/auth.services';
import {BACKEND_URL} from '../helpers/environment';


// Components
import Layout from "../components/Layout";
import { PageDescriptor } from "../components/PageDescriptor";


const NewInstitution = () => {
    //Get user id from URL
    const { id } = useParams();
    const navigate = useNavigate();

    //Get data from the relevant route
    const { data, error } = useSWR(
        `${BACKEND_URL}/api/applications/${id}`,
        AuthServices.GetSingleCCApplication
    );
    
    //CHANGE THIS TO THE CORRECT ROUTE: 

    //Function to execute upon accepting an application
    //It will navigate to the applicaitons page, and display a toastify message notifying the user that the content creator was approved
const handleAccept = async () => {
    AuthServices.AcceptApplication(id!)
        .then((res) => { 
             navigate("/educado_admin/applications"); 
              setTimeout(() => {
             toast.success((data?.data.applicator.firstName+" "+data?.data.applicator.lastName+" aprovado"), { hideProgressBar: true, 
                     });
             }, 1);
        })
    .catch(_ => toast.error(`Falha ao Aprovar a Candidatura`));
            
 };  



return (
    <Layout meta="Educado Admin">
            <PageDescriptor
                title="Educado Admin"
                desc="" //
            />
                   {/*Container for the contents of the page*/}
         <div className="inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-10">
            <div className="bg-white shadow overflow-hidden rounded-xl">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">


                   {/*main heading and description text*/}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className=" leading-6 text-3xl font-bold font-['Montserrat'] text-gray-900 mt-4">Add an institution</h3>
                      <p className="mt-6 mb-10 max-w-4xl text-base font-['Montserrat'] text-gray-500">Here you can fill the fields and send an application to add institution.</p>
                  </div>
                </div>
            <div>
                
                
            {/*field to add email domain*/}
            <div className="relative py-4">
            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-base font-normal font-['Montserrat'] mt-6">
              Email Domain
            </label>
            <input
              type="email"
              className="flex w-[100%] border-sky-50 py-3 px-4  placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent bg-sky-50 focus:ring-sky-200 rounded-lg font-['Montserrat']"
              placeholder="placeholder"
              
            />
            
            {/*field to add institution*/}
            <div className="relative gap-10 mt-10">
            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-base font-normal font-['Montserrat'] mt-6">
              Institution
            </label>
            <input
              type="email"
              className="flex border-sky-50 w-[100%] py-3 px-4  placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent bg-sky-50 focus:ring-sky-200 rounded-lg font-['Montserrat']"
              placeholder="placeholder"
            />
            </div>
            
            {/*button to add institution*/}
            <div className="w-[720px] h-[100px] justify-between items-center mt-20">
              <div className="px-4 py-10 sm:flex sm:flex-row-reverse sm:px-4 gap-52">
                <button onClick={handleAccept} type="button" className="sm:w-auto py-3 px-16 flex justify-center items-center font-['Montserrat'] bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded">
                   Add New Institution {/* Approve*/}
                </button>
            
            { /*Button for routing to the educado admin page*/ }
                <Link className="mt-3 inline-flex w-full underline text-red-500 bg-white px-1 py-2 text-lg font-bold font-['Montserrat'] hover:text-red-700 sm:mt-0 sm:w-auto"
                  to="/educado_admin/applications">
                    <button
                    type="button"
                    >Cancelar e Voltar
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>
  )
}

export default NewInstitution;