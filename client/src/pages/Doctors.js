import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { userRole } from "../enums/UserRole";
import NotAuthorized from "../components/NotAutorized";
import { userStatus } from "../enums/UserStatus.js";
import { DeactivationConfirmation } from "../components/DeactivationConfirmation.js";

const Doctors = () => {
  const { user } = useAuthContext();

  const [doctors, setDoctors] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [action, setAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = doctors?.slice(indexOfFirstPost, indexOfLastPost) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const openModal = (patient) => {
    setSelectedDoctor(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      let response;
      if (action === "search") {
        if (searchInput.trim() !== "") {
          try {
            response = await fetch(`/api/user/searchDoctors/${searchInput}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            setDoctors(json);
          } catch (error) {
            console.error("Error searching doctors:", error);
          }
        }
      } else {
        response = await fetch("/api/user/allDoctors", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const json = await response.json();
        if (response.ok) {
          setDoctors(json);
        }
        if (action === "clear") {
          setSearchInput("");
          setAction("none");
        }
      }
    };
    if (user) {
      fetchDoctors();
    }
  }, [user, action, searchInput]);

  const handleSearch = async (event) => {
    event.preventDefault();
  };

  if (!user || (user && user.role !== userRole.Admin)) {
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
            <Link to='/AddDoctor'>
              <button className='rounded-2xl text-purple-800 bg-neutral-50 px-2 py-2 shadow-md hover:bg-purple-500 hover:text-neutral-50 border border-purple-800 transition duration-200 ease-in lg:px-8'>
                <i className='bi bi-person-add'></i> Add doctor
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
                        Phone
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
                    {doctors ? (
                      currentPosts.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className='border-b transition duration-300 ease-in-out hover:bg-slate-100 dark:border-slate-200 dark:hover:bg-slate-100'
                        >
                          <td className='whitespace-nowrap px-6 py-4'>
                            {doctor.firstName} {doctor.lastName}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {doctor.email}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {doctor.phone}
                          </td>

                          <td className='whitespace-nowrap px-6 py-4'>
                            <Link to={`/doctors/edit/${doctor._id}`}>
                              <i className='bi bi-pen text-purple-800 text-xl hover:bg-purple-700 hover:text-neutral-50'></i>
                            </Link>
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            <button
                              onClick={() => openModal(doctor)}
                              className='border border-purple-800  text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-600 hover:text-neutral-50 transition duration-200 ease-in'
                            >
                              {doctor.state === userStatus.Active ? (
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
                        <td colSpan='5'>
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
        {doctors && doctors.length > postsPerPage && (
          <div className='flex justify-center mt-4'>
            <ul className='pagination'>
              <ReactPaginate
                onPageChange={paginate}
                pageCount={Math.ceil(doctors.length / postsPerPage)}
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
          selectedUser={selectedDoctor}
        />
      </div>
    </div>
  );
};

export default Doctors;
