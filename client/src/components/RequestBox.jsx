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
  /*   <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
    <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-[15px]"/>

    <div className="flex flex-col p-4">
      <div className="flex flex-row items-center mb-[18px]">
        <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
      </div>

      <div className="block">
        <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
      </div>

      <div className="flex justify-between flex-wrap mt-[15px] gap-2">
        <div className="flex flex-col">
          <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{values}</h4>
  
        </div>
      </div>

      <div className="flex items-center mt-[20px] gap-[12px]">
        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
          <img src={creatoricon} alt="user" className="w-1/2 h-1/2 object-contain"/>
        </div>
        <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">To <span className="text-[#b2b3bd]">{recipient}</span></p>
      </div>
    </div>
  </div> */
)
  
}

export default RequestBox