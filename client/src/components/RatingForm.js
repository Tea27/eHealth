import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rating } from "@material-tailwind/react";
import { useCreateReview } from "../hooks/useCreateReview";

import { Typography } from "antd";

const RatingForm = () => {
  const { id, token } = useParams();
  const [description, setDescription] = useState("");
  const [rated, setRated] = useState("4");
  const { createReview, error } = useCreateReview();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReview(id, token, description, rated);
    if (error) {
    } else {
      navigate("/Home");
    }
  };

  return (
    <div className='flex justify-center items-start min-h-screen mt-20'>
      <div
        className=' justify-center bg-gradient-to-b from-violet-500 to-white-100 text-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-in pb-4'
        key='regForm'
      >
        <h2 className='p-3 text-3xl font-bold text-white'>
          Rate your experience
        </h2>

        <div className='inline-block border-[1px] justify-center w-20 border-white border-solid'></div>
        <div className='mt-3 text-center px-4'>
          <p>
            Please take a moment and
            <br></br>
            let us know how your appointment was.
          </p>
        </div>
        <div className='flex space-x-2 m-2 items-center justify-center '></div>

        <form className='registerUser' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center'>
            <div className='textarea-container'>
              <textarea
                name='description'
                className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0 resize-none'
                placeholder='Enter your impressions...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols='60'
                rows='4'
                style={{ color: "black" }}
              ></textarea>
            </div>
            <div className='flex items-center gap-2 mt-3'>
              <Rating value={4} onChange={(value) => setRated(value)} />
              <Typography className='font-medium '>{rated}.0 Rated</Typography>
            </div>
            <button className='submitButton mt-4 pb-2'>Submit</button>
            {error && <div className='error'>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;
