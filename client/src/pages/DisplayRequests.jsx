import React, { useState, useEffect} from 'react'
import { useStateContext} from '../context'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loader } from '../assets';
import { RequestBox, CustomButton } from '../components';
import { withdraw } from '../assets';
import { Icons } from 'react-toastify';

const DisplayRequests = () => {
  const { address, contract, getRequests, getCampaigns} = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState({});
  const [donators,setDonators] = useState([]);
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

 const intId = parseInt(id)

  const handleNavigate = (request) => {
    navigate(`/request-details/${request.rId}`, { state: request })
  }
  const fetchCampaigns = async () => {
   
    const data = await getCampaigns();
    const filterarray = data.filter((req) => {
      return req.pId==intId;
    });
    let [filteredObject] = filterarray;
    setCampaigns(filteredObject);
    
    
  }
  useEffect(()=>{
    if(address){
      fetchCampaigns();
    }
  },[address,contract])


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
  }, [address,contract]);


  return ( <div>
    <div className='flex flex-row justify-between items-center'>
    <h1 className="flex font-epilogue font-semibold text-[18px] text-white text-left">{`All Requests`} ({requests.length})</h1>
     <CustomButton
     btnType="button"
     title="Go to Campaign Page"
     styles="flex bg-[#008080]  min-h-[48px] items-center "
     handleClick={()=>{
        navigate(`/campaign-details/${campaigns.title}/${campaigns.pId}`)
     }}
     />
     
    </div>
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
          Request has not been created yet
        </p>
      )}
      

      {!isLoading && requests.length > 0 && requests.map((request) => <RequestBox
        key={request.rId}
        rId={request.rId}
        amountCollected={campaigns.amountCollected}
        amountReleased={campaigns.amountReleased}
        approvalRate={campaigns.approvalRate}
        {...request}
        handleClick={() => handleNavigate(request)}
      />)}
    </div>
  </div>
  )
}

export default DisplayRequests