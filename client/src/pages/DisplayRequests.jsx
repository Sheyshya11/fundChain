import React, { useState, useEffect} from 'react'
import { useStateContext} from '../context'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loader } from '../assets';
import { RequestBox } from '../components';
import { withdraw } from '../assets';
import { Icons } from 'react-toastify';

const DisplayRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donators,setDonators] = useState([]);
 

  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, contract, getRequests, getDonations} = useStateContext();
 const intId = parseInt(id)
  const handleNavigate = (request) => {
    navigate(`/request-details/${request.rId}`, { state: request })
  }
 

  const fetchRequests = async () => {
    setIsLoading(true);
    const data = await getRequests();
    const filterdata = data.filter((req)=>{
     return req.campaignId === intId 
    })
    setRequests(filterdata);
    setIsLoading(false);

  } 

  
  useEffect(() => {
    if (contract) {
      fetchRequests();

    }
  }, [address, contract]);

 /*  const fetchDonators = async () => {
    setIsLoading(true)
    const data = await getDonations(id);
    setDonations(data);
    const newArr = data.map(donate => donate.donator)
    setDonators(newArr)
    setIsLoading(false)
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address])
 */


  return ( <div>
    <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{`All Requests`} ({requests.length})</h1>

    <div className="flex flex-wrap mt-[20px] gap-[26px]">

    

    <div className='flex flex-row justify-between items-center w-full rounded-[15px] px-4 h-[90px]  bg-[#1c1c24] text-blue-500 ' >
      <div className='flex items-center gap-4 w-[260px] justify-start '>
      <img src={withdraw}></img>
        <p className='text-white'>Request title</p>
      </div>
      <div className='flex items-center w-[180px] justify-center'>
      <p className='text-white'>Goal</p>
      </div>
      <div className='flex items-center w-[180px] justify-center'>
      <p className='text-white'>Approval Count</p>
      </div>
      <div className='flex items-center w-[180px] justify-center'>
      <p className='text-white'>Action</p>
      </div>

      </div>

      {isLoading && (
        <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
      )}


      {!isLoading && requests.length === 0 && (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          You have not created any requests yet
        </p>
      )}
      

      {!isLoading && requests.length > 0 && requests.map((request) => <RequestBox
        key={request.rId}
        rId={request.rId}
        {...request}
        handleClick={() => handleNavigate(request)}
      />)}
    </div>
  </div>
  )
}

export default DisplayRequests