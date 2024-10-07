import axios from "axios";
import { BACKEND_URL } from "../helpers/environment";

const deleteUser = async (id: string, token: string) => {
    const res = await axios.delete(
        `${BACKEND_URL}/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

const AdminServices = {
    deleteUser
}

export default AdminServices;