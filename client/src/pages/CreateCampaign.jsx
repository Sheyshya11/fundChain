import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader, ErrorBox } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStorageUpload } from "@thirdweb-dev/react";



const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [values, setValue] = useState(null);
  const [types, setType] = useState(null);
  const [file, setFile] = useState();
  const { mutateAsync: upload } = useStorageUpload();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    category: '',
    openFunding: '',
    target: '',
    deadline: '',
    image: '',
    approvalRate: ''
  });

  const curDate = new Date().getTime();
  const parseDeadline = new Date(form.deadline).getTime();


  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }
  const handleSelectfieldCHange = (e) => {
    setValue(e.target.value);
  }
  const handleSelectTypeCHange = (e) => {
    setType(e.target.value === 'true');
  }


  console.log(form.image)
  useEffect(() => {
    setValue('Education');
  }, [])

  useEffect(() => {
    setType(false);
  }, [])
  console.log(form)

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseDeadline > curDate) {
      setIsLoading(true)
      const uploadUrl = await upload({
        data: [file],
        options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
      });

      await createCampaign({ ...form, image: uploadUrl[0], category: values, openFunding: types, target: ethers.utils.parseUnits(form.target, 18) })
      setIsLoading(false);
      notify("Your campaign has been added for review")
      navigate('/dashboard');
    
    }
    else {

      notify('Deadline should be in the future')
      setForm({ ...form, deadline: '' });

    }
   
  }



  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}

      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
          <FormField
            labelName="Category *"
            isSelectArea
            value={values}
            handleChange={(e) => handleSelectfieldCHange(e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />


        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">

          <FormField
            labelName="Type *"
            isSelectType
            value={types}
            handleChange={(e) => handleSelectTypeCHange(e)}
          />

          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="number"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />

          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>
        <FormField
            labelName="Approval Rate *"
            placeholder="Approval Rate (10-100)"
            inputType="number"
            value={form.approvalRate}
            handleChange={(e) => handleFormFieldChange('approvalRate', e)}
          />

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="file"
          accept="image/*"
          handleChange={(e) => setFile(e.target.files[0])}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
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
  )
}

export default CreateCampaign