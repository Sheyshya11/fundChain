import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader, ErrorBox } from '../components';
import { checkIfImage } from '../utils';



const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError,setLoadError] =useState(false);
  const { createCampaign } = useStateContext();
  const [values,setValue]=useState();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    category: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const curDate= new Date().getTime();
  const parseDeadline =  new Date(form.deadline).getTime();


  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value }) 
  }
  const handleSelectfieldCHange =(e) =>{
    setValue(e.target.value);
  }

  console.log(values)
 

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (parseDeadline>curDate){
    
    checkIfImage(form.image, async (exists) => {
      if(exists) {
      
        setIsLoading(true)
        await createCampaign({ ...form, category: values, target: ethers.utils.parseUnits(form.target, 18)} )
        setIsLoading(false);        
        navigate('/dashboard');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
        
      }
    })}
    else{

      alert('Deadline should be in the future')
      setForm({ ...form, deadline: '' });
     
    }
   
    console.log(loadError)

     
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
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
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
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign