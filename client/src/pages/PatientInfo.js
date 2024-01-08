import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Image from "../components/Image";
import ReactPaginate from "react-paginate";
import { userRole } from "../enums/UserRole";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from "react-bootstrap/Spinner";
import NotAuthorized from "../components/NotAutorized";

const PatientInfo = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [patient, setPatient] = useState(null);
  const [patientCharts, setPatientCharts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    patientCharts?.slice(indexOfFirstPost, indexOfLastPost) || [];

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  let formattedDateOfBirth = "N/A";

  if (patient && patient.dateOfBirth) {
    const dateOfBirth = new Date(patient.dateOfBirth);
    if (!isNaN(dateOfBirth.getTime())) {
      formattedDateOfBirth = dateOfBirth.toLocaleDateString();
    }
  }

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const response = await fetch(`/api/user/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setPatient(data);
      }
    };
    if (user) {
      fetchPatientDetails();
    }
  }, [user, id]);

  useEffect(() => {
    const fetchPatientCharts = async () => {
      const response = await fetch(`/api/patientChart/getPatientCharts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setPatientCharts(data);
      }
    };
    if (user) {
      fetchPatientCharts();
    }
  }, [user, id]);

  const formatDate = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  const renderImages = (images) => {
    if (images.length === 0) {
      // Render a default image when there are no images
      return (
        <div className='image-container'>
          <img
            src='https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400_6.png'
            alt='Default'
            className='default-image'
          />
        </div>
      );
    }

    return images.map((image, index) => {
      return (
        <div key={index} className='image-container'>
          <Image image={image} />
        </div>
      );
    });
  };

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className=' bg-gray-50 pl-10 min-h-screen'>
      {patient ? (
        <div className='flex flex-col sm:flex-row md:flex-row'>
          <div className='patient-info-card mt-8 block max-w-[18rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'>
            <div className='relative overflow-hidden bg-cover bg-no-repeat'>
              <img
                className='rounded-t-xl'
                src='https://media.istockphoto.com/id/1065782564/photo/electronic-medical-record-with-patient-data-and-health-care-information-in-tablet-doctor.jpg?s=612x612&w=0&k=20&c=BeTN2FUR7xHx-dz36BAEIhnojxhGbAGSc5eWmmnfiVo='
                alt=''
              />
            </div>

            <div className='p-2 flex flex-col'>
              <h5 className='mb-2 text-xl font-medium leading-tight text-neutral-800'>
                {patient.firstName} {patient.lastName}
              </h5>
              <p className='text-base text-neutral-600'>{patient.email}</p>
            </div>
            <ul className='w-full'>
              <li className='w-full border-b-2 border-neutral-100 border-opacity-100 px-6 py-3 dark:border-opacity-50'>
                OIB: {patient.OIB}
              </li>
              <li className='w-full border-b-2 border-neutral-100 border-opacity-100 px-6 py-3 dark:border-opacity-50'>
                MBO: {patient.MBO}
              </li>
              <li className='w-full border-b-2  border-neutral-100 border-opacity-100 px-6 py-3 dark:border-opacity-50'>
                Date of Birth: {formattedDateOfBirth}
              </li>
              <li className='w-full border-neutral-100 border-opacity-100 px-6 py-3 dark:border-opacity-50'>
                Address: {patient.address}
              </li>
            </ul>

            <div className='p-2'>
              {user && user.role !== userRole.Patient && (
                <Link to={`/patients/addPatientChart/${patient._id}`}>
                  <button className='rounded-2xl m-2 text-white bg-purple-500  px-4 py-2 shadow-md transition duration-200 ease-in'>
                    <i className='bi bi-clipboard-data'>Add appointment data</i>
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className='mt-2  w-full sm:w-[75%] md:w-[75%]'>
            <div className='text-center'>
              <p className='text-2xl text-violet-500 font-bold mb-4'>
                Patient Chart
              </p>
            </div>
            <div className='flex flex-col sm:flex-row md:flex-row'>
              {patientCharts === null ? (
                <div className='flex items-center justify-center w-full'>
                  <Spinner animation='border' role='status' variant='secondary'>
                    <span className='visually-hidden'>Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {patientCharts.length > 0 ? (
                    currentPosts.map((chart) => (
                      <div className='xl:ml-10 ' key={chart._id}>
                        <div className='block max-w-[50rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-50 patient-chart-card'>
                          <div className='relative overflow-hidden bg-cover bg-no-repeat image-container'>
                            {renderImages(chart.images)}
                          </div>
                          <div className='p-6 '>
                            <p className='text-base text-neutral-600 border-b-2 border-neutral-200 '>
                              <span className='border-b-2 border-neutral-200 pr-2 italic'>
                                Visit date
                              </span>
                              <h5 className='mb-2 text-sm font-small leading-tight text-neutral-800'>
                                {formatDate(chart.createdAt)}
                              </h5>
                            </p>
                            <p
                              className='text-base text-neutral-600 mt-3'
                              style={{ minHeight: "100px" }}
                            >
                              <span className='border-b-2 border-neutral-200 pr-2 italic'>
                                Diagnosis
                              </span>
                              <p className='text-base text-neutral-800 '>
                                {chart.data}
                              </p>
                            </p>
                          </div>
                          <div className='m-2'>
                            <hr />
                            <p className='text-base text-neutral-600'>
                              <span className='border-b-2 border-neutral-800 pr-2 italic'>
                                Condition
                              </span>
                              <h5 className='mb-2 text-sm font-small leading-tight text-neutral-800'>
                                {chart.condition}
                              </h5>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No patient charts available.</p>
                  )}
                </>
              )}
            </div>

            {patientCharts && patientCharts.length > postsPerPage && (
              <div className='flex justify-center mt-4'>
                <ul className='pagination'>
                  <ReactPaginate
                    onPageChange={paginate}
                    pageCount={Math.ceil(patientCharts.length / postsPerPage)}
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
          </div>
        </div>
      ) : (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <Spinner animation='border' role='status' variant='secondary'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInfo;
