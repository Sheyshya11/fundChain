import React, { useState, useEffect } from 'react'
import { creatoricon, tagType, vote } from '../assets';
import CustomButton from './CustomButton';
import { useStateContext } from '../context';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { paymentreq } from '../assets';
import { truncate } from '../utils';
import Loader from './Loader';




const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (

  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && ' bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const RequestBox = ({ rId, campaignId, creator, title, description, goal, recipient, image, approved,complete, voteCount, handleClick }) => {
  const { address, connect, getDonations, contract, approveRequest, finalizeRequest, getVoters, getRequests } = useStateContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
 
  const [voters,setVoters] = useState([])
  const [uniqueDonator, setUniqueDonator] = useState([]);
  let [count, setCount] = useState(voteCount)
  
  const [isLoading, setIsLoading] = useState(false);
  const DonationNumber = (Math.floor(donations.length / 2 + 1))
  


  const fetchDonators = async () => {
    setIsLoading(true)
    const data = await getDonations(rId);
    const filterdata= data.map(d=>d.donator)
    const uniquedata = ()=>{
      return [...new Set(filterdata)];
    }
    setUniqueDonator(uniquedata)
    setDonations(data);
    setIsLoading(false)
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address ])


  const fetchVoters=async()=>{
    const data = await getVoters(rId);
    const newdata= data.map(voter=>voter.voter)
    setVoters(newdata)    
  
  }

  useEffect(() => {
    if (contract) {
      fetchVoters();
    }
  }, [contract, address])


  const handleVote = async (rId) => {
 
    if (uniqueDonator.includes(address)) {
      if (voteCount <= DonationNumber) {
        if(!voters.includes(address)) {
        setIsLoading(true)
         await approveRequest(rId);
          setCount(count+1); 
          navigate(`/request-details/${rId}`)  
        setIsLoading(false)
      
        
      }
      else {
        alert('Already voted')
      }}
      else{
      alert('voting reached')
      }
    
  }
    else {
      alert("only donator can vote");
    }
   
  };

  

  const handleFinalize = async (rId, goal) => {
    if (address) {
      if (creator == address) {
        if(!complete){
        setIsLoading(true)
        await finalizeRequest(rId, goal);
        navigate(`/request-details/${rId}`)
        setIsLoading(false)}
        else{
          alert('Request is already approved.')
        }
      }
      else {
        alert('Only creator can finalize request')
      }
    }
    else {
      connect();
    }
    
  }
  
  return (

    <div className='flex flex-row justify-between items-center w-full rounded-[15px] px-4 h-[90px]  bg-[#1c1c24] text-blue-500 ' >
      {isLoading && <Loader />}
   
      <div className='flex items-center gap-4 cursor-pointer w-[200px]' onClick={handleClick}>
        <Icon styles="bg-gray-400 shadow-secondary" imgUrl={paymentreq} />
        <h1 className='uppercase font-bold text-white'>{truncate(title, 4, 4, 11)}</h1>

      </div>
      <div className='flex'>
        <h1 className='uppercase font-light text-white'>{goal}</h1>

      </div>
      <div>
        {approved ?  <p>{count}/{count}</p>:  <p>{count}/{DonationNumber}</p>}
       
      </div>
      <div className='flex gap-4'>
       
        {address == creator  ?
        <>
            {complete ? <CustomButton
            btnType="button"
            title="Finalize"
            styles={"bg-gray-300 text-black sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
            
          />:<CustomButton
            btnType="button"
            title="Finalize"
            styles={"bg-[#0b5b8d] sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
            handleClick={() => {
              if (address) handleFinalize(rId, goal)
              else connect();
            }}
          /> }
           </>:
           <>
           {approved ?  <CustomButton
           btnType="button"
           title="Approve"
           styles={"bg-gray-300 sm:w-[140px] text-black min-w-[90px] box-border px-4 py-4"}
          
         /> :
         <CustomButton
         btnType="button"
         title="Approve"
         styles={" bg-[#7024ec]  sm:w-[140px] min-w-[90px] box-border px-4 py-4"}
         handleClick={() => {
           if (address) {
             handleVote(rId)}
           else connect()
         }}
       />
         }
         </>
         


        }

      </div>




    </div>

  )

}

export default RequestBox