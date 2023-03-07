import React, { useState, useEffect } from 'react'
import CustomButton from './CustomButton';
import { useStateContext } from '../context';
import { truncate } from '../utils';
import Loading from './Loading'
import Loader from './Loader';
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

const DisplayAdminCampaigns=({pId,status, title, handleClick})=> {

  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [approved,setApproved]= useState(status);


  const {address, contract,approveCampaigns, cancelCampaigns}= useStateContext();

  const handleVerifyApprove= async()=>{
    setIsLoading(true)
    await approveCampaigns(pId);
    setApproved(true)
    setIsLoading(false)

  }
  console.log(status)
 
  const handleVerifyDisApprove =async()=>{
  
    
      setIsLoading(true)
     await cancelCampaigns(pId); 
     setApproved(false)
     
    
    setIsLoading(false)
  
}

  
  return (
   
   <div className='flex flex-row justify-between items-center w-full rounded-[15px] px-4 h-[90px]  bg-[#1c1c24] text-blue-500 ' >
      {isLoading && <Loader />}
      {isWaiting && <Loading/>}
      <div className='flex items-center gap-4 cursor-pointer w-[200px]' onClick={handleClick}>
        <Icon styles="bg-gray-400 shadow-secondary" imgUrl={paymentreq} />
        <h1 className='uppercase font-bold text-white'>{truncate(title, 4, 4, 11)}</h1>

      </div>
      <div className='flex gap-4'>
    {address == '0xA2ADF0362490B7de632907AbA251c98DDC9F4222' ?
    <>
    {approved   ?
   
   
     <CustomButton
     title="Disapprove"
     btnType="button"  
     styles={"bg-red-500 sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
     handleClick={()=>{
       if (address) handleVerifyDisApprove()
                 else connect();
     }}
     />:
     <CustomButton
     title="Approve"
     btnType="button"  
     styles={"bg-[#0b5b8d] sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
     handleClick={()=>{
       if (address) handleVerifyApprove()
                 else connect();
     }}
     />}
     {/* {disapproved ? 
      <CustomButton
      title="Disapprove"
      btnType="button"  
      styles={"bg-gray-300 text-black sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
      
      />:
      <CustomButton
      title="Disapprove"
      btnType="button"  
      styles={"bg-red-500 sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
      handleClick={()=>{
        if (address) handleVerifyDisApprove()
                  else connect();
      }}
      />}
    */}
     </>
  
    :
    ''
  }
      </div>

    </div>
  )
}

export default DisplayAdminCampaigns