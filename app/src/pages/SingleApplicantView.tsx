import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';

// Services
import AuthServices from '../services/auth.services';
import {BACKEND_URL} from '../helpers/environment';

// Components
import Loading from './Loading';
import Layout from '../components/Layout';
import { PageDescriptor } from '../components/PageDescriptor';

function SingleApplicantView() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch Application Details
    const { data, error } = useSWR(
        `${BACKEND_URL}/api/applications/${id}`,
        AuthServices.GetSingleCCApplication
    );
    
    
    const handleAccept = async () => {
        AuthServices.AcceptApplication(id!)
            .then((res) => { 
                navigate("/educado_admin/applications"); 
            })
            .catch(_ => toast.error(`Failed to Approve Application`));
    }

    
    const handleReject = () => {
        AuthServices.RejectApplication(id!)
            .then(_ => {
                navigate("/educado_admin/applications");
            })
            .catch(_ => toast.error(`Failed to Reject Application`));
    }

   
    if (!data) return <Loading />
    if (data?.data.application == null){
     //navigate back to admin page
    }
    return (
        <Layout meta={`Applicant: ${id?.slice(0, 10)}...`}>
            <div className="grid place-items-center h-screen pt-20">
                <div className="bg-white shadow overflow-hidden rounded-xl">
                    <div className=" px-4 py-8 sm:px-10">
                        <h3 className=" leading-6 text-2xl font-bold font-['Montserrat'] text-gray-900 ">
                        Candidato: <span className="text-blue-500">mail@mail.com</span> {/** applicant*/}
                        </h3>
                        <p className="mt-3 max-w-3xl text-base font-['Montserrat'] text-gray-500">
                        Detalhes e informações sobre o candidato. {/**  Details and informations about the applicant*/}
                        </p>
                    </div>

                    <div className="border-t mx-10 pb-1 pt-1 bg-grayLight">
                        <dl>
                            <div className="bg-[#F1F9FB] px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat']  text-gray-900">
                                    Nome: {/** Name*/}
                                </dt>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 ">
                                    FirstName LastName
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat']  text-gray-900">
                                    E-mail: 
                                </dt>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
                                    mail@mail.com
                                </dd>
                            </div>
                            <div className="bg-[#F1F9FB] px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat'] text-gray-900">
                                Enviado em: {/** Applied at*/}
                                </dt>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2">
                                    <>date</> {/** FIXME: Date object is not a valid child of HTML element */}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-3 sm:grid grid-cols-3 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat'] text-gray-900">
                                Motivação: {/** motivation*/}
                                </dt>
                            <div className=''>
                                <dd className="mt-1 whitespace-normal text-base font-['Montserrat'] text-gray-900 sm:mt-0 sm:col-span-2 text-ellipsis">
                                    <>long long motivation</> 
                                </dd>
                            </div>   
                            </div>
                            <div className="bg-[#F1F9FB] px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat'] text-gray-900">
                                Experiência Acadêmica: {/** Academic Experience*/}
                                </dt>
                                <div className=''></div>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0 ">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                
                            </div>
                            <div className="bg-white px-4 py-3 grid sm:grid-cols-2 sm:gap-4 sm:px-6 space-x-8">
                                <dt className="text-base font-bold font-['Montserrat']  text-gray-900">
                                Experiência profissional: {/** Professional Experience*/}
                                </dt>
                                <dd className="">
                                    <> </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>
                                <dd className="mt-1 text-base font-['Montserrat'] text-gray-900 sm:mt-0">
                                    <>A lot of fields </> 
                                </dd>

                            </div>
                        </dl>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">   
                        <button onClick={handleAccept} type="button" className=" py-3 px-4 flex justify-center items-center font-['Montserrat'] bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                        Aprovar {/** Approve*/}
                        </button>
                        <button onClick={handleReject} type="button" className="py-3 px-4 flex justify-center items-center font-['Montserrat']  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded ">
                        Declínio {/** Decline */}
                        </button>
                    </div> 
                </div> 
            </div>
        </Layout>
    );
}

export default SingleApplicantView;



