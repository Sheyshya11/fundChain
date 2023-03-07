import React,{useState,useEffect} from 'react'
import { DisplayAdminCampaigns } from '../components'
import { useStateContext} from '../context'
import { useLocation, useNavigate } from 'react-router-dom';
import { loader } from '../assets';

const AdminPanel=()=> {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

 
  const {
    address,
    contract,
    getCampaigns
  } = useStateContext();

 
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    const filterarray = data.filter((state) => {
      return state.title !== '';
    })
    setCampaigns(filterarray);
    setIsLoading(false);
  }
  useEffect(() => {
    if (contract) {
      fetchCampaigns();

    }
  }, [address, contract]);
    
  const navigate = useNavigate();


  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}/${campaign.pId}`, { state: campaign })
  }
  
  return (
  <div>
         <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
         <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">All campaigns ({campaigns.length})</h1>

<div className="flex flex-wrap mt-[20px] gap-[26px]">

  {isLoading && (
    <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
  )}

  {!isLoading && campaigns.length === 0 && (
    <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
      You have not created any campigns yet
    </p>
  )}
  
  {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <DisplayAdminCampaigns
    key={campaign.pId}
    pId={campaign.pId}
    {...campaign}
    handleClick={() => handleNavigate(campaign)}
  />)}
</div>
   </div>
  )
}

export default AdminPanel