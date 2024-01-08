import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NotAuthorized from "./NotAutorized";
import { userRole } from "../enums/UserRole";

const EditDoctor = ({ isLogin, toggleForm }) => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [info, setInfo] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const response = await fetch(`/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone);
        setInfo(data.info);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctor = {
      email,
      firstName,
      lastName,
      phone,
      info,
    };

    const patientCopy = JSON.parse(JSON.stringify(doctor));
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
      navigate("/Doctors");
    }
  };

  if (!user || (user && user.role !== userRole.Admin)) return <NotAuthorized />;

  return (
    <div className='flex justify-center items-start min-h-screen mt-6'>
      <div
        className='bg-gradient-to-b from-violet-400 to-white-300 text-white rounded-2xl shadow-2xl  flex flex-col w-full  md:w-1/2 items-center max-w-4xl transition duration-1000 ease-in pb-4'
        key='regForm'
      >
        <h2 className='p-3 text-3xl font-bold text-white'>eHealth</h2>
        <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
        <h3 className='text-xl font-semibold text-white pt-2'>Edit Doctor</h3>

        <div className='flex space-x-2 m-4 items-center justify-center'></div>

        <form className='registerUser' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center mt-2'>
            <input
              name='firstName'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
            <input
              name='lastName'
              type='text'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
            <input
              name='email'
              type='email'
              autoComplete='email'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              name='tel'
              type='tel'
              autoComplete='tel'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='Phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
            <textarea
              name='description'
              className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0 resize-none'
              placeholder='About...'
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              cols='50'
              rows='5'
              style={{ color: "black" }}
            ></textarea>
            <button className='submitButton mt-3'>Edit</button>
          </div>
        </form>
        {error && <div className='error'>{error}</div>}
      </div>
    </div>
  );
};

const EditDoctorForm = () => {
  return (
    <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen md:py-2'>
      <main className=' w-full px-2 md:px-20'>
        <EditDoctor />
      </main>
    </div>
  );
};

export default EditDoctorForm;
