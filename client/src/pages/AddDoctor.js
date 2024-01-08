import React from "react";
import RegisterForm from "../components/RegisterForm";

const AddDoctor = () => {
  return (
    <div className='addDocror bg-gray-50 h-screen'>
      <div className='flex justify-center items-start min-h-screen pt-10'>
        <RegisterForm />
      </div>
    </div>
  );
};

export default AddDoctor;
