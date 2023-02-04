import React from 'react';
import { notfound } from '../assets';

const NotFoundPage = () => (
  <div className="flex flex-col items-center h-screen text-center mt-[200px] ">
    <img
      className="w-64 h-64 mb-10"
      src={notfound}
      alt="404"
    />
 
    <p className="text-xl text-gray-500">
      Oops! The page you were looking for doesn't exist.
    </p>
  </div>
);

export default NotFoundPage;
