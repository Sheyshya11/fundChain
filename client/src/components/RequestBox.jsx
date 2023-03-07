import React, { useState, useEffect } from 'react'
import { creatoricon, tagType, vote } from '../assets';
import CustomButton from './CustomButton';
import { useStateContext } from '../context';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { paymentreq } from '../assets';
import { truncate } from '../utils';
import Loader from './Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';




const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (

  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && ' bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const RequestBox = ({ rId, campaignId, creator, title, description, goal, recipient, image, amountCollected,
   amountReleased, approved, complete, voteCount, approvalRate, handleClick }) => {
  const { address, connect, getDonations, contract, approveRequest, finalizeRequest, getVoters } = useStateContext();
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intId = parseInt(id)
  const [voters, setVoters] = useState([])
/*   const [voted, setVoted] = useState([]) */
  const [uniqueDonator, setUniqueDonator] = useState([]);

  let [count, setCount] = useState(voteCount)


  const DonationNumber = (Math.ceil(uniqueDonator.length* (approvalRate/100)))
   amountCollected = amountCollected - amountReleased;

  const fetchDonators = async () => {
    setIsWaiting(true)
    const data = await getDonations(intId);
    const filterdata = data.map(d => d.donator)
    const uniquedata = () => {
      return [...new Set(filterdata)];
    }
    setUniqueDonator(uniquedata)
    setDonations(data);
    setIsWaiting(false)

  }
console.log()
  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address])



  const fetchVoters = async () => {
    const data = await getVoters(campaignId);
    const newdata = data.map(voter => voter.voter)
    setVoters(newdata)

  }

  useEffect(() => {
    if (contract) {
      fetchVoters();
    }
  }, [contract, address])


  const notify = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }


  const handleVote = async (rId) => {

    if (uniqueDonator.includes(address)) {
      if (voteCount <= DonationNumber) {
        if (!voters.includes(address)) {
          setIsLoading(true)
          await approveRequest(rId);
       /*    await hasVoted(campaignId); */
          setCount(count + 1);
          navigate(`/request-details/${rId}`)
          setIsLoading(false)


        }
        else {
          notify('Already voted');
        }
      }
      else {
        notify('Voting reached')
      }

    }
    else {
      notify("Only Donator can vote");
    }

  };


console.log(voters)
  const handleFinalize = async (rId, goal) => {
    if (address) {
      if (creator == address) {
        if (!complete) {
          if (voteCount > 0 && DonationNumber == voteCount) {
            if (amountCollected >= goal) {

              setIsLoading(true)
              await finalizeRequest(rId, goal);
              navigate(`/request-details/${rId}`)
              setIsLoading(false)
            }
            else {
              notify('Not sufficient fund')
            }
          }
          else {
            notify('Not approved yet');
          }
        }
        else {
          notify('Request is already approved.')
        }
      }
      else {
        notify('Only creator can finalize request')
      }
    }
    else {
      connect();
    }

  }

  return (

    <div className='flex flex-row justify-between items-center w-full rounded-[15px] px-4 h-[90px]  bg-[#1c1c24] text-blue-500 ' >
      {isLoading && <Loader />}
      {isWaiting && <Loading/>}
      <div className='flex items-center gap-4 cursor-pointer w-[200px]' onClick={handleClick}>
        <Icon styles="bg-gray-400 shadow-secondary" imgUrl={paymentreq} />
        <h1 className='uppercase font-bold text-white'>{truncate(title, 4, 4, 11)}</h1>

      </div>
      <div className='flex'>
        <h1 className='uppercase font-light text-white'>{goal}</h1>

      </div>
      <div>
        {complete ? <p>{count}/{count}</p> : <p>{count}/{DonationNumber}</p>}

      </div>
      <div className='flex gap-4'>

        {address == creator ?
          <>
            {complete ? <CustomButton
              btnType="button"
              title="Finalize"
              styles={"bg-gray-300 text-black sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}

            /> : <CustomButton
              btnType="button"
              title="Finalize"
              styles={"bg-[#0b5b8d] sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
              handleClick={() => {
                if (address) handleFinalize(rId, goal)
                else connect();
              }}
            />}
          </> :
          <>
            {complete ? <CustomButton
              btnType="button"
              title="Approve"
              styles={"bg-gray-300 sm:w-[140px] text-black min-w-[90px] box-border px-4 py-4"}

            /> :
              <CustomButton
                btnType="button"
                title="Approve"
                styles={" bg-[#7024ec]  sm:w-[140px] min-w-[90px] box-border px-4 py-4"}
                handleClick={() => {
                  if (address) {
                    handleVote(rId)
                  }
                  else connect()
                }}
              />
              
            }
          </>
        }
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}        
          theme="light"
        />

      </div>
    </div>
  )
}

export default RequestBox