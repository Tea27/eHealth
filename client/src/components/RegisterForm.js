import { useRegister } from "../hooks/useRegister";
import React, { useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { userRole } from "../enums/UserRole";

const RegisterForm = ({ isLogin, toggleForm }) => {
  const { user } = useAuthContext();

  const emailRef = useRef("");
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const phoneRef = useRef("");
  const infoRef = useRef("");
  const { register, response, isLoading } = useRegister();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const phone = phoneRef.current.value;
    const info = infoRef.current.value;
    await register(firstName, lastName, email, phone, info);
  };

  return (
    <div
      className='bg-gradient-to-b from-violet-400 to-white-300 text-white rounded-2xl shadow-2xl  flex flex-col w-full  md:w-1/2 items-center max-w-4xl transition duration-1000 ease-in'
      key='regForm'
    >
      <h2 className='p-3 text-3xl font-bold text-white'>eHealth</h2>
      <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
      {user && user.role === userRole.Admin ? (
        <h3 className='text-xl font-semibold text-white pt-2'>Add Doctor</h3>
      ) : (
        <h3 className='text-xl font-semibold text-white pt-2'>
          Create Account!
        </h3>
      )}
      <div className='flex space-x-2 m-4 items-center justify-center'></div>
      <form className='registerUser' onSubmit={handleSubmit}>
        <div className='flex flex-col items-center justify-center mt-2'>
          <input
            name='firstName'
            type='text'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='First Name'
            ref={firstNameRef}
          ></input>
          <input
            name='lastName'
            type='text'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='Last Name'
            ref={lastNameRef}
          ></input>
          <input
            name='email'
            type='email'
            autoComplete='email'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='Email'
            ref={emailRef}
          ></input>
          <input
            name='tel'
            type='tel'
            autoComplete='tel'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='Phone'
            ref={phoneRef}
          ></input>
          {user && user.role === userRole.Admin && (
            <textarea
              name='description'
              className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0 resize-none'
              placeholder='About...'
              ref={infoRef}
              cols='50'
              rows='5'
              style={{ color: "black" }}
            ></textarea>
          )}

          <button
            className='rounded-2xl m-4 text-violet-700 bg-white w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-violet-400 transition duration-200 ease-in'
            disabled={isLoading}
          >
            Register
          </button>
        </div>
      </form>
      {response && response.error && (
        <div className='error text-red-400'>{response.error}</div>
      )}
      <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
      {user && user.role === userRole.Admin ? null : (
        <>
          <p className='text-violet-700 mt-4 text-sm'>
            Already have an account?
          </p>
          <p
            className='text-violet-700 mb-4 text-sm cursor-pointer'
            onClick={toggleForm}
          >
            {isLogin ? "Create a New Account" : "Sign In to Your Account"}
          </p>
        </>
      )}
    </div>
  );
};

export default RegisterForm;
