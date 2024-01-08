import { useEffect, useState } from "react";
import { userRole } from "../enums/UserRole";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotAuthorized from "./NotAutorized";

const EditPatient = () => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [OIB, setOIB] = useState("");
  const [MBO, setMBO] = useState("");
  const [insurance, setInsurance] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const response = await fetch(`/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        const formattedDateOfBirth = new Date(data.dateOfBirth)
          .toISOString()
          .split("T")[0];

        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setOIB(data.OIB);
        setMBO(data.MBO);
        setInsurance(data.insurance);
        setDateOfBirth(formattedDateOfBirth);
      }
    };
    fetchPatientDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patient = {
      dateOfBirth,
      firstName,
      lastName,
      email,
      phone,
      role: userRole.Patient,
      address,
      OIB,
      MBO,
      insurance,
    };

    const patientCopy = JSON.parse(JSON.stringify(patient));
    const response = await fetch(`/api/user/editUser/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patientCopy),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      navigate("/Patients");
    }
  };

  const returnToPatients = () => {
    navigate("/Patients");
  };

  if (!user || (user && user.role === userRole.Patient))
    return <NotAuthorized />;

  return (
    <div className='flex justify-center items-start min-h-screen mt-6'>
      <div
        className='bg-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-out'
        key='patientRegistration'
      >
        <h2 className='p-3 text-3xl font-bold text-purple-400'>eHealth</h2>
        <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
        <h3 className='text-xl font-semibold text-blue-400 pt-1'>
          Edit Patient
        </h3>

        <div className='flex space-x-2 items-center justify-center'></div>

        <form className='editPatient' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center mt-2'>
            <input
              key='firstName'
              name='firstName'
              type='text'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>

            <input
              key='lastName'
              name='lastName'
              type='text'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>

            <input
              key='patemail'
              name='email'
              type='email'
              autoComplete='email'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>

            <input
              key='tel'
              name='tel'
              type='tel'
              autoComplete='tel'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>

            <input
              key='address'
              name='address'
              type='text'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>

            <input
              key='OIB'
              name='OIB'
              type='number'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='OIB'
              value={OIB}
              onChange={(e) => setOIB(e.target.value)}
            ></input>

            <input
              key='MBO'
              name='MBO'
              type='number'
              pattern='[0-9]{9}'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='MBO'
              value={MBO}
              onChange={(e) => setMBO(e.target.value)}
            ></input>

            <input
              key='insurance'
              name='insurance'
              type='text'
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Insurance'
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
            ></input>
            <input
              type='date'
              key='start'
              defaultValue={new Date().toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              className='rounded-2xl px-2 py-1 w-full lg:w-80 border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            ></input>

            <button className='submitButton mt-3 mb-2'>Edit</button>
            <p
              className='text-violet-700 mb-4 text-sm cursor-pointer'
              onClick={returnToPatients}
            >
              Return to all patients
            </p>
            {error && <div className='error'>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

const EditPatientForm = () => {
  return (
    <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen md:py-2'>
      <main className=' w-full px-2 md:px-20'>
        <EditPatient />
      </main>
    </div>
  );
};

export default EditPatientForm;
