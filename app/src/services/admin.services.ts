import axios from "axios";
import { BACKEND_URL } from "../helpers/environment";

const deleteUser = async (id: string, token: string) => {
    const res = await axios.delete(
        `${BACKEND_URL}/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

const getUserDetails = async (id: string, token: string) => {
    const res = await axios.get(
        `${BACKEND_URL}/api/users/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

const changeUserRole = async (id: string, token: string, newRole: string) => {
    const res = await axios.patch(
        `${BACKEND_URL}/api/users/${id}/role`,
        { newRole },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

const AdminServices = {
    deleteUser,
    getUserDetails,
    changeUserRole,
}

export default AdminServices;