import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  return (
    <div className='bg-gray-100 flex flex-col items-start justify-center-top min-h-screen md:py-2 px-2 md:py-2'>
      <div className='flex items-center w-full px-2 md:px-20 mt-20'>
        <div className='ml-4 hidden md:inline-flex flex-col flex-1 space-y-1'>
          <p className='text-5xl text-violet-500 font-bold'>eHealth</p>
          <p className='text-lg leading-1 text-blue-400'>
            Check/Make your appointments, contact doctor/patient and more..
          </p>
        </div>
        {isLogin ? (
          <LoginForm isLogin={isLogin} toggleForm={toggleForm} />
        ) : (
          <RegisterForm isLogin={isLogin} toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Login;
