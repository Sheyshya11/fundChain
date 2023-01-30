import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';


import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft, checkIfdonator } from '../utils';
import { thirdweb, creatoricon } from '../assets';


const CampaignDetails = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, deleteCampaign, connect  ,getRequest} = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donations, setDonations] = useState([]);
  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonations(data);
   
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
      
      }

  }, [contract, address])
 
  
  
  const handleCreateRequest = async(pId)=>{
    navigate(`/create-request/${pId}`,{state: state})

  }
 
  const handleDonate = async (e) => {
    e.preventDefault();
    if (address) {
      if (address !== state.owner) {
        if (amount > 0) {
          if (amount <= state.target - state.amountCollected) {
            setIsLoading(true);
            await donate(state.pId, amount);
            navigate('/home')
            setIsLoading(false);
          }
          else {
            alert('Donation exceeds campaign target');

          }
        }
        else {
          alert('INVALID INPUT');
        }
      }
      else {
        alert('Campaign owner cannot donate to their own campaign');
      }
    }
    else {
      connect();
    }
  }


  const handleNavigate = (pId) => {
    navigate(`/view-request/${pId}`, { state: state })
  }

console.log(state)

  const handleDelete = async () => {

    if (address == state.owner) {
      setIsLoading(true);
      await deleteCampaign(state.pId);
      navigate('/home');
      setIsLoading(false);
    }
    else {
      alert('owner can only delete');
    }

  }



  return (
    <div>

      {isLoading && <Loader />}


      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donations.length} />
        </div>
      </div>

      <div className='flex flex-row justify-start content-center my-[20px]'>
        {address == state.owner ? (<CustomButton
          btnType="button"
          title={'Create Request'}
          styles={' bg-[#8c6dfd] w-[160px] text-[14px] '}
          handleClick={() => {
            if (address) handleCreateRequest(state.pId)
            else connect()
          }}
        />) : ''}{address ?  <CustomButton
          btnType="button"
          title={'View Request'}
          styles={address!=state.owner ? 'bg-[#8c6dfd] w-[160px] text-[14px]': 'bg-[#8c6dfd] w-[160px] ml-[20px] text-[14px]'}
          handleClick={() => {
          if (address){
           
              handleNavigate(state.pId);
            
            
           }
           
            else {
            connect()
            }
          }}
        /> : ''

        }
      
  
      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={creatoricon} alt="user" className=" object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>

              </div>
            </div>
          </div>




          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donations.length > 0 ? donations.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>


          </div>

        </div>

        <div className="flex-1">
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#1dc071]"
                handleClick={handleDonate}

              />

              {address == state.owner ? <CustomButton
                btnType="button"
                title="Delete Campaign"
                styles="w-full bg-[#ED5E68] mt-[10px]"
                handleClick={handleDelete}
              /> : ''}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;
