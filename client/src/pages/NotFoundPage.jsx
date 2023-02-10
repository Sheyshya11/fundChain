import React from 'react';
import { notfound } from '../assets';
import { CustomButton } from '../components';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
const Navigate = useNavigate();
return(
  <div className="flex flex-col items-center h-screen text-center mt-[200px] ">
    <img
      className="w-64 h-64 mb-10"
      src={notfound}
      alt="404"
    />
 
    <p className="text-xl text-gray-500">
      Oops! The page you were looking for doesn't exist.
    </p>
    <CustomButton
    title="Go to home page"
    btnType="button"
    styles={"bg-[#ec243b] mt-10  box-border px-4 py-4"}
    handleClick={()=>Navigate('/dashboard')}

    />
  </div>
)}

export default NotFoundPage;
