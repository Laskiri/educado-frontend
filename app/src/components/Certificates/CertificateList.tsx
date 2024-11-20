import Loading from "../general/Loading";
import { Certificate } from "../../interfaces/Certificate";
import CertificateCard from "./CertificateCard";
import { useEffect, useState } from "react";
import CertificateService from "../../services/certificate.services";
import getCourseDetail from "../../services/course.services";
import EmptyImg from "../../assets/no-courses.png";
import EmptyState from "./CertificateEmpty";

export default function CertificateList() {
  const [certificates, setCertificates] = useState<Certificate[]>();
  const [loading, setLoading] = useState(true); //loading istedet for emptyState? emptyState er fra CertificateEmpty

  useEffect(() => {
    CertificateService.getUserCertificates(localStorage.getItem("id") || "", "") // er der noget galt med det her kald?
      .then((res: Certificate[]) => {
        console.log("Fetched Certificates:", res); // Log the fetched certificates
        setCertificates(res);
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
        setCertificates([]); // Handle errors by setting an empty array
      });
  }, []);

  /*useEffect(() => {
    CertificateService.getUserCertificates(
      localStorage.getItem("id") || ""
    ).then((res: Certificate[]) => {
      setCertificates(res);
    });
  }, []);*/

  if (!certificates) return <EmptyState />; // den tjekker om der er certifikater men vi vil gerne have den tjekker om published kurser

  return (
    <div className="overflow-scroll min-h-full pb-4" id="certificate-list">
      {certificates.length > 0 ? ( //hvordan connecter den til certifikaterne=
        <>
          <div className="w-full">
            <h1 className="text-3xl font-semibold">Certificados</h1>
            <p className="text-grayMedium">
              Você tem {certificates.length} certificados.
            </p>
          </div>
          {certificates.map((certificate: Certificate, key: number) => (
            <CertificateCard certificate={certificate} key={key} num={key} />
          ))}
        </>
      ) : (
        // If the user has no courses, display this 'empty state'
        <div className="grid place-content-center w-full h-full text-center">
          <div className="md:mx-40 xl:mx-64" id="no-certificates-message">
            <img src={EmptyImg} className="w-full" />
            <h1 className="te	xt-xl font-bold my-4">Comece agora</h1>
            {/* It appears you haven't created any courses yet.
					Click the button below to see your course page. */}
            <p>
              Parece que você ainda não criou nenhum curso. Clique no botão
              abaixo para acessar sua página de cursos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
