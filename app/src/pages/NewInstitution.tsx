import { Link } from "react-router-dom"
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from 'react-toastify';
import useSWR from 'swr';

// Services
import AuthServices from '../services/auth.services';
import {BACKEND_URL} from '../helpers/environment';


// Components
import Layout from "../components/Layout";
import { PageDescriptor } from "../components/PageDescriptor";
import { error } from "cypress/types/jquery";

// Interface
export type NewInstitution = {
  institutionName: string,
  domain: string,
  secondaryDomain: string,
};

const NewInstitution = () => {
  //Get user id from URL
  const { id } = useParams();
  const navigate = useNavigate();



  // Use-form setup
  const { register, handleSubmit, formState: { errors } } = useForm<NewInstitution>();


    

  //Function to execute upon accepting an application
  //It will navigate to the applicaitons page, and display a toastify message notifying the user that the content creator was approved
  const onSubmit: SubmitHandler<NewInstitution> = async (data) => {
      AuthServices.addInstitution({
        domain: data.domain, 
        institutionName: data.institutionName, 
        secondaryDomain: data.secondaryDomain
      })
      .then((res) => { console.log(res)
            navigate("/educado_admin/applications"); 
              setTimeout(() => {
            toast.success("Adicionado "+res.data.institution.institutionName+" como nova instituição", { hideProgressBar: true, 
            }); //CHANGE TO PORTUGUESE
            }, 1);
      })
      .catch((res) => { console.log(res)
        //If an error occurs, display the appropriate message, along with the value that causes the error
        const errorCause = res.response.data.errorCause;

        switch(res.response.data.error.code){
          case "E1201" : 
            toast.error("Não foi possível carregar a Instituição",{ hideProgressBar: true }); break;
          case "E1202" : 
            toast.error(errorCause+" já é uma instituição registrada",{ hideProgressBar: true }); break;
          case "E1203" : 
            toast.error(errorCause+" já está registrado em outra instituição",{ hideProgressBar: true }); break;
          case "E1204" : 
            toast.error(errorCause+" já está registrado em outra instituição",{ hideProgressBar: true }); break;
        }
    });
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
              <div className="bg-white px-6 pb-4 pt-4 sm:pb-2">
                <div className="sm:flex sm:items-start">


                   {/*main heading and description text*/}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className=" leading-6 text-3xl font-bold font-['Montserrat'] text-gray-900 mt-4">Integração Institucional</h3> {/* Institutional Integration */}
                      <p className="mt-6 max-w-4xl text-base font-['Montserrat'] text-gray-500">Aqui você pode adicionar instituições ao Educado.</p> {/* Here you can add institutions to Educado. */}
                  </div>
                </div>
            <div>
           
            <form onSubmit={handleSubmit(onSubmit)} className="relative py-2">
                          
            {/*field to add institution*/}
            <div className="relative gap-10 mt-8">
            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-base font-normal font-['Montserrat'] mt-6">
            Instituição
            </label>
            <input
              type="text"
              className="flex border-sky-50 w-[100%] py-3 px-4  placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent bg-sky-50 focus:ring-sky-200 rounded-lg font-['Montserrat']"
              placeholder="Empresa"
              {...register("institutionName", { required: true })}
            />
            </div>

             {/*field to add email domain*/}
            <div className="relative gap-10 mt-10">
            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 text-[#383838] text-base font-normal font-['Montserrat'] mt-6">
              Domínio de e-mail {/* Email Domain */}
            </label>
            <input
              type="text"
              className="flex w-[100%] border-sky-50 py-3 px-4  placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent bg-sky-50 focus:ring-sky-200 rounded-lg font-['Montserrat']"
              placeholder="@Empresa.com"
              {...register("domain", { required: true })}
              
            /></div>

            {/*field to add institution*/}
            <div className="relative gap-10 mt-10">
            <label className=" after:ml-0.5 after:text-red-500 text-[#383838] text-base font-normal font-['Montserrat'] mt-6">
              Domínio de e-mail secundário {/* Secondary Email Domain */}
            </label>
            <input
              type="text"
              className="flex border-sky-50 w-[100%] py-3 px-4  placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent bg-sky-50 focus:ring-sky-200 rounded-lg font-['Montserrat']"
              placeholder="@Empresa.secundário.com"
              {...register("secondaryDomain", { required: false })}
            />
            </div>
            
            {/*button to add institution*/}
            <div className="w-[720px] h-[100px] justify-between items-center mt-6 inline-flex sm:w-auto">
              <div className="px-4 py-10 sm:flex sm:flex-row-reverse sm:px-4 gap-52 relative">
                <button type="submit" className="sm:w-auto py-3 px-6 w-full justify-center items-center font-['Montserrat'] bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded">
                Adicionar nova instituição {/* Add new institution*/}
                </button>
            
            { /*Button for going back to the educado admin page*/ }
                <Link className="mt-3 inline-flex w-full underline text-red-500 bg-white px-1 py-2 text-lg font-bold font-['Montserrat'] hover:text-red-700 sm:mt-0 sm:w-auto"
                  to="/educado_admin/applications">
                    <button
                    type="button"
                    >Cancelar e Voltar
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>
  )
}

export default NewInstitution;