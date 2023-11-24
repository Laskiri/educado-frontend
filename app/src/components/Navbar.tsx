import {Icon} from '@mdi/react';
import { mdiBellOutline, mdiAccount, mdiLogoutVariant, mdiCertificate, mdiNotebookOutline, mdiAccountCog } from '@mdi/js';
import { Link } from 'react-router-dom'
import useAuthStore from '../contexts/useAuthStore'
import { getUserToken } from '../helpers/userInfo';

import decode from 'jwt-decode';

// icons
const Navbar = () => {

    //logout handler
    const clearToken = useAuthStore(state => state.clearToken);
    const logout = () => {
        clearToken();
        localStorage.removeItem("token");
    }

    // List to generete dropdown li's 
    const links = [
        { path: "/profile", desc: "Settings" },
				{ path: "/certificates", desc: "Certificates", id: "certificates-button" },
    ]

    return (
        <main className="relative bg-gradient-to-br from-[#c8e5ec] to-[white] overflow-hidden">
            {/* Navigation Bar */}
            <nav className="flex fixed w-full items-center justify-between py-3 px-6"
                style={{
                    background: 'var(--secondary, #F1F9FB)',
                    boxShadow: '0px 4px 4px 0px rgba(35, 100, 130, 0.25)'
                }}>

                {/* Logos for navbar */}
                <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-8">
                    <div className="navbar-start">
                        <Link to="/" className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl">
                            <img src='/logo.svg' alt="logo" className="w-[24.43px] h-6" /> <img src='/educado.svg' alt="educado" className="h-6" />
                        </Link>
                    </div>
                </div>

                <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0">
                    <li>
                        <Link to={"/courses"} className="flex tooltip tooltip-hover tooltip-bottom text-lg font-['Montserrat'] active:bg-[#166276]" data-tip="Veja seus cursos"> {/* see your courses */}
                        <Icon path={mdiNotebookOutline} size={1} color="#A1ACB2" /> <span>Cursos</span> {/*courses*/}
                        </Link>
                    </li>
                    <li>
                        <Link to={"/educado_admin/applications"} className="flex tooltip tooltip-hover text-lg tooltip-bottom font-['Montserrat'] active:bg-[#166276]" data-tip="Verifique os aplicativos"> {/* Check Applications */}
                        <Icon path={mdiAccount} size={1} color="#A1ACB2" /><span>Admin</span> {/*admin*/}
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <button className="relative ml-auto text-sm focus:outline-none group" id='profile-dropdown'>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost hover:bg-transparent">
                            <div className="flex items-center justify-between w-10 h-10 rounded">
                                <div className="block relative">
                                    <div className="avatar placeholder">
                                        <div className="bg-blue-500 text-white rounded-full hover:rounded w-10">
                                            <span className="text-md">
                                                JD
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            {links.map((route, key) => <li key={key}><Link id={route.id ?? ''} to={route.path}>{route.desc}</Link></li>)}
                            <li>
                                <Link to={"/login"} onClick={logout} className="w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white">Sign out</Link>
                            </li>
                        </ul>
                    </div>
                </button>
            </div>
        </div>
    )
}
