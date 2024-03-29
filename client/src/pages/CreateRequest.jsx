import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStorageUpload } from "@thirdweb-dev/react";
import axios from 'axios'

const CreateRequest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { address, createRequest } = useStateContext();
  const [isValid, setIsValid] = useState(false)
  const [ValidOpenFundAmount, setValidOpenFundAmount] = useState();
  const [reqImage, setReqImage] = useState();
  const [licenseImage, setLicenseImage] = useState();
  const [file, setFile] = useState();
  const [encryptFile, setEncryptFile] = useState(null);
  const { mutateAsync: upload } = useStorageUpload();
  const [form, setForm] = useState({
    campaignId: '',
    title: '',
    description: '',
    goal: '',
    recipient: '',
    image: '',
    image_license: '',
    file: '',

  });
  const hexadecimalRegex = /^0x[0-9A-Fa-f]+$/;
  const difference = (new Date(state.deadline).getTime()) - Date.now();
  /* const difference = 0; */
  const minute = difference / (60 * 1000)
  const remainingMinute = minute.toFixed(0);

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
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  useEffect(() => {
    setIsValid(hexadecimalRegex.test(form.recipient));
  }, [form.recipient]);

  useEffect(() => {
    if ((state.openFunding) && (remainingMinute <= 0)) {
      setValidOpenFundAmount(state.amountCollected - (state.target - state.validFund));
    }
    else {
      setValidOpenFundAmount(state.validFund)
    }
  }, [])

console.log(state.validFund)
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (address === state.owner) {
      if (state.owner != form.recipient) {
        if (isValid) {
          if (form.goal <= state.validFund) {
            setIsLoading(true)

            const formData = new FormData();
            formData.append('encrypted_file', file);

            const response = await axios.post('https://fundchainserve.onrender.com/encrypt', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
              ,
              responseType: 'blob'
            })

            const blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' });
            var filess = new File([blob], file.name)
            console.log(filess)

            const uploadFile = await upload({
              data: [filess],
              options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            })
            console.log(uploadFile[0])
            window.open(uploadFile[0], '_blank');



            const uploadReqImage = await upload({
              data: [reqImage],
              options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            });

            const uploadImageLicense = await upload({
              data: [licenseImage],
              options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
            })


            await createRequest({
              ...form, image: uploadReqImage[0], image_license: uploadImageLicense[0], file: uploadFile[0], 
              campaignId: state.pId, goal: ethers.utils.parseUnits(form.goal, 18)
            })
            setIsLoading(false);
            navigate(`/view-request/${state.pId}`, { state: state});
          }
          else {
            notify('Greater than the valid amount.')
          }
        }
        else {
          notify('Invalid address')
        }
      }
      else {
        notify('Owner address cant be used as recipient address.')
      }
    }
    else {
      notify('Only owner can create Request');
    }


  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Fund Release Request</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">

        <FormField
          labelName="Request Title *"
          placeholder="Oxygen cylinders"
          inputType="text"
          value={form.title}
          handleChange={(e) => handleFormFieldChange('title', e)}
        />
        <FormField
          labelName="Recipient Address *"
          placeholder="0xA2AXXXXXXXXXXXXXX"
          inputType="text"
          value={form.recipient}
          handleChange={(e) => handleFormFieldChange('recipient', e)}
        />

        <FormField
          labelName="Amount *"
          placeholder="ETH 0.50"
          inputType="number"
          value={form.goal}
          handleChange={(e) => handleFormFieldChange('goal', e)}
        />

        <FormField
          labelName="Story *"
          placeholder="Write Your Story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <FormField
          labelName="Request image *"
          inputType="file"
          accept="image/*"
          handleChange={(e) => setReqImage(e.target.files[0])}
        />

        <FormField
          labelName="License image "
          inputType="file"
          accept="image/*"
          handleChange={(e) => setLicenseImage(e.target.files[0])}
        />

        <FormField
          labelName="Proposal *"
          name="encrypted_file"
          inputType="file"
          accept=".txt"
          handleChange={(e) => setFile(e.target.files[0])}
        />

        <div className="flex justify-center items-center mt-[20px]">
          <CustomButton
            btnType="submit"
            title="Submit new Request"
            styles="bg-[#1dc071]"

          />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="light"
        />
      </form>
    </div>
  )
}

export default CreateRequest