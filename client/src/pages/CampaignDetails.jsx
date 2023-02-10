import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader, ShareCampaign } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { creatoricon } from '../assets';


const CampaignDetails = () => {

  const navigate = useNavigate();
  const { donate, getDonations, contract, address, deleteCampaign, connect, getCampaigns } = useStateContext();

  const { id } = useParams();
  const [campaigns, setCampaigns] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [donations, setDonations] = useState([]);
  const [uniqueDonator, setUniqueDonator] = useState([]);

  const remainingDays = daysLeft(campaigns.deadline);
  const intId = parseInt(id)

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    const filterarray = data.filter((state) => {
      return state.pId === intId;
    });
    let [filteredObject] = filterarray;
    setCampaigns(filteredObject);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }

  }, [address, contract]);


  const fetchDonators = async () => {
    const data = await getDonations(id);
    const filterdata= data.map(d=>d.donator)
    const uniquedata = ()=>{
      return [...new Set(filterdata)];
    }
    setUniqueDonator(uniquedata)
    setDonations(data);
  }
 

  useEffect(() => {
    if (contract) {
      fetchDonators();

    }

  }, [contract, address])


  const handleCreateRequest = async (pId) => {
    navigate(`/create-request/${pId}`, { state: campaigns })

  }

console.log(typeof(daysLeft(campaigns.deadline)))

  const handleDonate = async (e) => {
    e.preventDefault();
    if (address) {
      if (address !== campaigns.owner) {
        if (amount > 0) {
          if (amount <= campaigns.target - campaigns.amountCollected) {
            setIsLoading(true);
            await donate(campaigns.pId, amount);
            navigate(`/view-request/${campaigns.pId}`)
            setIsLoading(false);
          }
          else {
            alert('Donation exceeds campaign target');
          }
        }
        else {
          alert('INVALID INPUT');
        }
      }
      else {
        alert('Campaign owner cannot donate to their own campaign');
      }
    }
    else {
      connect();
    }
  }

  const handleNavigate = (pId) => {
    navigate(`/view-request/${pId}`, { state: campaigns })
  }

  const handleDelete = async () => {

    if (address == campaigns.owner) {
      setIsLoading(true);
      await deleteCampaign(campaigns.pId);
      navigate('/home');
      setIsLoading(false);
    }
    else {
      alert('owner can only delete');
    }

  }



  return (
    <div>
     
      {isLoading && <Loader />}


      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={campaigns.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
          <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(campaigns.target, campaigns.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          {remainingDays == '-0' ? <CountBox styles="text-red-600" title="Days Left" value='Expired' /> : <CountBox title="Days Left" value={remainingDays} />}
          {/*  <CountBox title="Days Left" value={remainingDays} /> */}
         {campaigns.target==campaigns.amountCollected ?  <CountBox styles="text-green-400" title={`Raised of ${campaigns.target}`} value={campaigns.amountCollected} />:  <CountBox title={`Raised of ${campaigns.target}`} value={campaigns.amountCollected} />}
          <CountBox  title="Total Backers" value={uniqueDonator.length} />
        </div>     
      </div>
     
        
    <div className='flex flex-row justify-between items-center w-[86%] rounded-[5px] px-4 h-[40px] mt-5  bg-[#1c1c24] text-blue-500 ' >
      <div className='flex items-center gap-4 w-full justify-center '>
    
      <div className='flex flex-row gap-3 uppercase text-white font-epilogue text-[#808191]'>Amount released : 
       <p className='text-green-400 font-bold'>{campaigns.amountReleased}</p> 
       </div>
      </div>
   
      </div>

      <div className='flex flex-row justify-start content-center my-[20px]'>
        
        {address == campaigns.owner ? (
        <CustomButton
          btnType="button"
          title={'Create Request'}
          styles={' bg-[#7024ec] w-[160px] text-[14px] '}
          handleClick={() => {
            if (address) handleCreateRequest(campaigns.pId)
            else connect()
          }}
        />) : '' }
         <CustomButton
        btnType="button"
        title={'View Request'}
        styles={address == campaigns.owner? 'bg-[#7024ec] w-[160px] ml-[20px] text-[14px]': 'bg-[#7024ec] w-[160px] text-[14px]'  }
        handleClick={() => {
            handleNavigate(campaigns.pId);   
        }}
      />
       

        


      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={creatoricon} alt="user" className=" object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{campaigns.owner}</h4>

              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{campaigns.description}</p>
            </div>
          </div>
         
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donations.length > 0 ? donations.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            {campaigns.target == campaigns.amountCollected ? <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]"> HOORAY!! </p>
            :   <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]"> Fund the campaign </p>}
       
               
            <div className="mt-[30px]">
            {campaigns.target == campaigns.amountCollected ?  <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-green-400"> Successfully Raised Funds </p> :
             <input
             type="number"
             placeholder="ETH 0.1"
             step="0.01"
             className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
           /> 
            
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
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#1dc071]"
                handleClick={handleDonate}

              />}
            

           {/*    {address == campaigns.owner ? <CustomButton
                btnType="button"
                title="Delete Campaign"
                styles="w-full bg-[#ED5E68] mt-[10px]"
                handleClick={handleDelete}
              /> : ''} */}
              <ShareCampaign />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;
