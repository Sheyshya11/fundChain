import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';


import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb, creatoricon } from '../assets';


const RequestDetails = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, deleteCampaign, connect  ,getRequest} = useStateContext();

  const [isLoading, setIsLoading] = useState(false);

  console.log(state)

  

 


  return (
    <div>

      {isLoading && <Loader />}


      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title={`Goal`} value={state.goal} />
        </div>
      </div>

    
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Recipient</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={creatoricon} alt="user" className=" object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.recipient}</h4>

              </div>
            </div>
          </div>




          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

         

        </div>

      </div>
    </div>
  )
}

export default RequestDetails;
