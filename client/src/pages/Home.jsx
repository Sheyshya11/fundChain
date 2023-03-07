import React, { useState, useEffect} from 'react'
import { DisplayCampaigns} from '../components';
import { useStateContext} from '../context'
import { useLocation, useNavigate } from 'react-router-dom';
import {CustomButton} from '../components';


const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [tempCampaigns, setTempCampaigns] = useState([]);
  const [openCampaigns, setOpenCampaigns] = useState([]);
  const [closeCampaigns, setCloseCampaigns] = useState([]);
  const navigate = useNavigate()
 
  const {
    address,
    contract,
    getCampaigns
  } = useStateContext();

 
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    const filterarray = data.filter((state) => {
      return state.title !== '' && state.status;
    });
    const filterOpen= data.filter((state)=>{
      return state.openFunding && state.title !== '' && state.status;
    })
    const filterClose= data.filter((state)=>{
      return !state.openFunding && state.title !== '' && state.status;
    })
    setCampaigns(filterarray);
    setTempCampaigns(filterarray)
    setOpenCampaigns(filterOpen)
    setCloseCampaigns(filterClose)
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) {
      fetchCampaigns();

    }
  }, [address, contract]);

const handleOpen=()=>{
setCampaigns(openCampaigns)
}
 
const handleClose=()=>{
setCampaigns(closeCampaigns)
}
const handleAll=()=>{
setCampaigns(tempCampaigns)
}

 

  return (
  <>
  <div className='flex flex-row justify-start gap-4 items-center'>
   <CustomButton
          btnType="button"
          title={'All Campaign'}
          styles={' w-[140px] min-h-[45px] bg-purple-600'}
          handleClick={() => {
           handleAll();
          }}
        />
         <CustomButton
          btnType="button"
          title={'Open'}
          styles={' w-[140px] min-h-[45px] bg-purple-600'}
          handleClick={() => {
            handleOpen();
          }}
        />
         <CustomButton
          btnType="button"
          title={'Close'}
          styles={' w-[140px] min-h-[45px] bg-purple-600'}
          handleClick={() => {
           handleClose();
          }}
        />
        </div>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
  <DisplayCampaigns title="All Campaigns"
    isLoading={isLoading}
    campaigns={campaigns}
   
  />
  </>
  )
}

export default Home