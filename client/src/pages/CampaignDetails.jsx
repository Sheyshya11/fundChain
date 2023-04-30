import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader, ShareCampaign, FormField, Loading } from '../components';
import { calculateBarPercentage, daysLeft, truncate } from '../utils';
import { creatoricon } from '../assets';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CampaignDetails = () => {

  const navigate = useNavigate();
  const { donate, getDonations, contract, address, deleteCampaign, connect,refund,
     getCampaigns, edit } = useStateContext();

  const { id } = useParams();
  const [campaigns, setCampaigns] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false)
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [donations, setDonations] = useState([]);
  const [voters, setVoters] = useState([])
  const [refundAdd, setRefundAdd] = useState([])

 /*  const [voted, setVoted] = useState([]) */
  const [uniqueDonator, setUniqueDonator] = useState([]);
  const [edited, setEdited] = useState(false)
  const [showMore, setShowMore] = useState(false);
  const remainingDays = daysLeft(campaigns.deadline);
  //to store edit
  const [form, setForm] = useState({
    description: ''
  });


  //Calculations and formatting
  const intId = parseInt(id)
  
  const difference = (new Date(campaigns.deadline).getTime()) - Date.now();
  /* const difference = 0; */
  const hour = difference / (3600 * 1000);
  const minute = difference/(60 * 1000 )
  const remainingHour = hour.toFixed(0)
  const remainingMinute = minute.toFixed(0);
  

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const fetchCampaigns = async () => {
    setIsWaiting(true);
    const data = await getCampaigns();
    const filterarray = data.filter((state) => {
      return state.pId === intId;
    });
    let [filteredObject] = filterarray;
    setCampaigns(filteredObject);
    setIsWaiting(false);
  }

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }

  }, [address, contract, edited]);

  //displays loader while refreshing page
  useEffect(() => {
    setIsWaiting(true)
  }, []);

 



  const fetchDonators = async () => {
    const data = await getDonations(id);
    const filterdata = data.map(d => d.donator)
    const uniquedata = () => {
      return [...new Set(filterdata)];
    }
    setUniqueDonator(uniquedata)
    data.sort((a, b) => b.donation - a.donation)
    setDonations(data);
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();

    }

  }, [contract, address, name])

  /* const fetchVoters = async () => {
    const data = await getVoters(campaigns.pId);
    const newdata = data.map(voter => voter.voter)
    setVoters(newdata)

  }
  useEffect(() => {
    if (contract) {
      fetchVoters();
    }
  }, [contract, address]) */

  /* const fetchrefunds=async()=>{
    const data= await getRefundedAddress(campaigns.pId);
    const newdata = data.map(voter => voter.RefundAddress)
   
    setRefundAdd(newdata)
  }
  useEffect(() => {
    if (contract) {
      fetchrefunds();
    }
  }, [contract, address])
 */

  const notify = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }

  const handleCreateRequest = async (pId) => {
    navigate(`/create-request/${pId}`, { state: campaigns })

  }

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsWaiting(true)
    await edit(intId, form.description)
    setIsWaiting(false);
    setEdited(false)
  }
 
