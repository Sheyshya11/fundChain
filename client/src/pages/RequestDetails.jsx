import React, { useState, useEffect } from 'react'
import {  useNavigate, useParams, useLocation } from 'react-router-dom';
import { underconstruct } from '../assets';
import { notfound } from '../assets';
import { CustomButton } from '../components';
import {Loading} from '../components';
import { useStorageUpload } from '@thirdweb-dev/react';
import {FormField} from '../components';
import { AES } from 'crypto-js';


const RequestDetails = () => {
  const [isWaiting, setIsWaiting] = useState(false)
  const { mutateAsync: upload } = useStorageUpload();
  const [file, setFile] = useState();
  const {state}= useLocation();


const handleUpload=async()=>{
 /*  const plaintext = 'This is a secret message!';
  const secretKey = 'my-secret-key';
  const ciphertext = AES.encrypt(file, secretKey).toString(); */

  let uploadUrl = await upload({
    data: [file],
    options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
  });


  
  fetch(uploadUrl[0])
  .then(response => response.text())
  .then(content => console.log(content))
  .catch(error => console.error(error)); 
  const reader = new FileReader();

  reader.readAsText(response.text());
  
  console.log(reader.result)
}


  return (<>
  

 <div>
    {isWaiting && <Loading/>}
 {/*  <img className='ml-[35%]' src= {underconstruct}></img> */}
 <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{state.title}</h2>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <p className="text-gray-600 mb-2 sm:mb-0">Created by: {state.creator}</p>
        <p className="text-gray-600">Recipient: {state.recipient}</p>
      </div>
      <div className='flex justify-center items-center'>
      <img src={state.image} alt={state.title} className="flex rounded-md w-1/2 h-[800px] shadow-md mb-6" />
      </div>

      <p className="text-gray-600 mb-4">Description: {state.description}</p>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <p className="text-gray-600 mb-2 sm:mb-0">Goal: {state.goal} ETH</p>
        <p className="text-gray-600">Campaign ID: {state.campaignId}</p>
      </div>
      <div className="flex items-center justify-between">
       
        <p className="text-gray-600">Status: {state.complete ? 'Completed' : 'Not completed'}</p>
      </div>
      <div>
      <FormField
          labelName="Request file *"
          placeholder="Place image URL of your Request"
          inputType="file"
         styles="text-black"
          handleChange={(e) => setFile(e.target.files[0])}
          />
          <CustomButton
          title="Upload"
          btnType="button"
          styles="text-red-200"
          handleClick={()=>{
            handleUpload();
          }}
          />
      </div>
    </div>

</div> 
 
    </>
  )
}

export default RequestDetails;
