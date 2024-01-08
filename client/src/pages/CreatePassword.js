import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreatePassword } from "../hooks/usecreatePassword";

const SetPassword = () => {
  const { userID, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { createPassword, error } = useCreatePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPassword(userID, token, password, confirmPassword);
  };

  return (
    <div className='flex justify-center items-start min-h-screen mt-20'>
      <div
        className='justify-center bg-gradient-to-b from-violet-500 to-white-300 text-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-in'
        key='regForm'
      >
        <h2 className='p-3 text-3xl font-bold text-white'>
          Set up your password
        </h2>
        <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
        <div className='flex space-x-2 m-4 items-center justify-center'></div>

        <form className='registerUser' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center mt-2'>
            <input
              name='password'
              type='password'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <input
              name='confirmPassword'
              type='password'
              className='rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] text-black border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
              placeholder='confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>

            <button className='rounded-2xl m-4 text-purple-700 bg-white w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-purple-400 transition duration-200 ease-in'>
              Submit
            </button>
            {error && <div className='error text-purple-700'>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
