import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';



const CreateRequest = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { createRequest } = useStateContext();
  
  const [form, setForm] = useState({
    campaignId: '',
    title: '',
    description: '',
    goal: '',
    recipient: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value }) 
  }
 
 

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    checkIfImage(form.image, async (exists) => {
      if(exists) {
       if (state.owner != form.recipient){
        setIsLoading(true)
        await createRequest({ ...form, campaignId: state.pId, goal: ethers.utils.parseUnits(form.goal, 18)} )
        setIsLoading(false);
        navigate(`/view-request/${state.pId}`,{state: state});
       }
       else{
        alert('Owner address cant be used as recipient address.')
       }
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
        
      }
    })

    

     
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
          handleChange={(e)=>  handleFormFieldChange('title', e)}
          />
      <FormField
          labelName="Recipient Address *"
          placeholder="0xA2AXXXXXXXXXXXXXX"
          inputType="text"
          value={form.recipient}
          handleChange={(e)=>  handleFormFieldChange('recipient', e)}
          />

          <FormField 
            labelName="Amount *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.goal}
            handleChange={(e) => handleFormFieldChange('goal', e)}
          />
         
          <FormField
        labelName="Story *"
        placeholder="Write Your Story"
        isTextArea
        value={form.description}
        handleChange={(e)=> handleFormFieldChange('description', e)}
        />

        <FormField 
            labelName="Recipient Citizenship Image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new Request"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateRequest