import React from 'react'
import { creatoricon,tagType } from '../assets';
import CustomButton from './CustomButton';
import { useStateContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { paymentreq } from '../assets';


const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (

  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && ' bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const RequestBox = ({title, description, goal, recipient, image, handleClick}) => {
  const {address}= useStateContext();
  const navigate = useNavigate();
 


  return (
    
    <div className='flex flex-row justify-between items-center w-full rounded-[15px] px-4 h-[90px]  bg-[#1c1c24] text-blue-500 ' onClick={handleClick}>
      
      <div className='flex items-center gap-4 cursor-pointer w-[200px]'>
      <Icon styles="bg-gray-400 shadow-secondary" imgUrl={paymentreq} />
     <h1 className='uppercase font-bold text-white'>{title}</h1>
     
      </div>
       <div>
       <h1 className='uppercase font-light text-white'>{goal}</h1>
       </div>
      <div className='flex gap-4'>
      <CustomButton
       btnType="button"
       title="Approve"
       styles={"bg-green-400 min-w-[140px] box-border px-4 py-4"}
       handleClick={()=>{
       alert('clicked')
       }}
       />
       <CustomButton
       btnType="button"
       title="Disapprove"
       styles={"bg-red-400 min-w-[140px]  box-border px-4 py-4"}
       handleClick={()=>{
       alert('clicked')
       }}
       /></div>
    
      
 
     
    </div>

)
  
}

export default RequestBox