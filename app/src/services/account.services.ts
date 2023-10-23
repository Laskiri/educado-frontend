import axios from "axios";

import { BACKEND_URL } from "../helpers/environment";

export async function deleteAccount() {
    const creatorId = localStorage.getItem("id");

    return await axios.delete(
        `${BACKEND_URL}/profile/delete/${creatorId}`
    ).then(response => {
        console.log("Creator deleted successfully: " + response.data)
    })
        .catch(error => {
            console.log("Error deleting cretor: " + error.message)
        })
}

const getPublicProfileInfo = (profileId: string, token: string | null | undefined) => {
    return axios.get(
        `${BACKEND_URL}/api/public/profiles/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const getProfileInfo = (token: string | null | undefined) => {
    return axios.get(
        `${BACKEND_URL}/api/profile/whoami`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const updateProfileInfo = (data: any, token: string | null | undefined) => {
    return axios.put(
        `${BACKEND_URL}/api/profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}

const changePassword = (data: any, token: string) => {
    return axios.put(
        `${BACKEND_URL}/api/profile/changePassword`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => res.data);
}


const AccountServices = {
    getPublicProfileInfo,
    getProfileInfo,
    updateProfileInfo,
    changePassword
};


export default AccountServices;
