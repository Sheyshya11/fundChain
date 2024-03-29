import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect,useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';



const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xcf93d099011236108392c4E3A7946ce366E58c16');//0xAE12e07dD0150677aaAc8454Be3C9285b4afa662
 
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { mutateAsync: createRequest } = useContractWrite(contract, 'createRequest');

  const sdk = useSDK();
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const getbalance=async()=>{
    const balance = await sdk.wallet.balance();
      return balance;
  }
  
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.category,
        form.openFunding,
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image,
        form.approvalRate
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
      openFunding: campaign.openFunding,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      amountReleased: ethers.utils.formatEther(campaign.amountReleased.toString()),
      validFund: ethers.utils.formatEther(campaign.validFund.toString()),
      image: campaign.image,
      approvalRate: parseFloat(campaign.approvalRate.toString()),
      status: campaign.status,
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
        form.image,
        form.image_license,
        form.file
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
    voteCount: request.voteCount.toNumber(),
    complete: request.complete,
    rId: i,
    image_license: request.image_license,
    file: request.file
  }));

  return parsedRequests;
  }
 
  const getUserRequests = async () => {
    const allRequests = await getRequests();

    const filteredRequests = allRequests.filter((request) => request.creator === address );
 

    return filteredRequests;
  }

  const donate = async (pId, amount, name) => {
    const data = await contract.call('donateToCampaign', pId, name, { value: ethers.utils.parseEther(amount)});
    return data;
  }
 
  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;
    console.log(donations)
    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donatorname: donations[0][i],
        donator: donations[1][i],
        donation: ethers.utils.formatEther(donations[2][i].toString())
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

  const approveRequest = async(rId)=>{
    try{
      const data = await contract.call('voteForRequest',rId);
      console.log("Successfully approved request",data);
    }
    catch(error){
      console.log("Error approving request",error);
    }
    
  }
  
  const getVoters = async(rId)=>{
    const voters = await contract.call('getVoter', rId);
    const numberOfVoters = voters.length;

    const parsedVoters = [];

    for(let i = 0; i < numberOfVoters; i++) {
      parsedVoters.push({
        voter: voters[i]
      })
    }

    return parsedVoters;
  }

  const finalizeRequest = async(rId, amount)=>{
    const data = await contract.call('finalizeRequest', rId, { value: ethers.utils.parseEther(amount)})
    return data;
  }

  const edit = async(pId, description)=>{
    try{
    const data = await contract.call('editDescription',pId,description);
    console.log("Successfully edited",data)
    }catch(error){
      console.log("Failed to edit",error)
    }

  }

  const refund = async(pId, adress, amount)=>{
    
       const data = await contract.call('refund',pId, adress, { value: ethers.utils.parseEther(amount)});
      return data;
  }

  const hasVoted = async(pId)=>{
    try{
    const data = await contract.call('hasVoted',pId);
    console.log('Donator has voted',data);
    }
    catch(error){
      console.log('Not voted',error)
    }

  }
 
  const getVoted = async(pId)=>{
    const voted = await contract.call('getVoted',pId);
    const numberOfVoted = voted.length;

    const parsedVoted = [];

    for(let i = 0; i < numberOfVoted; i++) {
      parsedVoted.push({
        voted: voted[i]
      })
    }
     
    return parsedVoted;

  }
  const getRefundedAddress=async(pId)=>{
    const refunded = await contract.call('getRefundedAddress',pId);
    const numberOfRefunds = refunded.length;

    const parsedRefunded = [];

    for(let i = 0; i < numberOfRefunds; i++) {
      parsedRefunded.push({
        RefundAddress: refunded[i]
      })
    }
     
    return parsedRefunded;
  }

  const approveCampaigns =async(pId)=>{
    try{
    const data = await contract.call('approveCampaigns',pId);
    console.log('Successfully approve campaign',data);}
    catch(error){
      console.log('Failed to approve campaign',error);
    }

  }

  const cancelCampaigns=async(pId)=>{
    try{
      const data = await contract.call('cancelCampaigns',pId);
      console.log('Successfully canceled campaign',data);}
      catch(error){
        console.log('Failed to cancel campaign',error);
      }

  }

  const getOpenValidFund = async(pId)=>{
   const data= await contract.call('getOpenValidFund',pId);
   return data;
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
        getUserRequests,
        approveRequest,
        getVoters,
        finalizeRequest,
        edit,
        getbalance,
        refund,
        hasVoted,
        getVoted,
        getRefundedAddress,
        approveCampaigns,
        cancelCampaigns,
        getOpenValidFund
      
    }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);