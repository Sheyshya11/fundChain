import React, { useState, useEffect} from 'react'
import { DisplayCampaigns} from '../components';
import { useStateContext} from '../context'
import { useLocation } from 'react-router-dom';



const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { state } = useLocation();

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
    });
    console.log(filterarray)
    setCampaigns(filterarray);
    setIsLoading(false);

  }

  useEffect(() => {
    if (contract) {
      fetchCampaigns();

    }
  }, [address, contract]);



  return (<DisplayCampaigns title="All Campaigns"
    isLoading={isLoading}
    campaigns={campaigns}
  />
  )
}

export default Home