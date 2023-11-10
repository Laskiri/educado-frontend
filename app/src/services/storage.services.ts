import axios from "axios";

// Backend URL from .env file (automatically injected) 
import { BACKEND_URL } from "../helpers/environment";


//import { Storage } from '@google-cloud/storage';


export interface StorageInterface {
    uploadFile: (bucketName: string, filePath: any, id: string) => void;
    downloadFile: (bucketName: string, id: string, filePath: any) => void; 
}

// Props interface for uploadFile function
type FileProps = {
    filePath: any,
    id: string,
}
/**n
 * Uploads a file to a bucket
 * @param {string} filePath - The local path to the file to upload 
 * @param {string} id - The id the file will be saved as in the bucket. Format: courseId/sectionsId/componentId/index or courseId/index
 * @returns {void}	
 */
async function uploadFile({filePath, id}: FileProps) {
    axios.postForm(`${BACKEND_URL}/api/bucket/upload`, {
        fileName: id,
        file: filePath
    })
}

const getFile = async (url: string, token: string) => {
    return await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data);
  };

const deleteFile = async (id: string, token: string) => {
return await axios.delete(`${BACKEND_URL}/api/bucket/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

const StorageServices = Object.freeze({
    uploadFile,
    getFile,
    deleteFile
});

export default StorageServices;