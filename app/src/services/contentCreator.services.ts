import axios from "axios";
import { BACKEND_URL } from "../helpers/environment";

export const getAverageRatingOfCC = async (userid: string, period?: string): Promise<number> => {
    try {
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BACKEND_URL}/api/rating/getOverallRatingOfCC/?userid=${userid}${period ? `&period=${period}` : ''}`,
            headers: {}
        };
        console.log(config.url);
        const response = await axios.request(config);
        console.log("HERE" + JSON.stringify(response.data.averageRating));
        return response.data.averageRating;
    } catch (error) {
        console.log(error);
        return 0;
    }
};

export const getTotalGrantedCertificates = async (userid: string): Promise<number> => {
    try {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${BACKEND_URL}/api/certificates/getTotalGrantedCertificates/${userid}`,
        };

        const response = await axios.request(config);
        console.log("AXIOS Fetch " + response.data.totalCertificates);
        return response.data.totalCertificates;
    } catch (error) {
        console.log(error);
        return 0;
    }
}