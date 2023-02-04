import React, { useState, useEffect} from 'react'
import { useStateContext} from '../context'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loader } from '../assets';
import { RequestBox } from '../components';


const DisplayRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const { state } = useLocation();
 
  const navigate = useNavigate();
  const { address, contract, getRequests, getCampaigns} = useStateContext();

  const handleNavigate = (request) => {
    navigate(`/request-details/${request.rId}`, { state: request })
  }
 
  
  const fetchRequests = async () => {
    setIsLoading(true);
    const data = await getRequests();
    const filterdata = data.filter((req)=>{
     return req.campaignId === state.pId
    })
    console.log(state)
    console.log(data)
    
    setRequests(filterdata);
    setIsLoading(false);

  } 
  
  useEffect(() => {
    if (contract) {
      fetchRequests();

    }
  }, [address, contract]);



  return ( <div>
    <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{`All ${state.title} Requests`} ({requests.length})</h1>

    <div className="flex flex-wrap mt-[20px] gap-[26px]">

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
        {...request}
        handleClick={() => handleNavigate(request)}
      />)}
    </div>
  </div>
  )
}

export default DisplayRequests