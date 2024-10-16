import { useEffect, useState } from "react";
import useSWR from "swr";
import { Link, useLocation } from 'react-router-dom';
import Loading from "../components/general/Loading";
import Layout from "../components/Layout";
import DeleteUserButton from "../components/DeleteUserButton";
import ViewUserButton from "./ViewUserButton";
import AdminToggleButton from "../components/AdminToggle";
import AdminServices from "../services/admin.services";

const EducadoAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedButton, setSelectedButton] = useState('users');

    const location = useLocation();
    const { data, mutate } = useSWR('api/user-info', AdminServices.getUserApplications);

    if (!data) return <Loading/>

    // Function to refresh the list after deletion or rejecting or approving an application
    const refreshUsers = () => {
        mutate();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        let formattedDate = date.toLocaleString('pt-BR', options).replace(' às', '');
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        return formattedDate;
    };

    const getStatusColor = (application: any) => {
        if (application.approved) return "green";
        if (application.rejected) return "red";
        return "black"; // Default color for "Aguardando análise"
    };

    return (
        <Layout meta="Educado Admin">
            <div className="w-full flex flex-row space-x-2 px-12 py-10">
                <div className="inline-block min-w-full shadow overflow-hidden rounded-xl bg-white">
                    <div className='flex flex-row no-wrap'>
                    </div>

                    <div className="navbar justify-end md:w-full bg-none p-6 mt-4">
                        <div className="flex-none flex w-full">
                            <Link
                                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${selectedButton === 'users' ? 'bg-[#166276] text-white' : 'bg-white text-[#166276]'} font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                                to="/educado-admin/new-user"
                                onClick={() => setSelectedButton('users')}
                            >
                                <button type="submit">Users</button>
                            </Link>
                            <Link
                                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${selectedButton === 'institutions' ? 'bg-[#166276] text-white' : 'bg-white text-[#166276]'} font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                                to="/educado-admin/new-institution"
                                onClick={() => setSelectedButton('institutions')}
                            >
                                <button type="submit">Institutions</button>
                            </Link>
                        </div>
                    </div>

                    <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-full md:space-x-4 space-y-3 md:space-y-0 justify-end p-6 -mt-4">
                        <select className="block bg-white min-w-[175px] flex-grow-0 border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm">
                            <option value="option1">Mais recentes</option>
                            {/* 
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option> 
                            */}
                        </select>
                        <div className="relative min-w-[225px] flex-grow-0">
                            <input
                                className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
                                type="text"
                                id="search-term"
                                placeholder="Buscar usuário"
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </form>

                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-white border-b-4 border-[#166276] text-[#166276] text-left text-base font-base font-['Lato']]">
                            <th scope="col" className="p-7" style={{ width: '10%' }}>Admin</th>
                            <th scope="col" className="p-5" style={{ width: '20%' }}>Nome</th>
                            <th scope="col" className="p-5" style={{ width: '25%' }}>Email</th>
                            <th scope="col" className="p-5" style={{ width: '20%' }}>Status</th>
                            <th scope="col" className="p-5" style={{ width: '30%' }}>Enviado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data.data.filter((application: any) => {
                                if (searchTerm === "") return application;
                                if (application.firstName.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                                if (application.lastName.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                                if (application.email.toLowerCase().includes(searchTerm.toLowerCase())) return application;
                            }).map((application: any, key: number) => {
                                return (
                                    <tr key={key} className="px-5 py-5 border-b border-gray-200 bg-white text-base font-['Montserrat']">
                                        <td>
                                            <AdminToggleButton applicationId={application._id} applicationApproved={application.approved}/>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap" id="name" style={{ wordBreak: 'break-word'}}>
                                                        {application.firstName} {application.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ wordBreak: 'break-word' }}>
                                            <p className="text-gray-900 whitespace-no-wrap" id="email">
                                                {application.email}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-gray-900 whitespace-no-wrap" id="status" style={{ color: getStatusColor(application) }}>
                                                {application.approved ? "Aprovado" : application.rejected ? "Recusado" : "Aguardando análise"}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-gray-900" id="date">
                                                {formatDate(application.joinedAt)}
                                            </p>
                                        </td>
                                        <td>
                                            <div className="flex items-center p-4">
                                                {application.approved || application.rejected ? (
                                                <>
                                                    <ViewUserButton applicationId={application._id} onHandleStatus={refreshUsers} />
                                                    <div className="mx-2.5"></div>
                                                    <DeleteUserButton applicationId={application._id} onDelete={refreshUsers} />
                                                    <div className="-ml-2"></div>                                                 
                                                </>
                                                ) : (
                                                <div className="ml-auto mr-4">
                                                    <ViewUserButton applicationId={application._id} onHandleStatus={refreshUsers} />
                                                </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                        <div className="flex items-center">
                            <button type="button" className="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100">
                                <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                                </svg>
                            </button>
                            <button type="button" className="w-full px-4 py-2 border-t border-b text-base text-indigo-500 bg-white hover:bg-gray-100">1</button>
                            <button type="button" className="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">2</button>
                            <button type="button" className="w-full px-4 py-2 border-t border-b text-base text-gray-600 bg-white hover:bg-gray-100">3</button>
                            <button type="button" className="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100">4</button>
                            <button type="button" className="w-full p-4 border-t border-b border-r text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100">
                                <svg width="9" fill="currentColor" height="8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19 19-19 45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default EducadoAdmin;