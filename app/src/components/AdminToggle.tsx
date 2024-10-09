import React, { useState } from 'react';
import AdminServices from '../services/admin.services';
import UserDetailsModal from '../components/UserDetailsModal';
import { getUserToken } from '../helpers/userInfo';

function AdminToggleButton() {
    return(
            <div className="toggle-switch text-gray-900 whitespace-no-wrap ml-7" id="admin">
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="hidden peer"/>
                    <div className="relative w-10 h-3.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3.5px] after:start-[2px] after:bg-gray-400 peer-checked:after:bg-cyan-800  after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-toggleChecked"></div>
                </label>
            </div> 
    )
}

export default AdminToggleButton;

