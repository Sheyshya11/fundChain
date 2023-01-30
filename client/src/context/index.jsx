import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { useParams } from 'react-router-dom';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xeE38A877172BE5dd8a605876777C40d3E0f0b189');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { mutateAsync: createRequest } = useContractWrite(contract, 'createRequest');

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.category,
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }
 

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }
  const publishRequest = async(form)=>{
    try{
      const data = await createRequest([
        address,
        form.campaignId,
        form.title,
        form.description,
        form.goal,
        form.recipient,
        form.image
      ])
      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
    
  }
  const getRequests = async() =>{
  const requests = await contract.call('getRequests')
  const parsedRequests = requests.map((request, i) => ({
    creator: request.creator,
    title: request.title,
    description: request.description,
    goal: ethers.utils.formatEther(request.goal.toString()),
    recipient: request.recipient, 
    image: request.image,
    campaignId: request.campaignId.toNumber(),
    rId:i,
  }));

  return parsedRequests;
  }
 

  const getUserRequests = async () => {
    const allRequests = await getRequests();

    const filteredRequests = allRequests.filter((request) => request.creator === address);

    return filteredRequests;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const deleteCampaign = async(pId)=>{
    try {
      const data = await contract.call('deleteCampaign', pId);
      console.log("Successfully deleted campaign: ", data);
    } catch (error) {
      console.log("Error deleting campaign: ", error);
    }
   
  }
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        createRequest: publishRequest,
        getRequests,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        deleteCampaign,
        getUserRequests
    }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);