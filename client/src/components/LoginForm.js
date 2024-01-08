import { useLogin } from "../hooks/useLogin";
import React, { useRef } from "react";

const LoginForm = ({ isLogin, toggleForm }) => {
  const { login, loginIsLoading, error } = useLogin();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    await login(email, password);
  };
  return (
    <div
      className='bg-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-out'
      key='loginF'
    >
      <h2 className='p-3 text-3xl font-bold text-violet-400'>eHealth</h2>
      <div className='inline-block border-[1px] justify-center w-20 border-blue-400 border-solid'></div>
      <h3 className='text-xl font-semibold text-blue-400 pt-2'>Sign In!</h3>
      <div className='flex space-x-2 m-4 items-center justify-center'></div>

      <form className='login' onSubmit={handleSubmit}>
        <div className='flex flex-col items-center justify-center'>
          <input
            name='email'
            type='email'
            autoComplete='email'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='Email'
            ref={emailRef}
          ></input>
          <input
            name='pass'
            type='password'
            autoComplete='current-password'
            className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
            placeholder='Password'
            ref={passwordRef}
          ></input>

          <button
            className='rounded-2xl m-2 text-white bg-blue-400 w-3/5 px-4 py-2 shadow-md hover:bg-white transition duration-200 ease-in'
            disabled={loginIsLoading}
          >
            Sign In
          </button>
        </div>
      </form>
      {error && <div className='error text-red-400'>{error}</div>}
      <div className='inline-block border-[1px] justify-center w-20 border-blue-400 border-solid'></div>
      <p className='text-blue-400 mt-4 text-sm'>Don't have an account?</p>
      <p
        className='text-blue-400 mb-4 text-sm cursor-pointer'
        onClick={toggleForm}
      >
        {isLogin ? "Create a New Account" : "Sign In to Your account"}{" "}
      </p>
    </div>
  );
};

export default LoginForm;
