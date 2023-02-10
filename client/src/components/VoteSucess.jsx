import React from 'react'
import CustomButton from './CustomButton'

const VoteSucess = ({rid}) => {
  return (
    <div className='flex w-full flex-col'>
    <p className='flex text-[50px] text-purple-400'>
       Successfully casted vote.
    </p>
    <CustomButton
    title="Go back"
    btnType="button"
    styles={"bg-[#0b5b8d] sm:min-w-[140px] min-w-[90px] box-border px-4 py-4"}
    handleClick={()=>{
        navigate(`/view-request/${rid}`)
    }}
    />
    </div>
  )
}

export default VoteSucess