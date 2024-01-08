import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { userRole } from "../enums/UserRole";
import { useNavigate } from "react-router-dom";

const PatientForm = () => {
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
  const [doctors, setDoctors] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const response = await fetch("/api/user/allDoctors", {
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    const json = await response.json();

    if (response.ok) {
      setDoctors(json);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDoctors();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const doctorID =
        user.role === userRole.Doctor ? user._id : selectedDoctor;
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
      const response = await fetch(`/api/auth/registerPatient/${doctorID}`, {
        method: "POST",
        body: JSON.stringify(patientCopy),
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        navigate("/Patients");
      }
    }
  };
  return (
    <div className='flex justify-center items-start min-h-screen mt-2'>
      <div
        className='bg-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-out'
        key='patientRegistration'
      >
        <h2 className='p-3 text-3xl font-bold text-purple-400'>eHealth</h2>
        <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
        <h3 className='text-xl font-semibold text-blue-400 pt-1'>
          Register Patient
        </h3>

        <div className='flex space-x-2 m-3 items-center justify-center'></div>

        <form className='registerPatient' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center '>
            <input
              key='firstName'
              name='firstName'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='First Name'
              onChange={(e) => setFirstName(e.target.value)}
            ></input>

            <input
              key='lastName'
              name='lastName'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Last Name'
              onChange={(e) => setLastName(e.target.value)}
            ></input>

            <input
              key='patemail'
              name='email'
              type='email'
              autoComplete='email'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            ></input>

            <input
              key='tel'
              name='tel'
              type='tel'
              autoComplete='tel'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Phone'
              onChange={(e) => setPhone(e.target.value)}
            ></input>

            <input
              key='address'
              name='address'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Address'
              onChange={(e) => setAddress(e.target.value)}
            ></input>

            <input
              key='OIB'
              name='OIB'
              type='number'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='OIB'
              onChange={(e) => setOIB(e.target.value)}
            ></input>

            <input
              key='MBO'
              name='MBO'
              type='number'
              pattern='[0-9]{9}'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='MBO'
              onChange={(e) => setMBO(e.target.value)}
            ></input>

            <input
              key='insurance'
              name='insurance'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Insurance'
              onChange={(e) => setInsurance(e.target.value)}
            ></input>
            <input
              type='date'
              key='start'
              defaultValue={new Date().toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              onChange={(e) => setDateOfBirth(e.target.value)}
            ></input>
            {user && user.role === userRole.Admin && (
              <select
                name='doctor'
                className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value=''>Select a doctor</option>
                {doctors &&
                  doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
              </select>
            )}

            <button className='rounded-2xl m-4 text-purple-700 bg-white w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-purple-400 transition duration-200 ease-in'>
              Register
            </button>
            {error && <div className='error'>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

const RegisterPatientForm = () => {
  return (
    <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen md:py-2'>
      <main className=' w-full px-2 md:px-20'>
        <PatientForm />
      </main>
    </div>
  );
};

export default RegisterPatientForm;
