import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { institutionService } from "../../services/Institution.services";
import Loading from "../general/Loading";
import {
  GoArrowLeft,
  GoArrowRight,
  GoChevronLeft,
  GoChevronRight,
} from "react-icons/go";
import { MdDelete, MdCreate, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import GenericModalComponent from "../GenericModalComponent";
import { getUserToken } from "../../helpers/userInfo";
import { toast } from "react-toastify";
import { IconContext } from "react-icons/lib";
import { useNotifications } from "../notification/NotificationContext";
import { Institution } from "../../interfaces/Institution";

export const InstitutionsTableAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { addNotification } = useNotifications();

  const userToken = getUserToken();
  const { data: institutionsResponse, mutate } = useSWR(
    "api/institutions",
    () => institutionService.getInstitutions(userToken)
  );

  if (!institutionsResponse?.data) return <Loading />;

  const filteredData = institutionsResponse.data.filter((institution) => {
    if (searchTerm === "") return institution;
    if (
      institution.institutionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
      return institution;
    if (institution.domain.toLowerCase().includes(searchTerm.toLowerCase()))
      return institution;
    if (
      institution.secondaryDomain
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
      return institution;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const columnNames = [
    { name: "Instituições", width: "basis-1/4" },
    { name: "Domínio", width: "basis-1/4" },
    { name: "Domínio secundário", width: "basis-1/4" },
  ];

  const UpdateButton = ({ institution }: { institution: Institution }) => {
    const [showModal, setShowModal] = useState(false);

    const [nameInput, setNameInput] = useState(institution.institutionName);
    const [domainInput, setDomainInput] = useState(institution.domain);
    const [secondaryDomainInput, setSecondaryDomainInput] = useState(
      institution.secondaryDomain
    );

    useEffect(() => {
      setNameInput(institution.institutionName);
      setDomainInput(institution.domain);
      setSecondaryDomainInput(institution.secondaryDomain);
    }, [showModal]);

    const handleSumbit = async (e: ChangeEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        e.target.reportValidity();
        if (!e.target.checkValidity()) e.target.reportValidity();
        else {
          await institutionService.updateInstitution(
            institution._id!,
            getUserToken(),
            {
              institutionName: nameInput,
              domain: domainInput,
              secondaryDomain: secondaryDomainInput,
            }
          );

          mutate();
          setShowModal(false);
          addNotification("Instituição atualizada com sucesso !");
        }
      } catch (err) {
        toast.error(String(err));
        console.error(err);
      }
    };

    const handleClose = () => {
      setNameInput("");
      setDomainInput("");
      setSecondaryDomainInput("");

      setShowModal(false);
    };

    return (
      <>
        <button
          className="btn btn-circle bg-[#166276] border-[#166276]"
          onClick={() => setShowModal(true)}
        >
          <MdCreate />
        </button>

        {showModal && (
          <GenericModalComponent
            onConfirm={() => null}
            onClose={handleClose}
            isVisible={showModal}
            title="Update Instituições"
            contentText=""
            children={
              <form
                className="form-control flex flex-col space-y-4"
                onSubmit={handleSumbit}
              >
                <div className="flex flex-col space-y-2">
                  <label>
                    <span>Nome da Instituição</span>
                  </label>
                  <input
                    type="text"
                    name="institution-name"
                    required
                    placeholder="Instituição"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="input"
                  />

                  <label>
                    <span>Domínio</span>
                  </label>
                  <input
                    type="text"
                    name="domain"
                    required
                    pattern="@([\w\-]+\.)+[\w\-]{2,4}"
                    title="@domain.com"
                    placeholder="@domain.com"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="input"
                  />

                  <label>
                    <span>Segundo Domínio</span>
                  </label>
                  <input
                    type="text"
                    name="secondary-domain"
                    placeholder="@domain.com (opcional)"
                    title="@domain.com"
                    pattern="@([\w\-]+\.)+[\w\-]{2,4}$"
                    value={secondaryDomainInput}
                    onChange={(e) => setSecondaryDomainInput(e.target.value)}
                    className="input"
                  />
                </div>

                <input
                  type="submit"
                  value="submit"
                  className="btn bg-[#166276] border-[#166276]"
                />
              </form>
            }
          />
        )}
      </>
    );
  };

  const DeleteButton = ({ institutionId }: { institutionId: string }) => {
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = async () => {
      try {
        await institutionService.deleteInstitution(
          institutionId,
          getUserToken()
        );
        mutate();
        addNotification("Instituição deletada com sucesso !");
      } catch (err) {
        toast.error(err as string);
        console.error(err);
      }
    };

    return (
      <>
        <button
          className="btn btn-circle bg-[#166276] border-[#166276]"
          onClick={() => setShowModal(true)}
        >
          <MdDelete />
        </button>
        {showModal && (
          <GenericModalComponent
            onConfirm={handleConfirm}
            onClose={() => setShowModal(false)}
            isVisible={showModal}
            confirmBtnText="Deletar"
            title="Deletando usuário"
            contentText="Você tem certeza de que deseja excluir este Instituições?"
          />
        )}
      </>
    );
  };

  return (
    <div className="container flex flex-col overflow-hidden gap-6">
      <form className="flex justify-end space-x-2">
        <select className="select select-bordered">
          <option value="most-recent">Mais recentes</option>
        </select>
        <div className="flex flex-row">
          <input
            className="input input-bordered"
            type="text"
            placeholder="Buscar usuário"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <div className="flex flex-col justify-center">
            <MdSearch className="-ml-6" />
          </div>
        </div>
        <Link to={"/educado-admin/new-institution"}>
          <button className="btn text-base bg-[#166276]">Adicionar</button>
        </Link>
      </form>

      <table className="table w-full">
        <thead>
          <tr className="border-b-4 border-[#166276] text-[#166276]">
            {columnNames.map((columnName, key) => (
              <th
                scope="col"
                className={`text-sm bg-transparent ${columnName.width}`}
                key={`${columnName.name}-${key}`}
              >
                {columnName.name}
              </th>
            ))}
            {/* ACTION BUTTONS */}
            <th scope="col" className="bg-transparent basis-1/6" />
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((institution, key: number) => {
            return (
              <tr key={key} className="border-b-2">
                <td>
                  <p>{institution.institutionName}</p>
                </td>
                <td>
                  <p>{institution.domain}</p>
                </td>
                <td>
                  <p>{institution.secondaryDomain}</p>
                </td>
                <td>
                  <div className="flex justify-end space-x-2">
                    <IconContext.Provider value={{ size: "20" }}>
                      <UpdateButton institution={institution} />
                      <DeleteButton institutionId={institution._id!} />
                    </IconContext.Provider>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex flex-row space-x-8 justify-end">
        <div className="flex items-center">
          <span className="text-gray-600">Rows per page:</span>
          <div>
            <select
              className="select"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-gray-600">
            {startItem} - {endItem} of {filteredData.length}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <IconContext.Provider value={{ size: "20" }}>
            <button
              type="button"
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={handleFirstPage}
            >
              <GoArrowLeft />
            </button>
            <button
              type="button"
              className={`${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <GoChevronLeft />
            </button>
            <button
              type="button"
              className={`${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <GoChevronRight />
            </button>
            <button
              type="button"
              className={`${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={handleLastPage}
            >
              <GoArrowRight />
            </button>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};