console.log(campaigns)
  const handleDonate = async (e) => {
    e.preventDefault();
   if (address && campaigns.status) {
      if (address !== campaigns.owner) {
        if (amount > 0.000001 &&  name.length < 16) {
          if (amount <= campaigns.target - campaigns.amountCollected || campaigns.openFunding) {
            if(remainingMinute>0){
            setIsLoading(true);
            await donate(campaigns.pId, amount, name);
            navigate(`/view-request/${campaigns.pId}`)
            setIsLoading(false);}
            else{
              notify('Deadline already expired')
            }
          }
          else {
            notify('Donation exceeds campaign target');
            setAmount(' ');
           setName('')
          }
        }
        else {
          notify('Invalid input')
          setAmount(' ');
        setName('')
        }
      }
      else {
        notify('Campaign owner cannot donate to their own campaign');
        setAmount(' ');
        setName('')
      }
    }
    else {
      connect();
     notify('Login with metamask')
    }
  }

  const handleNavigate = (pId) => {
    navigate(`/view-request/${pId}`, { state: campaigns })
  }

  const handleDelete = async () => {

    if (address == campaigns.owner)
     {
   
      setIsLoading(true);
      await deleteCampaign(campaigns.pId);
      navigate('/dashboard');
      setIsLoading(false);}
    
    
    else {
      notify('owner can only delete');
    }

  }
  console.log(donations)

  const handleRefund = async()=>{
    let amount = 0;
    
    if(campaigns.amountReleased == 0 ){
   
      if(uniqueDonator.includes(address)){
       //add if the donator has not voted then can refund
      
       for (let i=0;i<donations.length;i++){
        if(address == donations[i].donator){
          amount+=donations[i].donation;
        }
      }
        setIsLoading(true);
        await refund(campaigns.pId,address,amount);
        setIsLoading(false);
      
      }
      else{
        notify('Not a donator')
      }
    }
    else{
    notify('Amount has already released, cant refund')
    }
  }

  return (
    <div>

      {isLoading && <Loader />}
      {isWaiting && <Loading />}
      {edited  && <>
        <div
          className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300`}
        >
          <div
            className="bg-[#13131a] shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
          >
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
              <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Edit Story</h1>
            </div>

            <form onSubmit={handleEdit} className="w-full mt-[65px] flex flex-col gap-[30px]">
              <div className="flex flex-wrap gap-[40px]">
                <FormField
                  labelName="Story *"
                  placeholder="Write your story"
                  isTextArea
                  value={form.description}
                  handleChange={(e) => handleFormFieldChange('description', e)}
                />
              </div>
              <div className="flex gap-4 justify-center items-center mt-[40px]">

                <CustomButton
                  btnType="submit"
                  title="Edit Description"
                  styles="bg-[#1dc071] w-1/4"
                />

                <CustomButton
                  btnType="button"
                  title="Cancel"
                  styles="bg-red-500 w-1/4"
                  handleClick={() => { setEdited(false) }}
                />
              </div>
            </form>
          </div>
        </div>
      </>

      }


      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">

        <div className="flex-1 flex-col">
          <img src={campaigns.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className=" w-full h-[5px] bg-[#3a3a43] mt-2">  {/* relative and absolute missing if any error */}
            <div className=" h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(campaigns.target, campaigns.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          {remainingMinute <= 0 ? <CountBox styles="text-red-600" title="Days Left" value='Expired' /> : <>{remainingHour <= 24 ? <CountBox title="Hours Left" value={remainingHour} /> :
            <CountBox title="Days Left" value={remainingDays} />}</>}
          {campaigns.target == campaigns.amountCollected ? <CountBox styles="text-green-400" title={`Raised of ${campaigns.target}`} value={campaigns.amountCollected} /> : <CountBox title={`Raised of ${campaigns.target}`} value={campaigns.amountCollected} />}
          <CountBox title="Total Backers" value={uniqueDonator.length} />
        </div>
      </div>


      <div className='flex flex-row justify-between items-center w-[86%] rounded-[5px] px-4 h-[40px] mt-5  bg-[#1c1c24] text-blue-500 ' >
        <div className='flex items-center  w-full justify-around '>

          <div className='flex flex-row gap-3 uppercase text-white font-epilogue text-[#808191]'>Amount released :
            <p className='text-green-400 font-bold'>{campaigns.amountReleased}</p>
          </div>
          {address == campaigns.owner ? <div className='flex flex-row gap-3 uppercase text-white font-epilogue text-[#808191]'>Valid fund :   
          <p className='text-green-400 font-bold'>{campaigns.validFund}</p>
          </div> : ''  }
     
          <div className='flex flex-row gap-3 uppercase text-white font-epilogue text-[#808191]'>Campaign Type :
            <p className='text-green-400 font-bold'>{campaigns.openFunding ? 'Open' : 'Closed'}</p>
          </div>
          
          
        </div>
       

      </div>

      <div className='flex flex-row justify-start content-center my-[20px]'>

        {address == campaigns.owner && campaigns.status ?         
          <CustomButton
            btnType="button"
            title={'Create Request'}
            styles={ 'bg-[#7024ec] w-[160px] text-[14px]' }
            handleClick={() => {
              if (address) handleCreateRequest(campaigns.pId)
              else connect();  

            }}
          /> : ''}
          {campaigns.status ?
        <CustomButton
          btnType="button"
          title={'View Request'}
          styles={address == campaigns.owner ? 'bg-[#7024ec] w-[160px] ml-[20px] text-[14px]' : 'bg-[#7024ec] w-[160px] text-[14px]'}
          handleClick={() => {
            if(address){
            handleNavigate(campaigns.pId);}
            else{
              connect();
              notify('Login with metamask')
            }
          }}
        />
      : ''}

      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#0e7490] uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={creatoricon} alt="user" className=" object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">{campaigns.owner}</h4>

              </div>
            </div>
          </div>
          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div>
            <div className='flex flex-row justify-between'>
              <h4 className="font-epilogue font-semibold text-[18px] text-[#0e7490] uppercase">Story</h4>
              {address === campaigns.owner && campaigns.status ? <CustomButton
                title="Edit"
                btnType="button"
                styles="w-1/6 bg-[#1e293b]"
                handleClick={() => { setEdited(true) }}
              />
                :
                ''
              }

            </div>
            <div className="mt-[20px] ">

              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {showMore ? campaigns.description : `${campaigns.description?.substring(0, 350)}`}

                <button className="btn ml-[5px] text-white text-[14px] outline-none" onClick={() => setShowMore(!showMore)}>
                  {campaigns.description?.length < 350 ? '' : showMore ? "Show less" : "Show more"}

                </button>

              </p>
            </div>
          </div>
          <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#0e7490] uppercase">Donation History</h4>
            <div className='flex flex-row justify-between items-center w-full rounded-[5px] my-3 px-4 h-[50px]  bg-[#1c1c24] text-blue-500 ' >
              <div className='flex items-center w-[260px] justify-start '>

                <p className='text-white'>Donator/Backer</p>
              </div>

              <div className='flex items-center mr-[40px] w-[180px] justify-center'>
                <p className='text-white'>Address</p>
              </div>
              <div className='flex items-center mr-[10px] w-[180px] justify-end'>
                <p className='text-white'>Amount(ETH)</p>
              </div>

            </div>
            


            <div className="mt-[20px] flex flex-col gap-4">

              {donations.length > 0 ? donations.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-bold text-[16px] w-[170px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. 
                  {showMore ? item.donatorname : `${item.donatorname?.substring(0,15)}`}
              
                  </p>
                  <p className="font-epilogue font-normal text-[16px]  text-[#808191] leading-[26px] mr-[20px] break-ll">{truncate(item.donator, 4, 4, 11)}</p>
                  <div className='bg-green-500 flex justify-center rounded-[5px] bg-green-400 mr-[20px] w-[100px] '>
                  <p className=" font-epilogue font-normal text-[16px] text-black  leading-[26px]  break-ll">{item.donation}</p>
                  </div>
                </div>
                
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
              <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            {campaigns.target == campaigns.amountCollected ? <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]"> HOORAY!! </p>
              : <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]"> Fund the campaign </p>}


            <div className="mt-[30px]">
              <form onSubmit={handleDonate}>
              {campaigns.target == campaigns.amountCollected ? <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-green-400"> Successfully Raised Funds </p> :
                <>
                  <input
                    type="number"
                    required
                    placeholder="Enter Eth greater than 0.000001"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full mt-2 py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </>
              }


              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>


              {campaigns.target == campaigns.amountCollected ?
                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles={"bg-gray-300 w-full text-black bg-[#1dc071]"}

                />
                :
                <CustomButton
                  btnType="submit"
                  title="Fund Campaign"
                  styles="w-full bg-[#1dc071]"
      
                />}
                 
                <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}        
          theme="light"
        />
                 {address == campaigns.owner && donations.length == 0 ? <CustomButton
                btnType="button"
                title="Delete Campaign"
                styles="w-full bg-[#ED5E68] mt-[10px]"
                handleClick={handleDelete}
              /> : ''}
        
              </form>
              <ShareCampaign />
            </div>
    
          </div>
          {/* {uniqueDonator.includes(address) ? 
         <div className="flex-1">
         <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
           <CustomButton
           title="Refund"
           btnType="button"
           styles="w-full  bg-red-400"
           handleClick={()=>{
             handleRefund();
           }}
           />
           </div>
           </div>
           
           : ''
        } */}
         
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;
