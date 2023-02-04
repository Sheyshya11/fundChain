import React from 'react'
import {toast, ToastContainer} from 'react-toastify'
import { loader } from '../assets';
import 'react-toastify/dist/ReactToastify.css';

const ErrorBox = () => {
    
  
  return (
    <div>
    <ToastContainer />
    {toast.error("Error", {
position: "bottom-center",
autoClose: 2000,
progress: undefined,
theme: "light",
})}
  </div>
  )
}

export default ErrorBox