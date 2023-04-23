import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CustomButton } from '../components';
import { Loading } from '../components';

import { useStateContext } from '../context';
import { FormField } from '../components';


import { ThirdwebStorage } from "@thirdweb-dev/storage";


import axios from 'axios';



const RequestDetails = () => {
  const { address, getDonations, contract} = useStateContext();
  const [isWaiting, setIsWaiting] = useState(false)
  const navigate= useNavigate();
  const storage = new ThirdwebStorage();


  const [file, setFile] = useState(null);
  const [downloadfile, setDownloadFile] = useState(null)
  const { state } = useLocation();
  const [client, setClient] = useState(null);
  const [encryptFile, setEncryptFile] = useState(null);
  const [uniqueDonator, setUniqueDonator] = useState([]);
  const { id } = useParams();
  const intId = parseInt(id)


  const fetchDonators = async () => {
    setIsWaiting(true)
    const data = await getDonations(1);
    const filterdata = data.map(d => d.donator)
    const uniquedata = () => {
      return [...new Set(filterdata)];
    }
    setUniqueDonator(uniquedata)

    setIsWaiting(false)

  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address])






  const handleDecrypt = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('decrypt_file', downloadfile);
    try {
      const response = await axios.post('http://localhost:5000/decrypt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;
      console.log(data);

      const content = data.replace(/\r\n/g, '\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      console.log(blob);

      const file = new File([blob], 'decrypt.txt');
      console.log(file);

      const url = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'decrypt.txt';
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);

    } catch (error) {
      console.log(error);
    }
  };
  console.log(state)



  const handleDownload = async () => {

    const json = await storage.downloadJSON(state.file);
    window.open(state.file, '_blank')
    const blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
    var filess = new File([blob], 'Proposal.txt')
    console.log(filess)
    const url = URL.createObjectURL(filess);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Proposal.txt';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 0);

  }



  const handleDecryptFileChange = (event) => {
    setDownloadFile(event.target.files[0]);
  };



  return (<>


    <div>
      {isWaiting && <Loading />}


      <div className="p-6 bg-slate-300 h-[900px] w-full rounded-md shadow-md ">
        <h2 className="text-4xl font-semibold mb-4 text-center uppercase">{state.title}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <p className="text-green-900 mb-2 sm:mb-0">Created by: {state.creator}</p>
          <p className="text-green-900">Recipient: {state.recipient}</p>
        </div>
        <div className='flex justify-center items-center'>
          <img src={state.image} alt={state.title} className="flex rounded-full w-1/4 h-[300px] shadow-md mb-6 shadow-md" />
        </div>

        <div className='bg-slate-200  w-1/3 p-6 border-solid border-2 rounded-md shadow-xl'>
          <p className="text-green-900 mb-4">Description: {state.description}</p>

          <p className="text-green-900 mb-4">Goal: {state.goal} ETH</p>
          <p className="text-green-900 mb-4">Campaign ID: {state.campaignId}</p>


          <div className="flex items-center justify-between">

            <p className="text-green-900">Status: {state.complete ? 'Completed' : 'Not completed'}</p>
          </div>
        </div>
        <div className='flex flex-col'>

          <button onClick={handleDownload} className='bg-slate-500 w-[200px] rounded-md shadow-md p-1 text-white mt-[40px] '>CLick to Download Proposal</button>

          <br />
         {(uniqueDonator.includes(address) || (address==state.creator)) &&  <form id="decryptForm" onSubmit={handleDecrypt}>
            <input type="file" name="decrypt_file" onChange={handleDecryptFileChange} accept='.txt' />
            <button type="submit" className='bg-slate-500 w-[200px] rounded-md shadow-md p-1 text-white '>Decrypt</button>
          </form> }
         
          <CustomButton
     btnType="button"
     title="Go back"
     styles=" bg-[#008080]  min-h-[48px] w-[180px] items-center mt-[40px] "
     handleClick={()=>{
        navigate(`/view-request/${state.campaignId}`)
     }}
     />
        </div>
      </div>

    </div>

  </>
  )
}

export default RequestDetails;
