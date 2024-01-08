import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import { userRole } from "../enums/UserRole";
import { useAuthContext } from "../hooks/useAuthContext";
import NotAuthorized from "../components/NotAutorized";
import { DeactivationConfirmation } from "../components/DeactivationConfirmation";
import { userStatus } from "../enums/UserStatus";

const Patients = () => {
  const { user } = useAuthContext();

  const [patients, setPatients] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [action, setAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = patients?.slice(indexOfFirstPost, indexOfLastPost) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      let response;

      if (action === "search") {
        if (searchInput.trim() !== "") {
          response = await fetch(
            `/api/user/searchPatients/${searchInput}/${user?._id}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
        }
      } else {
        response =
          user && user.role === userRole.Doctor
            ? await fetch(`/api/user/patientsByDoctor/${user?._id}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
              })
            : await fetch("/api/user/allPatients", {
                headers: { Authorization: `Bearer ${user?.token}` },
              });
        if (action === "clear") {
          setSearchInput("");
          setAction("none");
        }
      }

      if (response) {
        const json = await response.json();

        if (response.ok) {
          setPatients(json);
        }
      }
    };

    fetchPatients();
  }, [user, action, searchInput]);

  const handleSearch = async (event) => {
    event.preventDefault();
  };

  if (!user || (user && user.role === userRole.Patient)) {
    return <NotAuthorized />;
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-screen-xl mx-auto'>
        <div className='flex items-center'>
          <form className='flex-grow ml-5 mt-5' onSubmit={handleSearch}>
            <div className='max-w-md flex space-x-2'>
              <div className='flex rounded-md overflow-hidden w-full'>
                <input
                  type='text'
                  className='w-full rounded-md rounded-r-none px-2 py-1 text-base'
                  placeholder='Search...'
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <button
                  className='bg-white px-4 py-1 text-base font-semibold rounded-md'
                  onClick={() => setAction("clear")}
                >
                  <i class='bi bi-x-square'></i>
                </button>
                <button
                  className='bg-purple-500 text-white px-4 py-1 text-base font-semibold rounded-r-md'
                  onClick={() => setAction("search")}
                >
                  <i class='bi bi-search'></i>
                </button>
              </div>
            </div>
          </form>

          <div className='pt-4 pr-10'>
            <Link to='/registerPatient'>
              <button className='rounded-2xl text-purple-800 bg-neutral-50 px-2 py-2 shadow-md hover:bg-purple-700 hover:text-neutral-50 border border-purple-800 transition duration-200 ease-in lg:px-8'>
                <i className='bi bi-person-add'></i> Add patient
              </button>
            </Link>
          </div>
        </div>

        <div className='flex flex-col mt-2'>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='overflow-x-auto py-2 sm:px-6 lg:px-8 max-w-full mx-auto'>
              <div className='overflow-hidden'>
                <table className='w-full text-left text-sm font-light'>
                  <thead className='border-b bg-slate-100 dark:border-slate-200'>
                    <tr>
                      <th scope='col' className='px-6 py-4'>
                        Name
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Email
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        MBO
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        OIB
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Data
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Edit
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Manage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {user && patients ? (
                      currentPosts.map((patient) => (
                        <tr
                          key={patient._id}
                          className='border-b transition duration-300 ease-in-out hover:bg-slate-100 dark:border-slate-200 dark:hover:bg-slate-100'
                        >
                          <td className='whitespace-nowrap px-6 py-4 '>
                            {patient.firstName} {patient.lastName}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {patient.email}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {patient.MBO}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {patient.OIB}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <Link to={`/patients/${patient._id}`}>
                              <i className='bi bi-clipboard-data text-purple-800 text-xl hover:bg-purple-700 hover:text-neutral-50'></i>
                            </Link>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <Link to={`/patients/edit/${patient._id}`}>
                              <i className='bi bi-pen text-purple-800 text-xl hover:bg-purple-700 hover:text-neutral-50'></i>
                            </Link>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <button
                              onClick={() => openModal(patient)}
                              className='border border-purple-800  text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-700 hover:text-neutral-50 transition duration-200 ease-in'
                            >
                              {patient.state === userStatus.Active ? (
                                <span>Deactivate</span>
                              ) : (
                                <span className='px-2'>Activate</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='6'>
                          <div className='flex items-center justify-center'>
                            <div className='text-center'>
                              <Spinner
                                animation='border'
                                role='status'
                                variant='secondary'
                              >
                                <span className='visually-hidden'>
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {patients && patients.length > postsPerPage && (
          <div className='flex justify-center mt-4'>
            <ul className='pagination'>
              <ReactPaginate
                onPageChange={paginate}
                pageCount={Math.ceil(patients.length / postsPerPage)}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName={"pagination"}
                pageLinkClassName={"page-number"}
                previousLinkClassName={"page-item"}
                nextLinkClassName={"page-item"}
                breakClassName={"page-item"}
                activeLinkClassName={"active"}
              />
            </ul>
          </div>
        )}

        <DeactivationConfirmation
          isOpen={isModalOpen}
          closeModal={closeModal}
          selectedUser={selectedPatient}
        />
      </div>
    </div>
  );
};

export default Patients;
