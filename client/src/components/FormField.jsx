import React from 'react'
import { Categories } from '../constants/categories'
import { types } from '../constants/types'

const FormField = ({ labelName,name, accept, placeholder, inputType, isTextArea, isSelectArea, isSelectType, value, handleChange,styles }) => {
  
  
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">{labelName}</span>
      )}
    
      
      {isTextArea ? 
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
       : isSelectArea ? 
        <>
     
          <select
            required
            value={value}
            onChange={handleChange}
             className='py-[15px] sm:px-[25px] px-[15px] text-[14px] bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
             >
           {Categories.map((option) => (
             <option 
            
             key={option.id}
             value={option.value}
             >{option.label}</option>
           ))}
         </select>
         </>: 
        
        isSelectType ? <>

        <select
            required
            value={value}
            onChange={handleChange}
             className='py-[15px] sm:px-[25px] px-[15px] text-[14px] bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
             >
           {types.map((option) => (
             <option 
            
             key={option.id}
             value={option.value}
             >{option.label}</option>
           ))}
         </select>
         </> 
              :
        <input 
          required
          name={name}
          value={value}
          onChange={handleChange}
          type={inputType}
          accept={accept}
          step="0.1"
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] ${styles}`}
        />
       
      }
    </label>
  )
}

export default FormField