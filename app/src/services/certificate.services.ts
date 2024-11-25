import axios from "axios";

// Backend URL from enviroment
import { CERT_URL } from "../helpers/environment";
import { getUserToken } from "../helpers/userInfo";
import { CertificateIds } from "../interfaces/Certificate";
import { Course } from "../interfaces/Course";
import { BACKEND_URL } from "../helpers/environment";

// Interface for posting course content
export interface CourseInterface {
  creatorId: string;
  courseId: string;
}

const createCertificate = async (data: Course, token: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8888/api/certificate/get-creator-certificates/672b727ad51069fc04ceb8eb&672b79607ba5d51e8494d602", //TODO ændre url efter det virker
    headers: {},
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  /*return await axios.put(
    `${BACKEND_URL}/api/creator-certificates`,
    {
      creator: data.creator,
      title: data.title,
      category: data.category,
      rating: data.rating,
      numOfSubscriptions: data.numOfSubscriptions,
      dateCreated: data.dateCreated,
      dateUpdated: data.dateUpdated,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        token: localStorage.getItem("token") || "",
      },
    }
  );*/
};

/**
 * @param url
 * @returns
 */
const getUserCertificates = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8888/api/certificate/get-all-creator-certificates/672b727ad51069fc04ceb8eb", //TODO ændre url efter det virker
    headers: {},
  };

  const res = await axios.get(config.url);
    // .request(config)
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    //   return response;
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

  // const res = await axios.get(url, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  console.log('..................................................... ', res.data);

  return res.data;
};

// Export all methods
const CourseServices = Object.freeze({
  createCertificate,
  getUserCertificates,
});

export default CourseServices;

/*const client = axios.create({
  baseURL: CERT_URL,
  headers: {
    "Content-Type": "application/json",
    token: getUserToken(),
  },
});*/

/*const createCertificate = async (certificate: CertificateIds) => {
  return await client.put(
    `/api/creator-certificates`,
    {
      creatorId: certificate.creatorId,
      courseId: certificate.courseId,
    },
    {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
        token: getUserToken(),
      },
    }
  );
};*/

/*const getUserCertificates = async (id: string) => {
  const certificates = await client.get("/api/creator-certificates" + id, {
    headers: {
      token: getUserToken(),
    },
  });

  return certificates.data;
};*/
